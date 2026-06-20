import json
import urllib.request
from pathlib import Path

CONFIG_PATH = Path(__file__).parent.parent / "config" / "sources.json"


def fetch(url: str, timeout: int = 30) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "ProxieHub-Crawler/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def crawl() -> dict:
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        config = json.load(f)

    raw = {"nodes": [], "proxies": []}

    for source in config.get("free_node_sources", []):
        if not source.get("enabled"):
            continue
        try:
            text = fetch(source["url"])
            raw["nodes"].append({"name": source["name"], "text": text})
        except Exception as exc:
            print(f"[crawler] failed {source['name']}: {exc}")

    for source in config.get("free_proxy_apis", []):
        if not source.get("enabled"):
            continue
        try:
            text = fetch(source["url"])
            raw["proxies"].append({"name": source["name"], "text": text})
        except Exception as exc:
            print(f"[crawler] failed {source['name']}: {exc}")

    return raw


if __name__ == "__main__":
    result = crawl()
    print(f"[crawler] fetched {len(result['nodes'])} node sources, {len(result['proxies'])} proxy sources")
