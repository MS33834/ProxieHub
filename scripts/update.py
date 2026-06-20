import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from crawler import crawl
from formatter import write_outputs
from parser import extract_node_links, parse_proxy_api_response
from verifier import filter_alive

MAX_NODES = 500
MAX_PROXIES = 200


def main():
    print("[update] starting pipeline")
    raw = crawl()

    all_links = []
    for item in raw["nodes"]:
        links = extract_node_links(item["text"])
        print(f"[update] {item['name']}: {len(links)} links extracted")
        all_links.extend(links)

    all_links = list(dict.fromkeys(all_links))
    print(f"[update] total unique links: {len(all_links)}")

    if all_links:
        alive_links = filter_alive(all_links)
        print(f"[update] alive links: {len(alive_links)}")
    else:
        alive_links = []

    alive_links = alive_links[:MAX_NODES]

    all_proxies = []
    for item in raw["proxies"]:
        proxies = parse_proxy_api_response(item["text"])
        print(f"[update] {item['name']}: {len(proxies)} proxies extracted")
        all_proxies.extend(proxies)

    all_proxies = list(dict.fromkeys(all_proxies))[:MAX_PROXIES]
    write_outputs(alive_links, all_proxies)
    print("[update] done")


if __name__ == "__main__":
    main()
