import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from parser import (
    extract_node_links,
    decode_vmess,
    parse_ss_link,
    parse_trojan_link,
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


def test_parse_trojan_link():
    link = "trojan://pass@example.com:443#trojan-test"
    cfg = parse_trojan_link(link)
    assert cfg is not None
    assert cfg["server"] == "example.com"
    assert cfg["port"] == 443
    assert cfg["password"] == "pass"


def test_node_to_clash_config():
    link = "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443#test"
    cfg = node_to_clash_config(link)
    assert cfg is not None
    assert cfg["type"] == "ss"


def test_parse_proxy_api_response():
    text = "# comment\nhttp://1.2.3.4:8080\nsocks5://5.6.7.8:1080\ninvalid-line"
    proxies = parse_proxy_api_response(text)
    assert len(proxies) == 2
    assert "http://1.2.3.4:8080" in proxies


if __name__ == "__main__":
    test_extract_node_links()
    test_decode_vmess()
    test_parse_ss_link()
    test_parse_trojan_link()
    test_node_to_clash_config()
    test_parse_proxy_api_response()
    print("all tests passed")
