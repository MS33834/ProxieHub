"""Backend integration tests: DB models + API endpoints with sample data.

Run with: cd backend && python3 -m pytest tests/test_api.py -v
Or standalone: cd backend && python3 tests/test_api.py
"""

from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path

# Ensure backend/ is on the path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

# Use a temp DB before importing app
os.environ["PROXIEHUB_DEBUG"] = "true"
os.environ["PROXIEHUB_DATABASE_URL"] = f"sqlite:///{BACKEND_DIR / 'data' / 'test.db'}"
os.environ["PROXIEHUB_ADMIN_API_KEY"] = "test-key"


def _rm_test_db() -> None:
    for suffix in ("", "-wal", "-shm", "-journal"):
        p = BACKEND_DIR / "data" / f"test.db{suffix}"
        if p.exists():
            p.unlink()


async def _seed_and_test() -> None:
    """Seed the database with sample nodes and run API checks."""
    from sqlalchemy import select

    from app.database import Base, async_session_factory, db_session, engine
    from app.models import Node, NodeCheck, ProxySource

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed sample data
    async with db_session() as session:
        # Add a source
        src = ProxySource(
            name="test-source",
            url="https://example.com/sub",
            category="nodes",
            source_type="subscription",
            enabled=True,
        )
        session.add(src)
        await session.flush()

        # Add sample nodes
        samples = [
            ("vmess", "1.2.3.4", 443, "uuid-1", True, 120, "HK", "vmess://abc#HK-1"),
            ("vless", "5.6.7.8", 443, "uuid-2", True, 200, "US", "vless://def#US-1"),
            ("ss", "9.10.11.12", 8388, "pass1", False, None, "JP", "ss://ghi#JP-1"),
            ("trojan", "13.14.15.16", 443, "pass2", True, 350, "SG", "trojan://jkl#SG-1"),
        ]
        for proto, server, port, secret, alive, lat, region, link in samples:
            fp = Node.compute_fingerprint(proto, server, port, secret)
            node = Node(
                fingerprint=fp,
                raw_link=link,
                protocol=proto,
                server=server,
                port=port,
                auth_secret=secret,
                network="tcp",
                transport_config="{}",
                tls=True,
                remark=f"{region}-test",
                region=region,
                source_id=src.id,
                source_name="test-source",
                is_alive=alive,
                last_latency_ms=lat,
                fail_reason=None if alive else "timeout",
            )
            session.add(node)
            await session.flush()
            session.add(NodeCheck(node_id=node.id, is_alive=alive, latency_ms=lat, fail_reason=None if alive else "timeout"))

        await session.commit()

    # Now test API endpoints via httpx AsyncClient
    from httpx import ASGITransport, AsyncClient
    from app.main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        results = {}

        # Health
        r = await client.get("/api/health")
        results["health"] = r.json()
        assert r.status_code == 200
        assert results["health"]["status"] == "ok"
        assert results["health"]["total_nodes"] == 4
        assert results["health"]["alive_nodes"] == 3

        # Stats
        r = await client.get("/api/stats")
        results["stats"] = r.json()
        assert r.status_code == 200
        assert results["stats"]["total_nodes"] == 4
        assert results["stats"]["alive_nodes"] == 3
        assert results["stats"]["survival_rate"] == 75.0

        # Protocol stats
        r = await client.get("/api/stats/protocols")
        results["protocols"] = r.json()
        assert r.status_code == 200
        assert len(results["protocols"]) == 4

        # Region stats
        r = await client.get("/api/stats/regions")
        results["regions"] = r.json()
        assert r.status_code == 200
        assert len(results["regions"]) == 4

        # Nodes list
        r = await client.get("/api/nodes?limit=2")
        results["nodes"] = r.json()
        assert r.status_code == 200
        assert results["nodes"]["total"] == 4
        assert len(results["nodes"]["items"]) == 2

        # Nodes filter by protocol
        r = await client.get("/api/nodes?protocol=vmess")
        results["nodes_vmess"] = r.json()
        assert r.status_code == 200
        assert results["nodes_vmess"]["total"] == 1

        # Nodes filter by alive
        r = await client.get("/api/nodes?alive=true")
        results["nodes_alive"] = r.json()
        assert r.status_code == 200
        assert results["nodes_alive"]["total"] == 3

        # Node detail
        r = await client.get("/api/nodes/1")
        results["node_detail"] = r.json()
        assert r.status_code == 200
        assert results["node_detail"]["protocol"] == "vmess"

        # Node history
        r = await client.get("/api/nodes/1/history")
        results["node_history"] = r.json()
        assert r.status_code == 200
        assert len(results["node_history"]) == 1

        # Sources
        r = await client.get("/api/sources")
        results["sources"] = r.json()
        assert r.status_code == 200
        assert len(results["sources"]) == 1
        assert results["sources"][0]["name"] == "test-source"

        # Admin without key → 401
        r = await client.post("/api/admin/refresh", json={"verify": False})
        assert r.status_code == 401

        # Admin with key → accepted
        r = await client.post(
            "/api/admin/refresh",
            json={"verify": False},
            headers={"X-API-Key": "test-key"},
        )
        results["admin_refresh"] = r.json()
        assert r.status_code == 200
        assert results["admin_refresh"]["status"] == "accepted"

        # Search
        r = await client.get("/api/nodes?q=HK")
        results["search"] = r.json()
        assert r.status_code == 200
        assert results["search"]["total"] == 1

    # Print summary
    print("\n" + "=" * 60)
    print("ALL TESTS PASSED")
    print("=" * 60)
    for name, data in results.items():
        print(f"\n--- {name} ---")
        if isinstance(data, dict) and "items" in data:
            print(f"  total={data['total']}, returned={len(data['items'])}")
        elif isinstance(data, list):
            print(f"  count={len(data)}")
        else:
            print(f"  {data}")

    # Cleanup
    await engine.dispose()
    _rm_test_db()


if __name__ == "__main__":
    _rm_test_db()
    asyncio.run(_seed_and_test())
