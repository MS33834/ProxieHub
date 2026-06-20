import base64
import json
import re
from urllib.parse import urlparse, unquote, parse_qs

LINK_PATTERNS = [
    r'(?<!\S)ss://[^\s<>"\)\]]+',
    r'(?<!\S)ssr://[^\s<>"\)\]]+',
    r'(?<!\S)vmess://[^\s<>"\)\]]+',
    r'(?<!\S)vless://[^\s<>"\)\]]+',
    r'(?<!\S)trojan://[^\s<>"\)\]]+',
    r'(?<!\S)hysteria://[^\s<>"\)\]]+',
    r'(?<!\S)hysteria2://[^\s<>"\)\]]+',
]

SUPPORTED_SCHEMES = {"ss", "ssr", "vmess", "vless", "trojan", "hysteria", "hysteria2"}


def _pad_base64(data: str) -> str:
    return data + "=" * (-len(data) % 4)


def safe_b64decode(data: str) -> bytes | None:
    try:
        return base64.urlsafe_b64decode(_pad_base64(data))
    except Exception:
        try:
            return base64.b64decode(_pad_base64(data))
        except Exception:
            return None


def extract_node_links(text: str | None) -> list[str]:
    if not text:
        return []
    links = set()
    for pattern in LINK_PATTERNS:
        for match in re.findall(pattern, text):
            link = match.strip()
            scheme = link.split("://", 1)[0].lower()
            if scheme in SUPPORTED_SCHEMES:
                links.add(link)
    return list(links)


def decode_vmess(link: str) -> dict | None:
    if not link.startswith("vmess://"):
        return None
    payload = link[len("vmess://"):]
    decoded = safe_b64decode(payload)
    if not decoded:
        return None
    try:
        return json.loads(decoded.decode("utf-8"))
    except Exception:
        return None


def parse_ss_link(link: str) -> dict | None:
    """Parse ss:// BASE64(method:password)@server:port#name"""
    if not link.startswith("ss://"):
        return None
    body = link[len("ss://"):]

    # Try standard format with @
    if "@" in body:
        auth_part, rest = body.split("@", 1)
        decoded_auth = safe_b64decode(auth_part)
        if decoded_auth:
            auth = decoded_auth.decode("utf-8", errors="ignore")
        else:
            auth = auth_part
        if ":" not in auth:
            return None
        method, password = auth.split(":", 1)
        if "#" in rest:
            server_port, name = rest.split("#", 1)
            name = unquote(name)
        else:
            server_port, name = rest, None
        if ":" not in server_port:
            return None
        server, port_str = server_port.rsplit(":", 1)
        return {
            "type": "ss",
            "server": server,
            "port": int(port_str),
            "cipher": method,
            "password": password,
            "name": name or "ss_node",
        }

    # SIP002 format: ss://BASE64(method:password@server:port)#name
    b64_body = body.split("#", 1)[0]
    decoded = safe_b64decode(b64_body)
    if decoded:
        inner = decoded.decode("utf-8", errors="ignore")
        if "@" in inner:
            auth, server_port = inner.rsplit("@", 1)
            if ":" not in auth:
                return None
            method, password = auth.split(":", 1)
            server, port_str = server_port.rsplit(":", 1)
            return {
                "type": "ss",
                "server": server,
                "port": int(port_str),
                "cipher": method,
                "password": password,
                "name": "ss_node",
            }
    return None


def parse_trojan_link(link: str) -> dict | None:
    if not link.startswith("trojan://"):
        return None
    parsed = urlparse(link)
    if not parsed.hostname or not parsed.port:
        return None
    return {
        "type": "trojan",
        "server": parsed.hostname,
        "port": parsed.port,
        "password": unquote(parsed.username or ""),
        "sni": parsed.hostname,
        "skip-cert-verify": False,
        "name": parsed.fragment or "trojan_node",
    }


def parse_vless_link(link: str) -> dict | None:
    if not link.startswith("vless://"):
        return None
    parsed = urlparse(link)
    if not parsed.hostname or not parsed.port:
        return None
    qs = {k: v[0] for k, v in parse_qs(parsed.query).items()} if parsed.query else {}
    return {
        "type": "vless",
        "server": parsed.hostname,
        "port": parsed.port,
        "uuid": unquote(parsed.username or ""),
        "tls": qs.get("security", "none") == "tls",
        "servername": qs.get("sni", parsed.hostname),
        "network": qs.get("type", "tcp"),
        "name": parsed.fragment or "vless_node",
    }


def node_to_clash_config(link: str) -> dict | None:
    scheme = link.split("://", 1)[0].lower()
    if scheme == "vmess":
        cfg = decode_vmess(link)
        if not cfg:
            return None
        return {
            "name": cfg.get("ps") or cfg.get("remark") or "vmess_node",
            "type": "vmess",
            "server": cfg.get("add"),
            "port": int(cfg.get("port", 0)),
            "uuid": cfg.get("id"),
            "alterId": int(cfg.get("aid", 0)),
            "cipher": "auto",
            "tls": cfg.get("tls") in ("tls", True, "true"),
            "network": cfg.get("net", "tcp"),
            "ws-opts": {"path": cfg.get("path", "/"), "headers": {"Host": cfg.get("host", "")}},
            "skip-cert-verify": False,
        }
    if scheme == "ss":
        return parse_ss_link(link)
    if scheme == "trojan":
        return parse_trojan_link(link)
    if scheme == "vless":
        return parse_vless_link(link)
    return None


def parse_proxy_api_response(text: str | None) -> list[str]:
    if not text:
        return []
    proxies = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        if re.match(r"^(http|https|socks4|socks5)://", line):
            proxies.append(line)
    return list(dict.fromkeys(proxies))


if __name__ == "__main__":
    sample = (
        "vmess://eyJhZGQiOiJleGFtcGxlLmNvbSIsInBvcnQiOiI0NDMiLCJpZCI6Inh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHgiLCJhaWQiOjAsIm5ldCI6InRjcCIsInR5cGUiOiJub25lIiwiaG9zdCI6IiIsInBhdGgiOiIvIiwidGxzIjoiIiwic25pIjoiIiwicHMiOiJ0ZXN0In0= "
        "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443#test "
        "trojan://pass@example.com:443#trojan-test"
    )
    links = extract_node_links(sample)
    print("extracted:", links)
    for link in links:
        print("config:", node_to_clash_config(link))
