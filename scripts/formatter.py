import base64
from pathlib import Path

NODES_DIR = Path(__file__).parent.parent / "nodes"


def to_clash_yaml(links: list) -> str:
    lines = [
        "# ProxieHub Clash configuration",
        "# Auto-generated. Do not edit manually.",
        "port: 7890",
        "socks-port: 7891",
        "mixed-port: 7892",
        "mode: rule",
        "log-level: info",
        "external-controller: 127.0.0.1:9090",
        "proxies:",
    ]

    names = []
    for idx, link in enumerate(links):
        name = f"node_{idx + 1}"
        names.append(name)
        scheme = link.split("://", 1)[0]
        lines.append(f"  - name: \"{name}\"")
        lines.append(f"    type: {scheme}")
        lines.append(f"    server: placeholder.example.com")
        lines.append(f"    port: 443")
        lines.append(f"    # original: {link[:60]}...")
        lines.append("")

    lines.append("proxy-groups:")
    lines.append("  - name: PROXY")
    lines.append("    type: select")
    lines.append(f"    proxies: {names if names else []}")
    lines.append("rules:")
    lines.append("  - MATCH,DIRECT")
    return "\n".join(lines) + "\n"


def to_v2ray_subscription(links: list) -> str:
    if not links:
        return "# ProxieHub V2Ray subscription\n# Auto-generated.\n"
    joined = "\n".join(links)
    return base64.urlsafe_b64encode(joined.encode()).decode()


def to_proxy_list(proxies: list) -> str:
    lines = ["# ProxieHub public proxy list", "# Auto-generated."]
    lines.extend(proxies)
    return "\n".join(lines) + "\n"


def write_outputs(node_links: list, proxy_list: list):
    NODES_DIR.mkdir(parents=True, exist_ok=True)
    (NODES_DIR / "clash.yaml").write_text(to_clash_yaml(node_links), encoding="utf-8")
    (NODES_DIR / "v2ray.txt").write_text(to_v2ray_subscription(node_links), encoding="utf-8")
    (NODES_DIR / "proxies.txt").write_text(to_proxy_list(proxy_list), encoding="utf-8")


if __name__ == "__main__":
    write_outputs([], [])
    print("[formatter] output files written")
