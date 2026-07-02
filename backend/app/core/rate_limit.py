"""Rate-limiting helpers (in-memory token bucket for MVP).

For production with multiple workers, replace with a Redis-backed limiter.
"""

from __future__ import annotations

import time
from collections import defaultdict

from fastapi import HTTPException, Request, status


class TokenBucket:
    """Simple thread-unsafe token bucket (sufficient for single-process uvicorn)."""

    def __init__(self, rate: float, capacity: int) -> None:
        self.rate = rate
        self.capacity = capacity
        self._tokens: dict[str, float] = defaultdict(lambda: float(capacity))
        self._last: dict[str, float] = defaultdict(time.monotonic)

    def allow(self, key: str) -> bool:
        now = time.monotonic()
        elapsed = now - self._last[key]
        self._last[key] = now
        self._tokens[key] = min(self.capacity, self._tokens[key] + elapsed * self.rate)
        if self._tokens[key] >= 1:
            self._tokens[key] -= 1
            return True
        return False


# 60 requests per minute per IP for public endpoints.
_public_bucket = TokenBucket(rate=1.0, capacity=60)
# 10 requests per minute for subscription endpoints.
_sub_bucket = TokenBucket(rate=1.0 / 6, capacity=10)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def limit_public(request: Request) -> None:
    """Dependency: 60 req/min per IP for public endpoints."""
    if not _public_bucket.allow(_client_ip(request)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Try again later.",
            headers={"Retry-After": "60"},
        )


async def limit_subscription(request: Request) -> None:
    """Dependency: 10 req/min per IP for subscription generation endpoints."""
    if not _sub_bucket.allow(_client_ip(request)):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Subscription rate limit exceeded. Try again later.",
            headers={"Retry-After": "60"},
        )
