import socket
import time
from urllib.parse import urlparse

TIMEOUT = 5


def tcp_check(host: str, port: int) -> tuple[bool, float]:
    start = time.time()
    try:
        with socket.create_connection((host, port), timeout=TIMEOUT):
            latency = time.time() - start
            return True, latency
    except Exception:
        return False, float("inf")


def verify_node(link: str) -> dict:
    scheme = link.split("://", 1)[0]
    try:
        if scheme == "vmess":
            from parser import decode_vmess
            cfg = decode_vmess(link)
            host = cfg.get("add") if cfg else None
            port = int(cfg.get("port")) if cfg else None
        else:
            parsed = urlparse(link)
            host = parsed.hostname
            port = parsed.port
    except Exception:
        host, port = None, None

    if not host or not port:
        return {"link": link, "alive": False, "latency": None, "error": "parse failed"}

    alive, latency = tcp_check(host, port)
    return {"link": link, "alive": alive, "latency": round(latency, 3) if alive else None}


def verify_nodes(links: list) -> list:
    results = []
    for link in links:
        results.append(verify_node(link))
    return results


if __name__ == "__main__":
    print(verify_node("ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443"))
