"""Health & admin API."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.rate_limit import limit_public
from app.core.security import require_admin
from app.database import get_db
from app.models import Node
from app.schemas.schemas import HealthOut, RefreshRequest, TaskResponse
from app.services.pipeline_service import create_task_id, run_full_pipeline

router = APIRouter(tags=["health & admin"])


@router.get("/health", response_model=HealthOut, dependencies=[Depends(limit_public)])
async def health(db: AsyncSession = Depends(get_db)) -> HealthOut:
    """Service health check."""
    try:
        total = await db.scalar(
            select(func.count()).select_from(
                select(Node).where(Node.is_deleted == False).subquery()  # noqa: E712
            )
        ) or 0
        alive = await db.scalar(
            select(func.count()).select_from(
                select(Node).where(Node.is_deleted == False, Node.is_alive == True).subquery()  # noqa: E712
            )
        ) or 0
        last_updated = await db.scalar(
            select(func.max(Node.updated_at)).where(Node.is_deleted == False)  # noqa: E712
        )
        return HealthOut(
            status="ok",
            database="connected",
            total_nodes=total,
            alive_nodes=alive,
            last_updated=last_updated,
        )
    except Exception as exc:
        return HealthOut(
            status="degraded",
            database=f"error: {exc}",
            total_nodes=0,
            alive_nodes=0,
            last_updated=None,
        )


@router.post(
    "/admin/refresh",
    response_model=TaskResponse,
    dependencies=[Depends(require_admin)],
)
async def trigger_refresh(body: RefreshRequest) -> TaskResponse:
    """Manually trigger a full pipeline run (requires admin API key)."""
    task_id = create_task_id()
    # Fire-and-forget: run in background.
    import asyncio
    asyncio.create_task(run_full_pipeline(verify=body.verify, task_id=task_id))
    return TaskResponse(
        task_id=task_id,
        status="accepted",
        message="Pipeline refresh started. Poll /api/admin/tasks/{task_id} for status.",
    )


@router.get(
    "/admin/tasks/{task_id}",
    dependencies=[Depends(require_admin)],
)
async def get_task_status(task_id: str) -> dict:
    """Poll the status of a pipeline task."""
    from app.services.pipeline_service import get_task_status
    status = get_task_status(task_id)
    if not status:
        from fastapi import HTTPException, status as http_status
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail="Task not found")
    return {"task_id": task_id, **status}
