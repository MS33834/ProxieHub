import base64
import re

LINK_PATTERNS = [
    r"ss://[^\s<>")\]]+",
    r"vmess://[^\s<>")\]]+",
    r"vless://[^\s<>")\]]+",
    r"trojan://[^\s<>")\]]+",
    r"hysteria2://[^\s<>")\]]+",
    r" hysteria://[^\s<>")\]]+",
]


def extract_node_links(text: str) -> list:
    links = set()
    for pattern in LINK_PATTERNS:
        for match in re.findall(pattern, text):
            links.add(match.strip())
    return list(links)


def decode_vmess(link: str) -> dict | None:
    if not link.startswith("vmess://"):
        return None
    payload = link[len("vmess://"):]
    try:
        decoded = base64.urlsafe_b64decode(payload + "=" * (-len(payload) % 4)).decode("utf-8")
        import json
        return json.loads(decoded)
    except Exception:
        return None


def parse_proxy_api_response(text: str) -> list:
    proxies = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if re.match(r"^(http|https|socks4|socks5)://", line):
            proxies.append(line)
    return proxies


if __name__ == "__main__":
    sample = "vmess://eyJhZGQiOiJleGFtcGxlLmNvbSIsInBvcnQiOiI0NDMiLCJpZCI6Inh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHgiLCJhaWQiOjAsIm5ldCI6InRjcCIsInR5cGUiOiJub25lIiwiaG9zdCI6IiIsInBhdGgiOiIvIiwidGxzIjoiIiwic25pIjoiIn0= ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443"
    print(extract_node_links(sample))
