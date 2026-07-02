"""Pipeline service: crawl → parse → verify → upsert into DB → publish files.

This is the backend equivalent of `scripts/update.py`, but writes structured
data into the database instead of flat files (though it still publishes the
flat files for backwards-compatible subscription URLs).
"""

from __future__ import annotations

import asyncio
import json
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import func, select, update

from app.config import get_settings
from app.database import db_session
from app.models import Node, NodeCheck, ProxySource, SourceFetchLog
from app.pipeline import _SCRIPTS_DIR  # noqa: F401  (ensures scripts/ on path)

# Import the existing, battle-tested pipeline modules.
from crawler import crawl  # type: ignore[import-not-found]
from parser import extract_node_links, node_to_clash_config, parse_proxy_api_response  # type: ignore[import-not-found]
from verifier import can_reach_public_internet, verify_nodes  # type: ignore[import-not-found]
from formatter import write_outputs  # type: ignore[import-not-found]
from utils import get_logger  # type: ignore[import-not-found]

logger = get_logger("pipeline")


def _now() -> datetime:
    return datetime.now(timezone.utc)


# In-memory task registry for manual refresh tracking.
_tasks: dict[str, dict] = {}


def _parse_node_fields(link: str) -> dict:
    """Extract structured fields from a raw node link via the existing parser."""
    cfg = node_to_clash_config(link)
    if not cfg:
        return {}
    protocol = link.split("://", 1)[0].lower()
    network = cfg.get("network", "tcp")
    # Collect transport-specific options into a JSON blob.
    transport: dict = {}
    if "ws-opts" in cfg:
        transport["ws-opts"] = cfg["ws-opts"]
    if "grpc-opts" in cfg:
        transport["grpc-opts"] = cfg["grpc-opts"]
    if "h2-opts" in cfg:
        transport["h2-opts"] = cfg["h2-opts"]
    sni = cfg.get("sni") or cfg.get("servername")
    if sni:
        transport["sni"] = sni
    if "skip-cert-verify" in cfg:
        transport["skip-cert-verify"] = cfg["skip-cert-verify"]

    auth_secret = ""
    if protocol == "vmess":
        auth_secret = cfg.get("uuid", "")
    elif protocol == "vless":
        auth_secret = cfg.get("uuid", "")
    elif protocol == "ss":
        auth_secret = cfg.get("password", "")
    elif protocol == "trojan":
        auth_secret = cfg.get("password", "")

    return {
        "protocol": protocol,
        "server": cfg.get("server", ""),
        "port": int(cfg.get("port", 0)),
        "auth_secret": str(auth_secret),
        "network": str(network),
        "tls": bool(cfg.get("tls", False)),
        "remark": str(cfg.get("name", "")),
        "transport_config": json.dumps(transport, ensure_ascii=False),
    }


async def run_full_pipeline(verify: bool | None = None, task_id: str | None = None) -> dict:
    """Execute the complete crawl→parse→verify→upsert→publish cycle.

    Runs blocking pipeline calls in a thread pool to avoid blocking the event
    loop. Returns a summary dict.
    """
    settings = get_settings()
    if verify is None:
        verify = settings.verify_nodes

    if task_id:
        _tasks[task_id] = {"status": "running", "started_at": _now()}

    try:
        summary = await asyncio.to_thread(_run_pipeline_sync, settings, verify)
        if task_id:
            _tasks[task_id] = {"status": "completed", "finished_at": _now(), **summary}
        return summary
    except Exception as exc:
        logger.exception("pipeline failed")
        if task_id:
            _tasks[task_id] = {"status": "failed", "finished_at": _now(), "error": str(exc)}
        raise


def _run_pipeline_sync(settings, verify: bool) -> dict:
    """Synchronous pipeline execution (runs in a worker thread)."""
    started = time.perf_counter()

    # 1. Crawl
    logger.info("starting crawl")
    raw = crawl()
    node_sources = raw["nodes"]
    proxy_sources = raw["proxies"]
    logger.info("fetched %d node sources, %d proxy sources", len(node_sources), len(proxy_sources))

    # 2. Parse node links
    all_links: list[str] = []
    for item in node_sources:
        links = extract_node_links(item["text"])
        all_links.extend(links)
    all_links = list(dict.fromkeys(all_links))
    logger.info("total unique node links: %d", len(all_links))

    # 3. Verify (optional)
    should_verify = verify and can_reach_public_internet()
    if should_verify and all_links:
        logger.info("verifying %d nodes", len(all_links))
        results = verify_nodes(
            all_links,
            max_workers=settings.verify_workers,
            geo_enabled=settings.geo_enabled,
            timeout=settings.verify_timeout,
        )
        # Map link -> result for upsert
        result_map = {r["link"]: r for r in results}
        alive_links = [r["link"] for r in results if r["alive"]][: settings.max_nodes]
    else:
        result_map = {}
        alive_links = all_links[: settings.max_nodes]

    # 4. Parse proxies
    all_proxies: list[str] = []
    for item in proxy_sources:
        proxies = parse_proxy_api_response(
            item["text"], default_scheme=item.get("proxy_scheme", "http")
        )
        all_proxies.extend(proxies)
    all_proxies = list(dict.fromkeys(all_proxies))[: settings.max_proxies]

    # 5. Upsert nodes into DB
    upserted, refreshed = asyncio.run(_upsert_nodes(alive_links, result_map, node_sources))
    logger.info("upserted %d nodes (%d refreshed)", upserted, refreshed)

    # 6. Publish flat files (backwards-compatible subscriptions)
    _publish_files(alive_links, all_proxies, result_map)

    elapsed = round(time.perf_counter() - started, 2)
    summary = {
        "node_sources": len(node_sources),
        "proxy_sources": len(proxy_sources),
        "total_links": len(all_links),
        "alive_nodes": len(alive_links),
        "upserted": upserted,
        "refreshed": refreshed,
        "proxies": len(all_proxies),
        "verified": should_verify,
        "elapsed_seconds": elapsed,
    }
    logger.info("pipeline done in %ss: %s", elapsed, summary)
    return summary


