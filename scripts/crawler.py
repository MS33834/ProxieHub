"""Concurrent crawler for free node/proxy sources."""

from __future__ import annotations

import base64
import os
import shutil
import subprocess
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from utils import (
    USER_AGENT,
    FetchError,
    decode_bytes,
    get_logger,
    load_sources,
    ssl_context,
    validate_url,
)

logger = get_logger("crawler")


def _fetch_with_curl(url: str, timeout: int, max_bytes: int = 50 * 1024 * 1024) -> str:
    """Fetch via curl with bounded size/time limits."""
    validate_url(url)
    cmd = [
        "curl",
        "-fsSL",
        "--proto", "=https",
        "--max-time", str(timeout),
        "--max-filesize", str(max_bytes),
        "-A", USER_AGENT,
        url,
    ]
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            timeout=timeout + 5,
        )
    except subprocess.TimeoutExpired:
        raise FetchError("curl timed out")
    if result.returncode != 0:
        err = result.stderr.decode("utf-8", errors="ignore")[:200]
        if result.returncode == 63 or "filesize" in err.lower():
            raise FetchError(f"curl filesize exceeded: {err}")
        raise FetchError(f"curl failed: {err}")
    data = result.stdout[:max_bytes]
    return decode_bytes(data)


def _fetch_with_urllib(url: str, timeout: int) -> str:
    validate_url(url)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout, context=ssl_context()) as resp:
        data = resp.read()
        return decode_bytes(data)


def fetch(
    url: str,
    timeout: int = 20,
    retries: int = 1,
    max_bytes: int = 10 * 1024 * 1024,
) -> str:
    """Fetch URL with retries, preferring curl if available for better network tolerance.

    If curl fails because the response is too large or too slow, we avoid falling
    back to urllib with the same parameters to save time.
    """
    validate_url(url)
    last_error: Exception | None = None
    for attempt in range(retries + 1):
        try:
            if shutil.which("curl"):
                try:
                    return _fetch_with_curl(url, timeout, max_bytes=max_bytes)
                except FetchError as exc:
                    err = str(exc).lower()
                    # Don't waste another attempt with urllib on oversized/slow payloads.
                    if "timed out" in err or "filesize" in err or "max-filesize" in err:
                        raise
                    last_error = exc
            return _fetch_with_urllib(url, timeout)
        except Exception as exc:
            last_error = exc
            # Don't waste another attempt on deterministic failures
            # (oversized or already-timed-out payloads).
            if isinstance(exc, FetchError):
                err = str(exc).lower()
                if "timed out" in err or "filesize" in err or "max-filesize" in err:
                    raise
            if attempt < retries:
                continue
    raise last_error or FetchError(f"failed to fetch {url}")


def maybe_decode_base64(text: str) -> str:
    """If the whole text looks like base64, try decoding it once."""
    text = text.strip()
    if not text or "://" in text or "\n" in text:
        return text
    try:
        decoded = base64.b64decode(text + "=" * (-len(text) % 4), validate=True)
        return decoded.decode("utf-8", errors="ignore")
    except Exception:
        return text


def fetch_source(source: dict) -> str:
    text = fetch(
        source["url"],
        timeout=source.get("timeout", 20),
        max_bytes=source.get("max_size", 10 * 1024 * 1024),
    )
    if source.get("decode_base64", False):
        text = maybe_decode_base64(text)
    return text


def _fetch_source_safe(source: dict, category: str) -> dict | None:
    """Fetch a single source and return its raw entry, or None on failure."""
    name = source["name"]
    try:
        start = time.perf_counter()
        text = fetch_source(source)
        elapsed = time.perf_counter() - start
        logger.info("fetched %s in %.2fs", name, elapsed)
        entry = {"name": name, "text": text, "category": category}
        if "proxy_scheme" in source:
            entry["proxy_scheme"] = source["proxy_scheme"]
        return entry
    except Exception as exc:
        logger.warning("failed %s: %s", name, exc)
        return None


def crawl(config_path: Path | None = None, max_workers: int | None = None) -> dict:
    """Fetch all enabled sources concurrently.

    max_workers defaults to PROXIEHUB_CRAWL_WORKERS or the number of enabled sources.
    """
    config = load_sources(config_path)

    sources: list[tuple[dict, str]] = []
    for source in config.get("free_node_sources", []):
        if source.get("enabled"):
            sources.append((source, "nodes"))
    for source in config.get("free_proxy_apis", []):
        if source.get("enabled"):
            sources.append((source, "proxies"))

    raw: dict[str, list[dict]] = {"nodes": [], "proxies": []}

    if max_workers is None:
        env_workers = os.environ.get("PROXIEHUB_CRAWL_WORKERS", "")
        if env_workers.isdigit():
            max_workers = max(1, int(env_workers))
        else:
            max_workers = min(16, max(1, len(sources)))

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_source = {
            executor.submit(_fetch_source_safe, source, category): source
            for source, category in sources
        }
        for future in as_completed(future_to_source):
            result = future.result()
            if result:
                category = result.pop("category")
                raw[category].append(result)

    return raw


if __name__ == "__main__":
    result = crawl()
    logger.info(
        "fetched %d node sources, %d proxy sources",
        len(result["nodes"]),
        len(result["proxies"]),
    )
