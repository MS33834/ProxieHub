import base64
import json
import shutil
import ssl
import subprocess
import urllib.request
from pathlib import Path

CONFIG_PATH = Path(__file__).parent.parent / "config" / "sources.json"
USER_AGENT = "ProxieHub-Crawler/1.0 (+https://github.com/MS33834/ProxieHub)"


def _ssl_context() -> ssl.SSLContext:
    """Create an SSL context compatible with a wide range of servers."""
    context = ssl.create_default_context()
    # Lower SECLEVEL to allow older TLS configurations used by some CDNs.
    context.set_ciphers("DEFAULT:@SECLEVEL=1")
    return context


def _fetch_with_curl(url: str, timeout: int) -> str:
    """Fetch via curl, which is often more tolerant of flaky networks."""
    cmd = [
        "curl",
        "-fsSL",
        "--max-time", str(timeout),
        "-A", USER_AGENT,
        url,
    ]
    result = subprocess.run(cmd, capture_output=True, text=False, timeout=timeout + 5)
    if result.returncode != 0:
        raise RuntimeError(f"curl failed: {result.stderr.decode('utf-8', errors='ignore')[:200]}")
    data = result.stdout
    for encoding in ("utf-8", "gbk", "latin-1"):
        try:
            return data.decode(encoding, errors="ignore")
        except Exception:
            continue
    return data.decode("utf-8", errors="ignore")


def _fetch_with_urllib(url: str, timeout: int) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout, context=_ssl_context()) as resp:
        data = resp.read()
        for encoding in ("utf-8", "gbk", "latin-1"):
            try:
                return data.decode(encoding, errors="ignore")
            except Exception:
                continue
        return data.decode("utf-8", errors="ignore")


def fetch(url: str, timeout: int = 30) -> str:
    """Fetch URL, preferring curl if available for better network tolerance."""
    last_error = None
    if shutil.which("curl"):
        try:
            return _fetch_with_curl(url, timeout)
        except Exception as exc:
            last_error = exc
    try:
        return _fetch_with_urllib(url, timeout)
    except Exception as exc:
        if last_error:
            raise last_error from exc
        raise


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
    text = fetch(source["url"], timeout=source.get("timeout", 30))
    if source.get("decode_base64", False):
        text = maybe_decode_base64(text)
    return text


def crawl(config_path: Path | None = None) -> dict:
    path = config_path or CONFIG_PATH
    with open(path, "r", encoding="utf-8") as f:
        config = json.load(f)

    raw = {"nodes": [], "proxies": []}

    for source in config.get("free_node_sources", []):
        if not source.get("enabled"):
            continue
        try:
            text = fetch_source(source)
            raw["nodes"].append({"name": source["name"], "text": text})
        except Exception as exc:
            print(f"[crawler] failed {source['name']}: {exc}")

    for source in config.get("free_proxy_apis", []):
        if not source.get("enabled"):
            continue
        try:
            text = fetch_source(source)
            raw["proxies"].append({"name": source["name"], "text": text})
        except Exception as exc:
            print(f"[crawler] failed {source['name']}: {exc}")

    return raw


if __name__ == "__main__":
    result = crawl()
    print(f"[crawler] fetched {len(result['nodes'])} node sources, {len(result['proxies'])} proxy sources")
