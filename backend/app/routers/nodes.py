"""Nodes API: list, detail, search."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.rate_limit import limit_public
from app.database import get_db
from app.models import Node, NodeCheck
from app.schemas.schemas import NodeDetail, NodeOut, PaginatedResponse

router = APIRouter(prefix="/nodes", tags=["nodes"])


@router.get("", response_model=PaginatedResponse[NodeOut], dependencies=[Depends(limit_public)])
async def list_nodes(
    db: AsyncSession = Depends(get_db),
    protocol: str | None = Query(None, description="Filter by protocol (vmess/vless/ss/trojan)"),
    region: str | None = Query(None, description="Filter by region"),
    alive: bool | None = Query(None, description="Filter by liveness"),
    max_latency: int | None = Query(None, description="Max latency in ms"),
    q: str | None = Query(None, description="Search remark/region"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    sort: str = Query("updated", description="Sort: updated|latency|newest"),
) -> PaginatedResponse[NodeOut]:
    """List nodes with optional filtering, search, and pagination."""
    stmt = select(Node).where(Node.is_deleted == False)  # noqa: E712

    if protocol:
        stmt = stmt.where(Node.protocol == protocol.lower())
    if region:
        stmt = stmt.where(Node.region == region)
    if alive is not None:
        stmt = stmt.where(Node.is_alive == alive)
    if max_latency is not None:
        stmt = stmt.where(Node.last_latency_ms <= max_latency)
    if q:
        pattern = f"%{q}%"
        stmt = stmt.where(Node.remark.ilike(pattern) | Node.region.ilike(pattern))

    # Total count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = await db.scalar(count_stmt) or 0

    # Sort
    if sort == "latency":
        stmt = stmt.order_by(Node.last_latency_ms.asc().nullslast())
    elif sort == "newest":
        stmt = stmt.order_by(Node.first_seen_at.desc())
    else:
        stmt = stmt.order_by(Node.updated_at.desc())

    stmt = stmt.limit(limit).offset(offset)
    result = await db.execute(stmt)
    items = [NodeOut.model_validate(n) for n in result.scalars().all()]

    return PaginatedResponse(items=items, total=total, limit=limit, offset=offset)


@router.get("/{node_id}", response_model=NodeDetail, dependencies=[Depends(limit_public)])
async def get_node(node_id: int, db: AsyncSession = Depends(get_db)) -> NodeDetail:
    """Get a single node with full details."""
    node = await db.get(Node, node_id)
    if not node or node.is_deleted:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")
    return NodeDetail.model_validate(node)


@router.get("/{node_id}/history", dependencies=[Depends(limit_public)])
async def get_node_history(
    node_id: int,
    db: AsyncSession = Depends(get_db),
    limit: int = Query(50, ge=1, le=200),
) -> list[dict]:
    """Get verification history for a node."""
    stmt = (
        select(NodeCheck)
        .where(NodeCheck.node_id == node_id)
        .order_by(NodeCheck.checked_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return [
        {
            "checked_at": c.checked_at.isoformat() if c.checked_at else None,
            "is_alive": c.is_alive,
            "latency_ms": c.latency_ms,
            "fail_reason": c.fail_reason,
        }
        for c in result.scalars().all()
    ]
