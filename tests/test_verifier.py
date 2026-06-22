import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from verifier import parse_endpoint, verify_node, is_private_host, stats_summary, query_geo_api


class FakeSocket:
    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass


class _Monkeypatch:
    """Minimal stand-in for pytest's monkeypatch fixture."""

    def setattr(self, obj, name, value):
        setattr(obj, name, value)


def _mp(monkeypatch):
    return monkeypatch if monkeypatch is not None else _Monkeypatch()


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


def test_verify_node_alive(monkeypatch):
    # Avoid external geo API calls in this test.
    result = verify_node("ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443", timeout=5, geo_enabled=False)
    assert "link" in result
    assert "alive" in result
    assert "latency_ms" in result


def test_verify_node_unreachable():
    result = verify_node("ss://YWVzLTI1Ni1nY206cGFzcw==@127.0.0.1:1", timeout=1, geo_enabled=False)
    assert result["alive"] is False
    assert result["region"] == "private"


def test_verify_node_latency_ms(monkeypatch):
    import verifier

    mp = _mp(monkeypatch)

    def fake_create_connection(addr, timeout=None):
        time.sleep(0.01)
        return FakeSocket()

    mp.setattr(verifier.socket, "create_connection", fake_create_connection)

    link = "ss://YWVzLTI1Ni1nY206cGFzcw==@1.2.3.4:443#test"
    result = verify_node(link, timeout=2, geo_enabled=False)
    assert result["alive"] is True
    assert result["latency_ms"] is not None
    assert 5 <= result["latency_ms"] < 200


def test_verify_node_region(monkeypatch):
    import verifier

    mp = _mp(monkeypatch)

    def fake_create_connection(addr, timeout=None):
        return FakeSocket()

    mp.setattr(verifier.socket, "create_connection", fake_create_connection)
    mp.setattr(verifier, "resolve_ip", lambda host: "8.8.8.8")
    mp.setattr(verifier, "query_geo_api", lambda ip: "US/California")
    verifier._geo_cache.clear()

    link = "ss://YWVzLTI1Ni1nY206cGFzcw==@1.2.3.4:443#test"
    result = verify_node(link, timeout=2, geo_enabled=True)
    assert result["alive"] is True
    assert result["region"] == "US/California"


def test_is_private_host():
    assert is_private_host("127.0.0.1") is True
    assert is_private_host("192.168.1.1") is True
    assert is_private_host("10.0.0.1") is True
    assert is_private_host("::1") is True
    assert is_private_host("example.com") is False
    assert is_private_host("localhost.local") is True


def test_geo_cache(monkeypatch):
    import verifier

    mp = _mp(monkeypatch)
    calls = []

    def fake_fetch(ip):
        calls.append(ip)
        return {"country": "JP", "regionName": "Tokyo"}

    mp.setattr(verifier, "_fetch_geo_data", fake_fetch)
    verifier._geo_cache.clear()

    assert query_geo_api("9.9.9.9") == "JP/Tokyo"
    assert query_geo_api("9.9.9.9") == "JP/Tokyo"
    assert len(calls) == 1


def test_stats_summary():
    results = [
        {"alive": True, "latency_ms": 100, "region": "US/California"},
        {"alive": True, "latency_ms": 200, "region": "CN/Beijing"},
        {"alive": False, "latency_ms": None, "region": "unknown"},
    ]
    stats = stats_summary(results)
    assert stats["total"] == 3
    assert stats["alive"] == 2
    assert stats["avg_latency"] == 150.0
    assert abs(stats["survival_rate"] - 66.7) < 0.01
    assert stats["regions"]["US/California"] == 1
    assert stats["regions"]["CN/Beijing"] == 1


if __name__ == "__main__":
    test_parse_endpoint_ss()
    test_parse_endpoint_trojan()
    test_parse_endpoint_vless()
    test_parse_endpoint_vmess()
    test_parse_endpoint_ipv6()
    test_parse_endpoint_invalid()
    test_verify_node_alive(None)
    test_verify_node_unreachable()
    test_verify_node_latency_ms(None)
    test_verify_node_region(None)
    test_is_private_host()
    test_geo_cache(None)
    test_stats_summary()
    print("verifier tests passed")
