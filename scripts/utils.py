"""Shared utilities for ProxieHub pipelines."""

from __future__ import annotations

import base64
import ipaddress
import json
import logging
import os
import ssl
import sys
from pathlib import Path
from urllib.parse import urlparse

PROJECT_ROOT = Path(__file__).parent.parent
CONFIG_PATH = PROJECT_ROOT / "config" / "sources.json"
NODES_DIR = PROJECT_ROOT / "nodes"

USER_AGENT = "ProxieHub-Crawler/1.0 (+https://github.com/MS33834/ProxieHub)"

# Only HTTPS URLs from well-known public hosts are allowed as data sources.
ALLOWED_SCHEMES = {"https"}
DEFAULT_ALLOWED_HOSTS = {
    "raw.githubusercontent.com",
    "gitcode.com",
    "api.gitcode.com",
}


class ConfigurationError(ValueError):
    """Raised when the configuration is missing or invalid."""


class FetchError(RuntimeError):
    """Raised when a remote source cannot be fetched."""


class ParseError(ValueError):
    """Raised when a node/proxy link cannot be parsed."""


def setup_logging(level: int | str | None = None) -> logging.Logger:
    """Configure a standard logger for the pipeline.

    Uses ``PROXIEHUB_LOG_LEVEL`` environment variable when ``level`` is not
    provided. Defaults to INFO.
    """
    if level is None:
        level = os.environ.get("PROXIEHUB_LOG_LEVEL", "INFO")
    if isinstance(level, str):
        level = getattr(logging, level.upper(), logging.INFO)

    logger = logging.getLogger("proxiehub")
    logger.setLevel(level)

    # Avoid adding duplicate handlers when the function is called multiple times.
    if not any(isinstance(h, logging.StreamHandler) for h in logger.handlers):
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(logging.Formatter("%(levelname)s [%(name)s] %(message)s"))
        logger.addHandler(handler)

    return logger


def get_logger(name: str) -> logging.Logger:
    """Return a child logger under the proxiehub namespace."""
    return logging.getLogger(f"proxiehub.{name}")


logger = get_logger("utils")


def _pad_base64(data: str) -> str:
    """Pad base64 string to a multiple of 4 characters."""
    data = data.rstrip("=")
    return data + "=" * (-len(data) % 4)


def safe_b64decode(data: str) -> bytes | None:
    """Decode base64/urlsafe-base64 data, tolerating missing padding."""
    if not data:
        return None
    data = data.strip()
    if not data:
        return None
    for decoder in (base64.urlsafe_b64decode, base64.b64decode):
        try:
            decoded = decoder(_pad_base64(data))
            if decoded:
                return decoded
        except Exception:
            continue
    return None


def decode_bytes(data: bytes) -> str:
    """Decode bytes to text, trying utf-8 then gbk then latin-1."""
    for encoding in ("utf-8", "gbk", "latin-1"):
        try:
            return data.decode(encoding)
        except (UnicodeDecodeError, LookupError):
            continue
    return data.decode("utf-8", errors="ignore")


def allowed_hosts() -> set[str]:
    """Return allowed hosts, optionally extended via env var."""
    hosts = set(DEFAULT_ALLOWED_HOSTS)
    extra = os.environ.get("PROXIEHUB_ALLOWED_HOSTS", "")
    if extra:
        hosts.update(h.strip().lower() for h in extra.split(",") if h.strip())
    return hosts


def validate_url(url: str) -> None:
    """Reject non-HTTPS URLs and unexpected hosts to mitigate SSRF risks."""
    parsed = urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        raise ConfigurationError(f"URL scheme not allowed: {parsed.scheme}")
    host = (parsed.hostname or "").lower()
    if not host:
        raise ConfigurationError("URL has no host")
    allowed = allowed_hosts()
    if not any(host == allowed_host or host.endswith(f".{allowed_host}") for allowed_host in allowed):
        raise ConfigurationError(f"URL host not allowed: {host}")


def ssl_context() -> ssl.SSLContext:
    """Create an SSL context compatible with a wide range of servers."""
    context = ssl.create_default_context()
    # Prefer SECLEVEL=2 for stronger security; fall back to SECLEVEL=1 only
    # if the stricter cipher set is unavailable on the system.
    try:
        context.set_ciphers("DEFAULT:@SECLEVEL=2")
    except ssl.SSLError:
        logger.warning("SECLEVEL=2 ciphers unavailable; falling back to SECLEVEL=1")
        context.set_ciphers("DEFAULT:@SECLEVEL=1")
    return context


def is_private_host(host: str | None) -> bool:
    """Return True if host is a private/reserved IP or localhost."""
    if not host:
        return True
    lower = str(host).lower()
    if lower in ("localhost", "127.0.0.1", "::1"):
        return True
    # Strip IPv6 brackets so bracketed hosts are evaluated correctly.
    if lower.startswith("[") and lower.endswith("]"):
        lower = lower[1:-1]
    try:
        ip = ipaddress.ip_address(lower)
        return (
            ip.is_private
            or ip.is_reserved
            or ip.is_loopback
            or ip.is_multicast
            or ip.is_link_local
            or ip.is_unspecified
        )
    except ValueError:
        # Hostname: allow public domains; block obvious local suffixes.
        local_suffixes = (".local", ".localhost", ".lan", ".internal")
        return any(lower.endswith(s) for s in local_suffixes)


def load_sources(config_path: Path | None = None) -> dict:
    """Load and minimally validate sources.json.

    Raises ConfigurationError on missing file or malformed JSON.
    """
    path = config_path or CONFIG_PATH
    if not path.exists():
        raise ConfigurationError(f"sources config not found: {path}")
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as exc:
        raise ConfigurationError(f"invalid JSON in {path}: {exc}") from exc
    except OSError as exc:
        raise ConfigurationError(f"cannot read {path}: {exc}") from exc

    if not isinstance(data, dict):
        raise ConfigurationError("sources config must be a JSON object")

    for key in ("free_node_sources", "free_proxy_apis"):
        value = data.get(key)
        if value is not None and not isinstance(value, list):
            raise ConfigurationError(f"sources.{key} must be a list")

    return data
