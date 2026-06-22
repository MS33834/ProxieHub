import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from formatter import to_clash_yaml, to_v2ray_subscription, to_proxy_list, _is_private_host


def test_to_clash_yaml_basic():
    links = [
        "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443#test",
        "trojan://pass@example.com:443#trojan-test",
    ]
    yaml = to_clash_yaml(links)
    assert "proxies:" in yaml
    assert 'name: "test"' in yaml or "name: test" in yaml
    assert 'name: "trojan-test"' in yaml or "name: trojan-test" in yaml
    assert "proxy-groups:" in yaml


def test_to_clash_yaml_duplicate_names():
    links = [
        "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443#same",
        "trojan://pass@example.com:443#same",
    ]
    yaml = to_clash_yaml(links)
    assert ('name: "same"' in yaml or "name: same" in yaml)
    assert ('name: "same_2"' in yaml or "name: same_2" in yaml)


def test_to_clash_yaml_private_ip_filtered():
    links = [
        "ss://YWVzLTI1Ni1nY206cGFzcw==@127.0.0.1:1080#local",
        "ss://YWVzLTI1Ni1nY206cGFzcw==@192.168.1.1:1080#local",
    ]
    yaml = to_clash_yaml(links)
    # Proxies section starts after "proxies:" and ends before "proxy-groups:"
    proxies_section = yaml.split("proxies:")[1].split("proxy-groups:")[0]
    assert "127.0.0.1" not in proxies_section
    assert "192.168.1.1" not in proxies_section
    # No nodes should be written, so group falls back to DIRECT
    assert "DIRECT" in yaml


def test_to_clash_yaml_disclaimer():
    yaml = to_clash_yaml([])
    assert "DISCLAIMER" in yaml
    assert "educational" in yaml.lower() or "research" in yaml.lower()


def test_to_v2ray_subscription():
    links = ["ss://example", "vmess://example"]
    sub = to_v2ray_subscription(links)
    assert sub
    assert sub != "# ProxieHub V2Ray subscription"


def test_to_v2ray_subscription_private_ip_filtered():
    links = [
        "ss://YWVzLTI1Ni1nY206cGFzcw==@127.0.0.1:1080#local",
        "ss://YWVzLTI1Ni1nY206cGFzcw==@example.com:443#public",
    ]
    sub = to_v2ray_subscription(links)
    import base64
    decoded = base64.urlsafe_b64decode(sub + "=" * (-len(sub) % 4)).decode()
    assert "127.0.0.1" not in decoded
    assert "example.com" in decoded


def test_to_proxy_list():
    proxies = ["http://1.2.3.4:8080", "socks5://5.6.7.8:1080"]
    text = to_proxy_list(proxies)
    assert "http://1.2.3.4:8080" in text
    assert "socks5://5.6.7.8:1080" in text


def test_to_proxy_list_private_ip_filtered():
    proxies = ["http://127.0.0.1:8080", "http://1.2.3.4:8080"]
    text = to_proxy_list(proxies)
    assert "127.0.0.1" not in text
    assert "1.2.3.4" in text


def test_is_private_host():
    assert _is_private_host("127.0.0.1") is True
    assert _is_private_host("192.168.1.1") is True
    assert _is_private_host("10.0.0.1") is True
    assert _is_private_host("example.com") is False
    assert _is_private_host("localhost.local") is True


if __name__ == "__main__":
    test_to_clash_yaml_basic()
    test_to_clash_yaml_duplicate_names()
    test_to_clash_yaml_private_ip_filtered()
    test_to_clash_yaml_disclaimer()
    test_to_v2ray_subscription()
    test_to_v2ray_subscription_private_ip_filtered()
    test_to_proxy_list()
    test_to_proxy_list_private_ip_filtered()
    test_is_private_host()
    print("formatter tests passed")
