import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from verifier import parse_endpoint, verify_node


def test_parse_endpoint_ss():
    host, port = parse_endpoint("ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443")
    assert host == "example.com"
    assert port == 443


def test_parse_endpoint_trojan():
    host, port = parse_endpoint("trojan://pass@example.com:443")
    assert host == "example.com"
    assert port == 443


def test_parse_endpoint_vless():
    host, port = parse_endpoint("vless://uuid@example.com:443?type=tcp")
    assert host == "example.com"
    assert port == 443


def test_parse_endpoint_vmess():
    host, port = parse_endpoint(
        "vmess://eyJhZGQiOiJleGFtcGxlLmNvbSIsInBvcnQiOiI0NDMifQ=="
    )
    assert host == "example.com"
    assert port == 443


def test_parse_endpoint_ipv6():
    host, port = parse_endpoint("vless://uuid@[2001:db8::1]:443?type=tcp")
    assert host == "2001:db8::1"
    assert port == 443


def test_parse_endpoint_invalid():
    host, port = parse_endpoint("not-a-link")
    assert host is None
    assert port is None


def test_verify_node_alive():
    # example.com:443 should usually be reachable
    result = verify_node("ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443", timeout=5)
    assert "link" in result
    assert "alive" in result


def test_verify_node_unreachable():
    result = verify_node("ss://YWVzLTI1Ni1nY206cGFzcw==@127.0.0.1:1", timeout=1)
    assert result["alive"] is False


if __name__ == "__main__":
    test_parse_endpoint_ss()
    test_parse_endpoint_trojan()
    test_parse_endpoint_vless()
    test_parse_endpoint_vmess()
    test_parse_endpoint_ipv6()
    test_parse_endpoint_invalid()
    test_verify_node_alive()
    test_verify_node_unreachable()
    print("verifier tests passed")
