import base64
import ipaddress
import re
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

NODES_DIR = Path(__file__).parent.parent / "nodes"

from parser import node_to_clash_config


def _clean_name(name: str) -> str:
    return re.sub(r'[^\w\-_.]', '_', name)[:64]


def _is_private_host(host: str) -> bool:
    """Return True if host is a private/reserved IP or localhost."""
    if not host:
        return True
    lower = host.lower()
    if lower in ("localhost", "127.0.0.1", "::1"):
        return True
    try:
        ip = ipaddress.ip_address(host)
        return ip.is_private or ip.is_reserved or ip.is_loopback or ip.is_multicast
    except ValueError:
        # Hostname: allow public domains; block obvious local suffixes.
        local_suffixes = (".local", ".localhost", ".lan", ".internal")
        return any(lower.endswith(s) for s in local_suffixes)


def _yaml_dump(data: dict) -> str:
    if yaml:
        return yaml.dump(data, allow_unicode=True, sort_keys=False, default_flow_style=False)
    # Fallback: minimal manual serialization for proxies list
    lines = ["- name: \"{}\"".format(data["name"])]
    for k, v in data.items():
        if k == "name":
            continue
        if isinstance(v, bool):
            lines.append("  {}: {}".format(k, "true" if v else "false"))
        elif isinstance(v, int):
            lines.append("  {}: {}".format(k, v))
        elif isinstance(v, dict):
            lines.append("  {}:".format(k))
            for sk, sv in v.items():
                if isinstance(sv, dict):
                    lines.append("    {}:".format(sk))
                    for ssk, ssv in sv.items():
                        lines.append("      {}: {}".format(ssk, ssv))
                else:
                    lines.append("    {}: {}".format(sk, sv))
        else:
            lines.append("  {}: {}".format(k, v))
    return "\n".join(lines)


def to_clash_yaml(links: list[str]) -> str:
    proxies = []
    names = []
    seen_names = set()
    for idx, link in enumerate(links):
        cfg = node_to_clash_config(link)
        if not cfg or not cfg.get("server") or not cfg.get("port"):
            continue
        if _is_private_host(cfg.get("server")):
            continue
        base_name = _clean_name(cfg.get("name") or f"node_{idx + 1}")
        name = base_name
        suffix = 1
        while name in seen_names:
            suffix += 1
            name = f"{base_name}_{suffix}"
        seen_names.add(name)
        cfg["name"] = name
        names.append(name)
        proxies.append(cfg)

    output = {
        "port": 7890,
        "socks-port": 7891,
        "mixed-port": 7892,
        "mode": "rule",
        "log-level": "info",
        "external-controller": "127.0.0.1:9090",
        "proxies": proxies,
        "proxy-groups": [
            {
                "name": "PROXY",
                "type": "select",
                "proxies": names if names else ["DIRECT"],
            }
        ],
        "rules": ["MATCH,DIRECT"],
    }

    disclaimer = [
        "# ProxieHub Clash configuration",
        "# Auto-generated. Do not edit manually.",
        "# DISCLAIMER: Free public nodes are for educational and research use only.",
        "# No availability, security, or privacy guarantee. Use at your own risk.",
        "# Do not log in to sensitive accounts through these proxies/nodes.",
    ]

    if yaml:
        return "\n".join(disclaimer) + "\n" + yaml.dump(output, allow_unicode=True, sort_keys=False)

    # Fallback manual builder
    lines = disclaimer + [
        "port: 7890",
        "socks-port: 7891",
        "mixed-port: 7892",
        "mode: rule",
        "log-level: info",
        "external-controller: 127.0.0.1:9090",
        "proxies:",
    ]
    for p in proxies:
        lines.append(_yaml_dump(p))
    lines.append("proxy-groups:")
    lines.append("  - name: PROXY")
    lines.append("    type: select")
    lines.append("    proxies:")
    for n in (names if names else ["DIRECT"]):
        lines.append("      - {}".format(n))
    lines.append("rules:")
    lines.append("  - MATCH,DIRECT")
    return "\n".join(lines) + "\n"


def to_v2ray_subscription(links: list[str]) -> str:
    if not links:
        return "# ProxieHub V2Ray subscription\n# Auto-generated.\n"
    safe_links = []
    for link in links:
        cfg = node_to_clash_config(link)
        if cfg and cfg.get("server") and not _is_private_host(cfg.get("server")):
            safe_links.append(link)
    if not safe_links:
        return "# ProxieHub V2Ray subscription\n# Auto-generated.\n"
    joined = "\n".join(safe_links)
    return base64.urlsafe_b64encode(joined.encode()).decode()


def _proxy_host(proxy: str) -> str | None:
    """Extract host from http(s)://host:port or socks4/5://host:port."""
    match = re.match(r"^(?:http|https|socks4|socks5)://(?:[^@]+@)?([^:/]+)(?::\d+)?", proxy, re.I)
    return match.group(1) if match else None


def to_proxy_list(proxies: list[str]) -> str:
    lines = [
        "# ProxieHub public proxy list",
        "# Auto-generated.",
        "# DISCLAIMER: Free public proxies are for educational and research use only.",
        "# No availability, security, or privacy guarantee. Use at your own risk.",
        "# Do not log in to sensitive accounts through these proxies.",
    ]
    for proxy in proxies:
        host = _proxy_host(proxy)
        if host and not _is_private_host(host):
            lines.append(proxy)
    return "\n".join(lines) + "\n"


def write_outputs(node_links: list[str], proxy_list: list[str]):
    NODES_DIR.mkdir(parents=True, exist_ok=True)
    (NODES_DIR / "clash.yaml").write_text(to_clash_yaml(node_links), encoding="utf-8")
    (NODES_DIR / "v2ray.txt").write_text(to_v2ray_subscription(node_links), encoding="utf-8")
    (NODES_DIR / "proxies.txt").write_text(to_proxy_list(proxy_list), encoding="utf-8")


if __name__ == "__main__":
    sample = [
        "vmess://eyJhZGQiOiJleGFtcGxlLmNvbSIsInBvcnQiOiI0NDMiLCJpZCI6Inh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHgiLCJhaWQiOjAsIm5ldCI6InRjcCIsInR5cGUiOiJub25lIiwiaG9zdCI6IiIsInBhdGgiOiIvIiwidGxzIjoiIiwic25pIjoiIiwicHMiOiJ0ZXN0In0=",
        "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443#test",
        "trojan://pass@example.com:443#trojan-test",
    ]
    write_outputs(sample, ["http://127.0.0.1:8080"])
    print("[formatter] output files written")
