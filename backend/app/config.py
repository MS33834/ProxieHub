"""Application configuration via pydantic-settings."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# Backend root: backend/
BACKEND_DIR = Path(__file__).resolve().parent.parent
# Project root: proxiehub/
PROJECT_ROOT = BACKEND_DIR.parent


class Settings(BaseSettings):
    """Runtime configuration loaded from environment / .env file."""

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_DIR / ".env"),
        env_file_encoding="utf-8",
        env_prefix="PROXIEHUB_",
        extra="ignore",
    )

    # --- Application ---
    app_name: str = "ProxieHub API"
    debug: bool = False
    api_prefix: str = "/api"
    # Comma-separated list of allowed CORS origins (empty = same-origin only)
    cors_origins: str = ""

    # --- Database ---
    # SQLite path (relative to backend/data/). Use sqlite:///abs/path for custom.
    database_url: str = f"sqlite:///{BACKEND_DIR / 'data' / 'proxiehub.db'}"

    # --- Admin ---
    # API key for protected endpoints (e.g. /api/admin/*). Empty = disabled.
    admin_api_key: str = ""

    # --- Pipeline tuning ---
    max_nodes: int = 800
    max_proxies: int = 300
    verify_nodes: bool = True
    verify_timeout: int = 5
    verify_workers: int = 50
    geo_enabled: bool = False
    crawl_workers: int = 16

    # --- Scheduler ---
    # Cron-like schedules (empty = disabled). Defaults match the design doc.
    schedule_full_refresh: str = "0 3 * * *"  # daily 03:00
    schedule_verify_alive: str = "*/30 * * * *"  # every 30 min
    schedule_verify_dead: str = "0 */6 * * *"  # every 6h
    schedule_cleanup: str = "0 4 * * *"  # daily 04:00

    # --- Paths ---
    sources_config_path: str = str(PROJECT_ROOT / "config" / "sources.json")
    nodes_output_dir: str = str(PROJECT_ROOT / "nodes")

    # --- Encryption ---
    # 32-byte hex key for AES-GCM of node secrets. Empty = no encryption (dev only).
    secret_key_hex: str = ""


@lru_cache
def get_settings() -> Settings:
    """Cached settings singleton."""
    return Settings()
