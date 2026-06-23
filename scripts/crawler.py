import base64
import json
import os
import shutil
import ssl
import subprocess
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib.parse import urlparse

CONFIG_PATH = Path(__file__).parent.parent / "config" / "sources.json"
USER_AGENT = "ProxieHub-Crawler/1.0 (+https://github.com/MS33834/ProxieHub)"

# Only HTTPS URLs from well-known public hosts are allowed as data sources.
ALLOWED_SCHEMES = {"https"}
DEFAULT_ALLOWED_HOSTS = {
    "raw.githubusercontent.com",
    "gitcode.com",
    "api.gitcode.com",
}


def _allowed_hosts() -> set[str]:
    """Return allowed hosts, optionally extended via PROXIEHUB_ALLOWED_HOSTS env var."""
    hosts = set(DEFAULT_ALLOWED_HOSTS)
    extra = os.environ.get("PROXIEHUB_ALLOWED_HOSTS", "")
    if extra:
        hosts.update(h.strip().lower() for h in extra.split(",") if h.strip())
    return hosts


def _decode_bytes(data: bytes) -> str:
    """Decode bytes to text, trying utf-8 then gbk then latin-1."""
    for encoding in ("utf-8", "gbk", "latin-1"):
        try:
            return data.decode(encoding)
        except (UnicodeDecodeError, LookupError):
            continue
    return data.decode("utf-8", errors="ignore")


def _validate_url(url: str) -> None:
    """Reject non-HTTPS URLs and unexpected hosts to mitigate SSRF risks."""
    parsed = urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        raise ValueError(f"URL scheme not allowed: {parsed.scheme}")
    host = (parsed.hostname or "").lower()
    allowed = _allowed_hosts()
    if not any(host == allowed_host or host.endswith(f".{allowed_host}") for allowed_host in allowed):
        raise ValueError(f"URL host not allowed: {host}")


def _ssl_context() -> ssl.SSLContext:
    """Create an SSL context compatible with a wide range of servers."""
    context = ssl.create_default_context()
    # Lower SECLEVEL to allow older TLS configurations used by some CDNs.
    context.set_ciphers("DEFAULT:@SECLEVEL=1")
    return context


def _fetch_with_curl(url: str, timeout: int, max_bytes: int = 50 * 1024 * 1024) -> str:
    """Fetch via curl, streaming output to avoid subprocess pipe deadlocks."""
    _validate_url(url)
    cmd = [
        "curl",
        "-fsSL",
        "--proto", "=https",
        "--max-time", str(timeout),
        "--max-filesize", str(max_bytes),
        "-A", USER_AGENT,
        url,
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    try:
        stdout, stderr = proc.communicate(timeout=timeout + 5)
    except subprocess.TimeoutExpired:
        proc.kill()
        stdout, stderr = proc.communicate()
        raise RuntimeError("curl timed out")
    if proc.returncode != 0:
        err = stderr.decode("utf-8", errors="ignore")[:200]
        raise RuntimeError(f"curl failed: {err}")
    data = stdout[:max_bytes]
    return _decode_bytes(data)


def _fetch_with_urllib(url: str, timeout: int) -> str:
    _validate_url(url)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
        data = resp.read()
        return _decode_bytes(data)


def fetch(url: str, timeout: int = 20, retries: int = 1, max_bytes: int = 10 * 1024 * 1024) -> str:
    """Fetch URL with retries, preferring curl if available for better network tolerance.

    If curl fails because the response is too large or too slow, we avoid falling
    back to urllib with the same parameters to save time.
    """
    _validate_url(url)
    last_error = None
    for attempt in range(retries + 1):
        try:
            if shutil.which("curl"):
                try:
                    return _fetch_with_curl(url, timeout, max_bytes=max_bytes)
                except RuntimeError as exc:
                    err = str(exc).lower()
                    # Don't waste another attempt with urllib on oversized/slow payloads.
                    if "timed out" in err or "filesize" in err or "max-filesize" in err:
                        raise
                    last_error = exc
            return _fetch_with_urllib(url, timeout)
        except Exception as exc:
            last_error = exc
            if attempt < retries:
                continue
    raise last_error or RuntimeError(f"failed to fetch {url}")


def maybe_decode_base64(text: str) -> str:
    """If the whole text looks like base64, try decoding it once."""
    text = text.strip()
    if not text or "//" in text or "\n" in text:
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
    try:
        text = fetch_source(source)
        entry = {"name": source["name"], "text": text, "category": category}
        if "proxy_scheme" in source:
            entry["proxy_scheme"] = source["proxy_scheme"]
        return entry
    except Exception as exc:
        print(f"[crawler] failed {source['name']}: {exc}")
        return None


def crawl(config_path: Path | None = None, max_workers: int | None = None) -> dict:
    """Fetch all enabled sources concurrently.

    max_workers defaults to PROXIEHUB_CRAWL_WORKERS or the number of enabled sources.
    """
    path = config_path or CONFIG_PATH
    with open(path, "r", encoding="utf-8") as f:
        config = json.load(f)

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
    print(f"[crawler] fetched {len(result['nodes'])} node sources, {len(result['proxies'])} proxy sources")
