"""FastAPI application entry point."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.routers import health_admin, nodes, sources, stats, subscriptions
from app.scheduler.jobs import init_scheduler, shutdown_scheduler

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s [%(name)s] %(message)s",
)
logger = logging.getLogger("proxiehub")


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore[no-untyped-def]
    """Application startup/shutdown lifecycle."""
    settings = get_settings()

    # Create tables (MVP; switch to Alembic migrations for production).
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("database initialised")

    # Start the scheduler.
    if not settings.debug:
        init_scheduler()
        logger.info("scheduler initialised")
    else:
        logger.info("debug mode — scheduler disabled")

    yield

    shutdown_scheduler()
    await engine.dispose()
    logger.info("shutdown complete")


def create_app() -> FastAPI:
    """Application factory."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        description=(
            "ProxieHub API — a community-maintained free proxy and public node "
            "aggregator. For network protocol learning, security testing, and "
            "privacy research only."
        ),
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # CORS
    origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()] if settings.cors_origins else []
    if origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["GET"],
            allow_headers=["*"],
        )

    # Register routers under /api
    api_prefix = settings.api_prefix
    app.include_router(nodes.router, prefix=api_prefix)
    app.include_router(stats.router, prefix=api_prefix)
    app.include_router(sources.router, prefix=api_prefix)
    app.include_router(subscriptions.router, prefix=api_prefix)
    app.include_router(health_admin.router, prefix=api_prefix)

    @app.get("/", tags=["root"])
    async def root() -> dict:
        return {
            "name": settings.app_name,
            "version": "1.0.0",
            "docs": "/docs",
            "health": f"{api_prefix}/health",
        }

    return app


app = create_app()
