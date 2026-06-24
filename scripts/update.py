import argparse
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from crawler import crawl
from formatter import write_outputs
from parser import extract_node_links, parse_proxy_api_response
from utils import ConfigurationError, FetchError, ParseError, setup_logging
from verifier import can_reach_public_internet, stats_summary, verify_nodes

logger = setup_logging()

# Limits are configurable via environment variables for future scaling.
MAX_NODES = int(os.environ.get("PROXIEHUB_MAX_NODES", "500"))
MAX_PROXIES = int(os.environ.get("PROXIEHUB_MAX_PROXIES", "200"))
VERIFY_NODES = os.environ.get("PROXIEHUB_VERIFY_NODES", "false").lower() in ("1", "true", "yes")
GEO_ENABLED = os.environ.get("PROXIEHUB_GEO_ENABLED", "false").lower() in ("1", "true", "yes")
# Verification tuning: per-node connect timeout (seconds) and concurrency.
VERIFY_TIMEOUT = int(os.environ.get("PROXIEHUB_VERIFY_TIMEOUT", "5"))
VERIFY_WORKERS = int(os.environ.get("PROXIEHUB_VERIFY_WORKERS", "50"))


def _extract_node_links_safe(item: dict) -> tuple[list[str], str | None]:
    """Extract node links from a source, returning (links, error_message)."""
    try:
        return extract_node_links(item["text"]), None
    except Exception as exc:
        return [], f"parse error: {exc}"


def _extract_proxies_safe(item: dict) -> tuple[list[str], str | None]:
    """Extract proxies from a source, returning (proxies, error_message)."""
    try:
        return (
            parse_proxy_api_response(
                item["text"], default_scheme=item.get("proxy_scheme", "http")
            ),
            None,
        )
    except Exception as exc:
        return [], f"parse error: {exc}"


def main(verify: bool = False) -> int:
    logger.info("starting pipeline")

    should_verify = verify and can_reach_public_internet()
    if verify and not should_verify:
        logger.warning("public internet reachability test failed; skipping node verification")

    raw = crawl()

    node_source_count = len(raw["nodes"])
    proxy_source_count = len(raw["proxies"])
    logger.info("fetched %d node sources, %d proxy sources", node_source_count, proxy_source_count)

    if node_source_count == 0 and proxy_source_count == 0:
        logger.error("no sources could be fetched")
        return 1

    failed_sources: list[tuple[str, str]] = []
    all_links = []
    for item in raw["nodes"]:
        links, error = _extract_node_links_safe(item)
        if error:
            failed_sources.append((item["name"], error))
            logger.warning("%s: %s", item["name"], error)
        else:
            logger.info("%s: %d links extracted", item["name"], len(links))
            all_links.extend(links)

    all_links = list(dict.fromkeys(all_links))
    logger.info("total unique links: %d", len(all_links))

    if should_verify and all_links:
        before_count = len(all_links)
        logger.info(
            "verifying %d nodes (timeout=%ds, workers=%d)",
            before_count,
            VERIFY_TIMEOUT,
            VERIFY_WORKERS,
        )
        results = verify_nodes(
            all_links,
            max_workers=VERIFY_WORKERS,
            geo_enabled=GEO_ENABLED,
            timeout=VERIFY_TIMEOUT,
        )
        stats = stats_summary(results)
        logger.info(
            "verification summary: before=%d, passed=%d, failed=%d, pass_rate=%.1f%%",
            before_count,
            stats["alive"],
            stats["failed"],
            stats["survival_rate"],
        )
        if stats["avg_latency"] is not None:
            logger.info("average latency: %.1f ms", stats["avg_latency"])
        if stats.get("failure_reasons"):
            logger.info("failure reasons:")
            for reason, count in sorted(stats["failure_reasons"].items(), key=lambda x: -x[1]):
                logger.info("  %s: %d", reason, count)
        if GEO_ENABLED:
            logger.info("region distribution:")
            for region, count in sorted(stats["regions"].items(), key=lambda x: -x[1]):
                logger.info("  %s: %d", region, count)
        else:
            logger.info("geo disabled; region distribution omitted")
        alive_results = [r for r in results if r["alive"]][:MAX_NODES]
    else:
        alive_results = all_links[:MAX_NODES]
        stats = None

    all_proxies = []
    for item in raw["proxies"]:
        proxies, error = _extract_proxies_safe(item)
        if error:
            failed_sources.append((item["name"], error))
            logger.warning("%s: %s", item["name"], error)
        else:
            logger.info("%s: %d proxies extracted", item["name"], len(proxies))
            all_proxies.extend(proxies)

    all_proxies = list(dict.fromkeys(all_proxies))[:MAX_PROXIES]
    write_outputs(alive_results, all_proxies, stats=stats)
    logger.info("done: %d nodes, %d proxies written", len(alive_results), len(all_proxies))

    if failed_sources:
        logger.warning("%d source(s) had extraction issues:", len(failed_sources))
        for name, error in failed_sources:
            logger.warning("  - %s: %s", name, error)

    return 0


def _main_cli() -> int:
    parser = argparse.ArgumentParser(description="Update ProxieHub node and proxy lists")
    parser.add_argument(
        "--verify",
        action="store_true",
        default=VERIFY_NODES,
        help="Enable node connectivity verification (also settable via PROXIEHUB_VERIFY_NODES)",
    )
    args = parser.parse_args()
    try:
        return main(verify=args.verify)
    except ConfigurationError as exc:
        logger.error("configuration error: %s", exc)
        return 2
    except FetchError as exc:
        logger.error("fetch error: %s", exc)
        return 3
    except ParseError as exc:
        logger.error("parse error: %s", exc)
        return 4


if __name__ == "__main__":
    sys.exit(_main_cli())
