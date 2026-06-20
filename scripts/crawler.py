import base64
import json
import urllib.request
from pathlib import Path

CONFIG_PATH = Path(__file__).parent.parent / "config" / "sources.json"
USER_AGENT = "ProxieHub-Crawler/1.0 (+https://github.com/MS33834/ProxieHub)"


def fetch(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        # Try common encodings
        for encoding in ("utf-8", "gbk", "latin-1"):
            try:
                return data.decode(encoding, errors="ignore")
            except Exception:
                continue
        return data.decode("utf-8", errors="ignore")


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
