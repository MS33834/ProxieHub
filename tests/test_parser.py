import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from parser import (
    extract_node_links,
    decode_vmess,
    parse_ss_link,
    parse_trojan_link,
    parse_vless_link,
    node_to_clash_config,
    parse_proxy_api_response,
)


def test_extract_node_links():
    text = "vmess://eyJhZGQiOiJhLmNvbSJ9 ss://bWV0aG9kOnBhc3M=@b.com:443 trojan://pass@c.com:443"
    links = extract_node_links(text)
    assert len(links) == 3
    assert any(link.startswith("vmess://") for link in links)
    assert any(link.startswith("ss://") for link in links)
    assert any(link.startswith("trojan://") for link in links)


def test_extract_node_links_deduplicates():
    text = "ss://bWV0aG9kOnBhc3M=@b.com:443 ss://bWV0aG9kOnBhc3M=@b.com:443"
    links = extract_node_links(text)
    assert len(links) == 1


def test_decode_vmess():
    sample = "vmess://eyJhZGQiOiJhLmNvbSIsInBvcnQiOiI0NDMiLCJpZCI6InV1aWQifQ=="
    cfg = decode_vmess(sample)
    assert cfg is not None
    assert cfg["add"] == "a.com"


def test_parse_ss_link():
    link = "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443#test"
    cfg = parse_ss_link(link)
    assert cfg is not None
    assert cfg["server"] == "example.com"
    assert cfg["port"] == 443
    assert cfg["cipher"] == "aes-256-gcm"
    assert cfg["password"] == "password"
    assert cfg["name"] == "test"


def test_parse_ss_link_sip002_with_name():
    import base64
    inner = "aes-256-gcm:password@example.com:443"
    b64 = base64.urlsafe_b64encode(inner.encode()).decode().rstrip("=")
    link = f"ss://{b64}#my-ss-node"
    cfg = parse_ss_link(link)
    assert cfg is not None
    assert cfg["server"] == "example.com"
    assert cfg["port"] == 443
    assert cfg["name"] == "my-ss-node"


def test_parse_ss_link_with_plugin_params():
    link = "ss://YWVzLTI1Ni1nY206cGFzcw==@example.com:443?plugin=obfs-local#test"
    cfg = parse_ss_link(link)
    assert cfg is not None
    assert cfg["port"] == 443


def test_parse_ss_link_ipv6():
    # IPv6 hosts must be parsed without leaving brackets, so private/link-local
    # IPv6 addresses are filtered downstream instead of bypassing the check.
    link = "ss://YWVzLTI1Ni1nY206cGFzcw==@[2001:db8::1]:443#ipv6"
    cfg = parse_ss_link(link)
    assert cfg is not None
    assert cfg["server"] == "2001:db8::1"
    assert cfg["port"] == 443


def test_extract_node_links_case_insensitive():
    text = "Vmess://eyJhZGQiOiJhLmNvbSJ9 SS://bWV0aG9kOnBhc3M=@b.com:443"
    links = extract_node_links(text)
    assert len(links) == 2
    assert any(link.lower().startswith("vmess://") for link in links)
    assert any(link.lower().startswith("ss://") for link in links)


def test_parse_trojan_link():
    link = "trojan://pass@example.com:443#trojan-test"
    cfg = parse_trojan_link(link)
    assert cfg is not None
    assert cfg["server"] == "example.com"
    assert cfg["port"] == 443
    assert cfg["password"] == "pass"
    assert cfg["name"] == "trojan-test"


def test_parse_vless_link():
    link = "vless://uuid@example.com:443?security=tls&sni=example.com&type=tcp#vless-test"
    cfg = parse_vless_link(link)
    assert cfg is not None
    assert cfg["server"] == "example.com"
    assert cfg["port"] == 443
    assert cfg["uuid"] == "uuid"
    assert cfg["tls"] is True
    assert cfg["name"] == "vless-test"


def test_parse_vless_link_ipv6():
    link = "vless://uuid@[2001:db8::1]:443?type=tcp#ipv6"
    cfg = parse_vless_link(link)
    assert cfg is not None
    assert cfg["server"] == "2001:db8::1"
    assert cfg["port"] == 443


def test_parse_vless_link_reality():
    link = (
        "vless://uuid@example.com:443?security=reality&sni=example.com"
        "&pbk=abc123&sid=def&fp=chrome&type=tcp&flow=xtls-rprx-vision#reality-test"
    )
    cfg = parse_vless_link(link)
    assert cfg is not None
    assert cfg["server"] == "example.com"
    assert cfg["port"] == 443
    assert cfg["tls"] is True
    assert cfg["flow"] == "xtls-rprx-vision"
    assert cfg["reality-opts"]["public-key"] == "abc123"
    assert cfg["reality-opts"]["short-id"] == "def"
    assert cfg["client-fingerprint"] == "chrome"