async def _upsert_nodes(links: list[str], result_map: dict, node_sources: list[dict]) -> tuple[int, int]:
    """Upsert parsed nodes into the database. Returns (new_count, updated_count)."""
    new_count = 0
    updated_count = 0

    # Build a source-name lookup from the crawl result order.
    source_name_by_link: dict[str, str] = {}
    for item in node_sources:
        src_name = item.get("name", "unknown")
        for link in extract_node_links(item["text"]):
            if link not in source_name_by_link:
                source_name_by_link[link] = src_name

    # Precompute fingerprints for all valid links (for upsert + soft-delete set).
    valid: list[tuple[str, dict, str]] = []  # (link, fields, fingerprint)
    for link in links:
        fields = _parse_node_fields(link)
        if not fields or not fields["server"] or not fields["port"]:
            continue
        fp = Node.compute_fingerprint(
            fields["protocol"], fields["server"], fields["port"], fields["auth_secret"]
        )
        valid.append((link, fields, fp))
    current_fingerprints = {fp for _, _, fp in valid}

    async with db_session() as session:
        now = _now()
        for link, fields, fingerprint in valid:
            result = result_map.get(link, {})
            is_alive = result.get("alive", False)
            latency = result.get("latency_ms")
            region = result.get("region", "unknown") or "unknown"
            fail_reason = result.get("error")

            existing = await session.scalar(
                select(Node).where(Node.fingerprint == fingerprint)
            )
            if existing:
                existing.raw_link = link
                existing.transport_config = fields["transport_config"]
                existing.tls = fields["tls"]
                existing.network = fields["network"]
                existing.remark = fields["remark"]
                existing.region = region
                existing.is_alive = is_alive
                existing.last_latency_ms = latency
                existing.last_checked_at = now
                existing.fail_reason = fail_reason
                existing.is_deleted = False
                existing.source_name = source_name_by_link.get(link, existing.source_name)
                existing.updated_at = now
                updated_count += 1
                node_id = existing.id
            else:
                node = Node(
                    fingerprint=fingerprint,
                    raw_link=link,
                    protocol=fields["protocol"],
                    server=fields["server"],
                    port=fields["port"],
                    auth_secret=fields["auth_secret"],
                    network=fields["network"],
                    transport_config=fields["transport_config"],
                    tls=fields["tls"],
                    remark=fields["remark"],
                    region=region,
                    source_name=source_name_by_link.get(link, "unknown"),
                    is_alive=is_alive,
                    last_latency_ms=latency,
                    last_checked_at=now,
                    fail_reason=fail_reason,
                    is_deleted=False,
                )
                session.add(node)
                await session.flush()
                node_id = node.id
                new_count += 1

            # Record a check log entry if verification ran.
            if result_map:
                session.add(
                    NodeCheck(
                        node_id=node_id,
                        checked_at=now,
                        is_alive=is_alive,
                        latency_ms=latency,
                        fail_reason=fail_reason,
                    )
                )

        # Soft-delete nodes that disappeared from all sources this run.
        if current_fingerprints:
            await session.execute(
                update(Node)
                .where(Node.is_deleted == False)  # noqa: E712
                .where(Node.fingerprint.notin_(list(current_fingerprints)))
                .values(is_deleted=True, updated_at=now)
            )

        await session.commit()

    return new_count, updated_count


def _publish_files(links: list[str], proxies: list[str], result_map: dict) -> None:
    """Write the legacy flat subscription files (clash.yaml, v2ray.txt, ...)."""
    settings = get_settings()
    out_dir = Path(settings.nodes_output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    # write_outputs expects either raw link strings or result dicts.
    items: list = []
    for link in links:
        r = result_map.get(link)
        if r:
            items.append(r)
        else:
            items.append(link)
    if not items:
        items = links  # fall back to raw links
    try:
        write_outputs(items, proxies)
    except Exception:
        logger.exception("failed to publish flat files")


def get_task_status(task_id: str) -> dict | None:
    """Return the status of an async pipeline task."""
    return _tasks.get(task_id)


def create_task_id() -> str:
    return uuid.uuid4().hex
