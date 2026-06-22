import socket
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

from parser import decode_vmess, parse_vless_link, parse_trojan_link, parse_ss_link

TIMEOUT = 5
MAX_WORKERS = 50


def can_reach_public_internet(timeout: int = 5) -> bool:
    """Check if the environment can make outbound TCP connections."""
    # Use Cloudflare DNS or example.com as a well-known public endpoint.
    for host, port in [("1.1.1.1", 53), ("example.com", 443)]:
        try:
            with socket.create_connection((host, port), timeout=timeout):
                return True
        except Exception:
            continue
    return False


def tcp_check(host: str, port: int, timeout: int = TIMEOUT) -> tuple[bool, float]:
    start = time.time()
    try:
        with socket.create_connection((host, port), timeout=timeout):
            latency = time.time() - start
            return True, latency
    except Exception:
        return False, float("inf")


def parse_endpoint(link: str) -> tuple[str | None, int | None]:
    scheme = link.split("://", 1)[0].lower()
    try:
        if scheme == "vmess":
            cfg = decode_vmess(link)
            if not cfg:
                return None, None
            host = cfg.get("add")
            port = int(cfg.get("port")) if cfg.get("port") else None
            return host, port
        if scheme == "vless":
            cfg = parse_vless_link(link)
            if not cfg:
                return None, None
            return cfg.get("server"), cfg.get("port")
        if scheme == "trojan":
            cfg = parse_trojan_link(link)
            if not cfg:
                return None, None
            return cfg.get("server"), cfg.get("port")
        if scheme == "ss":
            cfg = parse_ss_link(link)
            if not cfg:
                return None, None
            return cfg.get("server"), cfg.get("port")
        parsed = urlparse(link)
        return parsed.hostname, parsed.port
    except Exception:
        return None, None


def verify_node(link: str, timeout: int = TIMEOUT) -> dict:
    host, port = parse_endpoint(link)
    if not host or not port:
        return {"link": link, "alive": False, "latency": None, "error": "parse failed"}

    alive, latency = tcp_check(host, port, timeout)
    return {
        "link": link,
        "alive": alive,
        "latency": round(latency, 3) if alive else None,
    }


def verify_nodes(links: list[str], max_workers: int = MAX_WORKERS) -> list[dict]:
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_link = {executor.submit(verify_node, link): link for link in links}
        for future in as_completed(future_to_link):
            try:
                results.append(future.result())
            except Exception as exc:
                link = future_to_link[future]
                results.append({"link": link, "alive": False, "latency": None, "error": str(exc)})
    return results


def filter_alive(links: list[str], max_workers: int = MAX_WORKERS) -> list[str]:
    results = verify_nodes(links, max_workers)
    return [r["link"] for r in results if r["alive"]]


if __name__ == "__main__":
    sample = [
        "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443",
        "trojan://pass@example.com:443",
        "vmess://eyJhZGQiOiJleGFtcGxlLmNvbSIsInBvcnQiOiI0NDMiLCJpZCI6Inh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHgifQ==",
    ]
    for r in verify_nodes(sample):
        print(r)
