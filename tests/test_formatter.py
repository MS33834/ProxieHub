import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from formatter import to_clash_yaml, to_v2ray_subscription, to_proxy_list


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


def test_to_v2ray_subscription():
    links = ["ss://example", "vmess://example"]
    sub = to_v2ray_subscription(links)
    assert sub
    assert sub != "# ProxieHub V2Ray subscription"


def test_to_proxy_list():
    proxies = ["http://1.2.3.4:8080", "socks5://5.6.7.8:1080"]
    text = to_proxy_list(proxies)
    assert "http://1.2.3.4:8080" in text
    assert "socks5://5.6.7.8:1080" in text


if __name__ == "__main__":
    test_to_clash_yaml_basic()
    test_to_clash_yaml_duplicate_names()
    test_to_v2ray_subscription()
    test_to_proxy_list()
    print("formatter tests passed")