def test_extract_node_links_ipv6():
    text = "vless://uuid@[2001:db8::1]:443?type=tcp#ipv6"
    links = extract_node_links(text)
    assert len(links) == 1
    assert "[2001:db8::1]" in links[0]


def test_node_to_clash_config_vmess_null_port():
    import base64
    cfg = {"add": "a.com", "port": None, "id": "uuid", "aid": None}
    b64 = base64.b64encode(json.dumps(cfg).encode()).decode().rstrip("=")
    link = f"vmess://{b64}"
    result = node_to_clash_config(link)
    assert result is not None
    assert result["port"] == 0
    assert result["alterId"] == 0


def test_node_to_clash_config():
    link = "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443#test"
    cfg = node_to_clash_config(link)
    assert cfg is not None
    assert cfg["type"] == "ss"


def test_node_to_clash_config_vmess_tcp_no_ws_opts():
    import base64
    cfg = {"add": "a.com", "port": 443, "id": "uuid", "aid": 0, "net": "tcp", "scy": "aes-128-gcm"}
    b64 = base64.b64encode(json.dumps(cfg).encode()).decode().rstrip("=")
    link = f"vmess://{b64}"
    result = node_to_clash_config(link)
    assert result is not None
    assert result["network"] == "tcp"
    assert "ws-opts" not in result
    assert result["cipher"] == "aes-128-gcm"


def test_node_to_clash_config_vmess_ws_has_ws_opts():
    import base64
    cfg = {"add": "a.com", "port": 443, "id": "uuid", "aid": 0, "net": "ws", "path": "/ws", "host": "a.com"}
    b64 = base64.b64encode(json.dumps(cfg).encode()).decode().rstrip("=")
    link = f"vmess://{b64}"
    result = node_to_clash_config(link)
    assert result is not None
    assert result["network"] == "ws"
    assert result["ws-opts"]["path"] == "/ws"
    assert result["ws-opts"]["headers"]["Host"] == "a.com"


def test_parse_proxy_api_response():
    text = "# comment\nhttp://1.2.3.4:8080\nsocks5://5.6.7.8:1080\ninvalid-line"
    proxies = parse_proxy_api_response(text)
    assert len(proxies) == 2
    assert "http://1.2.3.4:8080" in proxies


def test_parse_proxy_api_response_ignores_duplicates():
    text = "http://1.2.3.4:8080\nhttp://1.2.3.4:8080"
    proxies = parse_proxy_api_response(text)
    assert len(proxies) == 1


def test_parse_proxy_api_response_plain_ip_port():
    text = "1.2.3.4:8080\n5.6.7.8:1080\ninvalid\n999.1.1.1:80"
    proxies = parse_proxy_api_response(text)
    assert len(proxies) == 2
    assert "http://1.2.3.4:8080" in proxies
    assert "http://5.6.7.8:1080" in proxies


def test_parse_proxy_api_response_default_scheme():
    text = "1.2.3.4:8080\nsocks5://5.6.7.8:1080"
    proxies = parse_proxy_api_response(text, default_scheme="socks4")
    assert "socks4://1.2.3.4:8080" in proxies
    assert "socks5://5.6.7.8:1080" in proxies


def test_parse_proxy_api_response_ipv6_plain():
    text = "[2001:db8::1]:8080"
    proxies = parse_proxy_api_response(text)
    assert len(proxies) == 1
    assert "http://[2001:db8::1]:8080" in proxies


if __name__ == "__main__":
    test_extract_node_links()
    test_extract_node_links_deduplicates()
    test_decode_vmess()
    test_parse_ss_link()
    test_parse_ss_link_sip002_with_name()
    test_parse_ss_link_with_plugin_params()
    test_parse_ss_link_ipv6()
    test_extract_node_links_case_insensitive()
    test_parse_trojan_link()
    test_parse_vless_link()
    test_parse_vless_link_ipv6()
    test_parse_vless_link_reality()
    test_extract_node_links_ipv6()
    test_node_to_clash_config_vmess_null_port()
    test_node_to_clash_config()
    test_node_to_clash_config_vmess_tcp_no_ws_opts()
    test_node_to_clash_config_vmess_ws_has_ws_opts()
    test_parse_proxy_api_response()
    test_parse_proxy_api_response_ignores_duplicates()
    test_parse_proxy_api_response_plain_ip_port()
    test_parse_proxy_api_response_default_scheme()
    test_parse_proxy_api_response_ipv6_plain()
    print("parser tests passed")
