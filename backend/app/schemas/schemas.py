"""Pydantic response/request schemas for the API."""

from __future__ import annotations

from datetime import datetime
from typing import Generic, TypeVar

from pydantic import BaseModel, ConfigDict


T = TypeVar("T")


class ORMModel(BaseModel):
    """Base config for models that wrap ORM objects."""

    model_config = ConfigDict(from_attributes=True)


# --------------------------------------------------------------------------- #
# Node schemas
# --------------------------------------------------------------------------- #
class NodeOut(ORMModel):
    id: int
    protocol: str
    server: str
    port: int
    network: str
    tls: bool
    remark: str
    region: str
    source_name: str
    is_alive: bool
    last_latency_ms: int | None
    last_checked_at: datetime | None
    first_seen_at: datetime
    updated_at: datetime


class NodeDetail(NodeOut):
    raw_link: str
    auth_secret: str
    transport_config: str
    fail_reason: str | None


class NodeCheckOut(ORMModel):
    checked_at: datetime
    is_alive: bool
    latency_ms: int | None
    fail_reason: str | None


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int


# --------------------------------------------------------------------------- #
# Stats schemas
# --------------------------------------------------------------------------- #
class ProtocolStat(BaseModel):
    protocol: str
    total: int
    alive: int


class RegionStat(BaseModel):
    region: str
    total: int
    alive: int
    avg_latency_ms: float | None


class GlobalStats(BaseModel):
    total_nodes: int
    alive_nodes: int
    dead_nodes: int
    survival_rate: float
    avg_latency_ms: float | None
    total_sources: int
    enabled_sources: int
    last_updated: datetime | None


# --------------------------------------------------------------------------- #
# Source schemas
# --------------------------------------------------------------------------- #
class SourceOut(ORMModel):
    id: int
    name: str
    url: str
    category: str
    source_type: str
    enabled: bool
    decode_base64: bool
    proxy_scheme: str
    last_fetch_at: datetime | None
    last_fetch_status: str | None
    last_nodes_added: int
    last_error: str | None
    consecutive_failures: int
    updated_at: datetime


# --------------------------------------------------------------------------- #
# Health & admin
# --------------------------------------------------------------------------- #
class HealthOut(BaseModel):
    status: str
    database: str
    total_nodes: int
    alive_nodes: int
    last_updated: datetime | None


class RefreshRequest(BaseModel):
    verify: bool = True


class TaskResponse(BaseModel):
    task_id: str
    status: str
    message: str


# --------------------------------------------------------------------------- #
# Subscriptions
# --------------------------------------------------------------------------- #
class SubscriptionInfo(BaseModel):
    format: str
    url: str
    description: str
