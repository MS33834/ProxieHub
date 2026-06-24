import ipaddress
import json
import socket
import threading
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

from parser import decode_vmess, parse_vless_link, parse_trojan_link, parse_ss_link
from utils import is_private_host

TIMEOUT = 5
MAX_WORKERS = 50
GEO_TIMEOUT = 5
GEO_MIN_INTERVAL = 1.5  # seconds; stay below ip-api free tier (≈45/min)

_geo_cache: dict[str, str] = {}
_geo_lock = threading.Lock()
_last_geo_request = 0.0


def can_reach_public_internet(timeout: int = 5) -> bool:
    """Check if the environment can make outbound TCP connections."""
    for host, port in [("1.1.1.1", 53), ("example.com", 443)]:
        try:
            with socket.create_connection((host, port), timeout=timeout):
                return True
        except Exception:
            continue
    return False


def tcp_check(host: str, port: int, timeout: int = TIMEOUT) -> tuple[bool, float]:
    """Measure TCP connect time and return (success, latency_ms)."""
    start = time.perf_counter()
    try:
        with socket.create_connection((host, port), timeout=timeout):
            latency_ms = (time.perf_counter() - start) * 1000
            return True, latency_ms
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
            port_raw = cfg.get("port")
            try:
                port = int(port_raw) if port_raw is not None and str(port_raw).strip() else None
            except (TypeError, ValueError):
                port = None
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


def resolve_ip(host: str) -> str | None:
    """Resolve a hostname to an IP address; return IPs unchanged."""
    try:
        ipaddress.ip_address(host)
        return host
    except ValueError:
        pass
    try:
        infos = socket.getaddrinfo(host, None, socket.AF_INET, socket.SOCK_STREAM)
        if infos:
            return infos[0][4][0]
    except Exception:
        pass
    try:
        infos = socket.getaddrinfo(host, None, socket.AF_INET6, socket.SOCK_STREAM)
        if infos:
            return infos[0][4][0]
    except Exception:
        pass
    return None


def _geo_request(url: str) -> dict:
    """Fetch a geo-API URL while enforcing a minimum request interval."""
    global _last_geo_request
    with _geo_lock:
        now = time.monotonic()
        next_time = max(now, _last_geo_request + GEO_MIN_INTERVAL)
        _last_geo_request = next_time
    wait = next_time - now
    if wait > 0:
        time.sleep(wait)

    req = urllib.request.Request(
        url,
        headers={"User-Agent": "ProxieHub-Verifier/1.0"},
    )
    with urllib.request.urlopen(req, timeout=GEO_TIMEOUT) as resp:
        return json.loads(resp.read().decode("utf-8", errors="ignore"))


def _format_geo(data: dict) -> str:
    """Extract a human-readable region string from geo API response."""
    if not data:
        return "unknown"
    country = data.get("country") or data.get("country_name") or ""
    region = data.get("regionName") or data.get("region") or ""
    if country and region and region != country:
        return f"{country}/{region}"
    return country or "unknown"


def _fetch_geo_data(ip: str) -> dict:
    """Try free IP geo APIs in order; return {} on failure."""
    try:
        data = _geo_request(
            f"https://ip-api.com/json/{ip}?fields=status,country,countryCode,regionName,region,city,query"
        )
        if data.get("status") == "success":
            return data
    except Exception:
        pass

    try:
        data = _geo_request(f"https://ipapi.co/{ip}/json/")
        if data.get("country") or data.get("country_name"):
            return data
    except Exception:
        pass

    return {}


def query_geo_api(ip: str) -> str:
    """Return region for an IP, using cache and falling back to 'unknown'."""
    if not ip or is_private_host(ip):
        return "private"
    with _geo_lock:
        cached = _geo_cache.get(ip)
    if cached is not None:
        return cached
    region = _format_geo(_fetch_geo_data(ip))
    with _geo_lock:
        _geo_cache[ip] = region
    return region


def verify_node(link: str, timeout: int = TIMEOUT, geo_enabled: bool = True) -> dict:
    host, port = parse_endpoint(link)
    if not host or not port:
        return {
            "link": link,
            "alive": False,
            "latency": None,
            "latency_ms": None,
            "region": "unknown",
            "error": "parse failed",
        }

    alive, latency_ms = tcp_check(host, port, timeout)
    latency_ms = int(round(latency_ms)) if alive else None

    if is_private_host(host):
        region = "private"
    elif alive and geo_enabled:
        ip = resolve_ip(host)
        region = query_geo_api(ip) if ip else "unknown"
    else:
        region = "unknown"

    return {
        "link": link,
        "alive": alive,
        "latency": round(latency_ms / 1000, 3) if latency_ms is not None else None,
        "latency_ms": latency_ms,
        "region": region,
    }


def verify_nodes(
    links: list[str], max_workers: int = MAX_WORKERS, geo_enabled: bool = True
) -> list[dict]:
    results = []
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_link = {
            executor.submit(verify_node, link, TIMEOUT, geo_enabled): link for link in links
        }
        for future in as_completed(future_to_link):
            try:
                results.append(future.result())
            except Exception as exc:
                link = future_to_link[future]
                results.append(
                    {
                        "link": link,
                        "alive": False,
                        "latency": None,
                        "latency_ms": None,
                        "region": "unknown",
                        "error": str(exc),
                    }
                )
    return results


def filter_alive(links: list[str], max_workers: int = MAX_WORKERS) -> list[str]:
    results = verify_nodes(links, max_workers)
    return [r["link"] for r in results if r["alive"]]


def stats_summary(results: list[dict]) -> dict:
    """Compute survival rate, average latency and region distribution."""
    total = len(results)
    alive = [r for r in results if r.get("alive")]
    alive_count = len(alive)
    latencies = [r["latency_ms"] for r in alive if r.get("latency_ms") is not None]
    avg_latency = round(sum(latencies) / len(latencies), 1) if latencies else None

    regions: dict[str, int] = {}
    for r in alive:
        region = r.get("region") or "unknown"
        regions[region] = regions.get(region, 0) + 1

    survival_rate = round(alive_count / total * 100, 1) if total else 0.0
    return {
        "total": total,
        "alive": alive_count,
        "survival_rate": survival_rate,
        "avg_latency": avg_latency,
        "regions": regions,
    }


if __name__ == "__main__":
    sample = [
        "ss://YWVzLTI1Ni1nY206cGFzc3dvcmQ=@example.com:443",
        "trojan://pass@example.com:443",
        "vmess://eyJhZGQiOiJleGFtcGxlLmNvbSIsInBvcnQiOiI0NDMiLCJpZCI6Inh4eHh4eHgteHh4eC14eHh4LXh4eHgteHh4eHh4eHh4eHgifQ==",
    ]
    for r in verify_nodes(sample, geo_enabled=True):
        print(r)
