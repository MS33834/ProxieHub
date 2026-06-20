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


def test_parse_endpoint_invalid():
    host, port = parse_endpoint("not-a-link")
    assert host is None
    assert port is None


def test_verify_node_alive():
    # example.com:443 should usually be reachable
    result = verify_node("ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443", timeout=5)
    assert "link" in result
    assert "alive" in result


if __name__ == "__main__":
    test_parse_endpoint_ss()
    test_parse_endpoint_trojan()
    test_parse_endpoint_invalid()
    test_verify_node_alive()
    print("verifier tests passed")
