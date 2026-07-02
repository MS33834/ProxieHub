"""Subscriptions API: generate Clash / V2Ray / plain-text subscriptions on the fly."""

from __future__ import annotations

import base64

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.rate_limit import limit_subscription
from app.database import get_db
from app.models import Node
from app.pipeline import _SCRIPTS_DIR  # noqa: F401  (ensures scripts/ on path)
from formatter import to_clash_yaml, to_proxy_list, to_v2ray_subscription  # type: ignore[import-not-found]

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])


async def _fetch_nodes(
    db: AsyncSession,
    protocol: str | None,
    region: str | None,
    alive_only: bool,
    limit: int,
) -> list[Node]:
    """Fetch nodes for subscription generation."""
    stmt = select(Node).where(Node.is_deleted == False)  # noqa: E712
    if alive_only:
        stmt = stmt.where(Node.is_alive == True)  # noqa: E712
    if protocol:
        stmt = stmt.where(Node.protocol == protocol.lower())
    if region:
        stmt = stmt.where(Node.region == region)
    stmt = stmt.order_by(Node.last_latency_ms.asc().nullslast()).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


@router.get("/clash", dependencies=[Depends(limit_subscription)])
async def subscription_clash(
    db: AsyncSession = Depends(get_db),
    protocol: str | None = Query(None),
    region: str | None = Query(None),
    alive: bool = Query(True),
    limit: int = Query(800, ge=1, le=2000),
) -> Response:
    """Generate a Clash YAML subscription."""
    nodes = await _fetch_nodes(db, protocol, region, alive, limit)
    if not nodes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No nodes available")
    links = [n.raw_link for n in nodes]
    content = to_clash_yaml(links)
    return Response(content=content, media_type="text/yaml", headers={
        "Content-Disposition": 'attachment; filename="proxiehub-clash.yaml"',
        "Cache-Control": "public, max-age=300",
    })


@router.get("/v2ray", dependencies=[Depends(limit_subscription)])
async def subscription_v2ray(
    db: AsyncSession = Depends(get_db),
    protocol: str | None = Query(None),
    region: str | None = Query(None),
    alive: bool = Query(True),
    limit: int = Query(800, ge=1, le=2000),
) -> Response:
    """Generate a Base64-encoded V2Ray subscription."""
    nodes = await _fetch_nodes(db, protocol, region, alive, limit)
    if not nodes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No nodes available")
    links = [n.raw_link for n in nodes]
    content = to_v2ray_subscription(links)
    return Response(content=content, media_type="text/plain", headers={
        "Content-Disposition": 'attachment; filename="proxiehub-v2ray.txt"',
        "Cache-Control": "public, max-age=300",
    })


@router.get("/plain", dependencies=[Depends(limit_subscription)])
async def subscription_plain(
    db: AsyncSession = Depends(get_db),
    alive: bool = Query(True),
    limit: int = Query(300, ge=1, le=1000),
) -> Response:
    """Generate a plain HTTP/SOCKS proxy list (proxies.txt equivalent)."""
    # Note: this endpoint returns proxy-style entries; nodes are vmess/vless/ss/trojan
    # so this is kept for API symmetry. For raw proxies, use /api/nodes?protocol=...
    from app.models import ProxySource
    # Return node links as plain text (one per line) for non-Clash clients.
    stmt = select(Node).where(Node.is_deleted == False)  # noqa: E712
    if alive:
        stmt = stmt.where(Node.is_alive == True)  # noqa: E712
    stmt = stmt.order_by(Node.last_latency_ms.asc().nullslast()).limit(limit)
    result = await db.execute(stmt)
    links = [n.raw_link for n in result.scalars().all()]
    if not links:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No nodes available")
    content = "\n".join(links) + "\n"
    return Response(content=content, media_type="text/plain", headers={
        "Content-Disposition": 'attachment; filename="proxiehub-plain.txt"',
        "Cache-Control": "public, max-age=300",
    })
