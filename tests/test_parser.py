import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "scripts"))

from parser import extract_node_links, decode_vmess


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


if __name__ == "__main__":
    test_extract_node_links()
    test_decode_vmess()
    print("tests passed")
