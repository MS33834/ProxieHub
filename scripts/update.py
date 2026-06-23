import argparse
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from crawler import crawl
from formatter import write_outputs
from parser import extract_node_links, parse_proxy_api_response
from verifier import can_reach_public_internet, stats_summary, verify_nodes

# Limits are configurable via environment variables for future scaling.
MAX_NODES = int(os.environ.get("PROXIEHUB_MAX_NODES", "500"))
MAX_PROXIES = int(os.environ.get("PROXIEHUB_MAX_PROXIES", "200"))
VERIFY_NODES = os.environ.get("PROXIEHUB_VERIFY_NODES", "false").lower() in ("1", "true", "yes")
GEO_ENABLED = os.environ.get("PROXIEHUB_GEO_ENABLED", "false").lower() in ("1", "true", "yes")


def main(verify: bool = False) -> int:
    print("[update] starting pipeline")

    should_verify = verify and can_reach_public_internet()
    if verify and not should_verify:
        print("[update] public internet reachability test failed; skipping node verification")

    raw = crawl()

    node_source_count = len(raw["nodes"])
    proxy_source_count = len(raw["proxies"])
    print(f"[update] fetched {node_source_count} node sources, {proxy_source_count} proxy sources")

    if node_source_count == 0 and proxy_source_count == 0:
        print("[update] error: no sources could be fetched", file=sys.stderr)
        return 1

    all_links = []
    for item in raw["nodes"]:
        links = extract_node_links(item["text"])
        print(f"[update] {item['name']}: {len(links)} links extracted")
        all_links.extend(links)

    all_links = list(dict.fromkeys(all_links))
    print(f"[update] total unique links: {len(all_links)}")

    if should_verify and all_links:
        results = verify_nodes(all_links, geo_enabled=GEO_ENABLED)
        stats = stats_summary(results)
        print(
            f"[update] verification: {stats['alive']}/{stats['total']} alive "
            f"({stats['survival_rate']}%)"
        )
        if stats["avg_latency"] is not None:
            print(f"[update] average latency: {stats['avg_latency']} ms")
        if GEO_ENABLED:
            print("[update] region distribution:")
            for region, count in sorted(stats["regions"].items(), key=lambda x: -x[1]):
                print(f"  {region}: {count}")
        else:
            print("[update] geo disabled; region distribution omitted")
        alive_results = [r for r in results if r["alive"]][:MAX_NODES]
    else:
        alive_results = all_links[:MAX_NODES]
        stats = None

    all_proxies = []
    for item in raw["proxies"]:
        proxies = parse_proxy_api_response(item["text"])
        print(f"[update] {item['name']}: {len(proxies)} proxies extracted")
        all_proxies.extend(proxies)

    all_proxies = list(dict.fromkeys(all_proxies))[:MAX_PROXIES]
    write_outputs(alive_results, all_proxies, stats=stats)
    print(f"[update] done: {len(alive_results)} nodes, {len(all_proxies)} proxies written")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update ProxieHub node and proxy lists")
    parser.add_argument(
        "--verify",
        action="store_true",
        default=VERIFY_NODES,
        help="Enable node connectivity verification (also settable via PROXIEHUB_VERIFY_NODES)",
    )
    args = parser.parse_args()
    sys.exit(main(verify=args.verify))
