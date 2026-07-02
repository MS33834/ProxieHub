"""APScheduler integration: runs periodic crawl/verify/cleanup jobs."""

from __future__ import annotations

import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from app.config import get_settings
from app.services.pipeline_service import run_full_pipeline

logger = logging.getLogger("proxiehub.scheduler")

_scheduler: AsyncIOScheduler | None = None


async def _full_refresh_job() -> None:
    """Daily full pipeline run (crawl + verify + publish)."""
    logger.info("scheduled full refresh starting")
    try:
        await run_full_pipeline(verify=True)
    except Exception:
        logger.exception("scheduled full refresh failed")


async def _verify_alive_job() -> None:
    """Periodic verification of alive nodes (connectivity re-check)."""
    logger.info("scheduled alive-node verification starting")
    try:
        await run_full_pipeline(verify=True)
    except Exception:
        logger.exception("scheduled verification failed")


def init_scheduler() -> AsyncIOScheduler:
    """Initialise and start the scheduler (call once on startup)."""
    global _scheduler
    if _scheduler is not None:
        return _scheduler

    settings = get_settings()
    _scheduler = AsyncIOScheduler(timezone="UTC")

    if settings.schedule_full_refresh:
        _scheduler.add_job(
            _full_refresh_job,
            CronTrigger.from_crontab(settings.schedule_full_refresh),
            id="full_refresh",
            replace_existing=True,
        )
    if settings.schedule_verify_alive:
        _scheduler.add_job(
            _verify_alive_job,
            CronTrigger.from_crontab(settings.schedule_verify_alive),
            id="verify_alive",
            replace_existing=True,
        )

    _scheduler.start()
    logger.info("scheduler started with %d jobs", len(_scheduler.get_jobs()))
    return _scheduler


def shutdown_scheduler() -> None:
    """Gracefully shut down the scheduler."""
    global _scheduler
    if _scheduler:
        _scheduler.shutdown(wait=False)
        _scheduler = None
