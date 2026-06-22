# Frequently Asked Questions

## Why are all nodes dead?

Free public nodes have a short lifespan. It is normal for many or all of them to be offline within hours. Wait for the next daily update or report the source as broken.

## Is this project legal?

This project only aggregates publicly available resources for educational and research purposes. You are responsible for complying with the laws of your jurisdiction.

## Can I use these nodes for sensitive activities?

No. Do not use free public nodes for banking, payments, or logging into sensitive accounts. The operators of these nodes can potentially intercept your traffic.

## How often are nodes updated?

GitHub Actions runs the updater every day at 02:00 UTC. You can also trigger it manually from the Actions tab.

## How do I add a new source?

See [Contributing](../CONTRIBUTING.md). Open a PR that edits `config/sources.json`.

## GitCode links do not work in my client

GitCode raw file URLs require using the API endpoint. Use the links provided in the README, which point to `api.gitcode.com`.

## What is the difference between Clash and V2Ray formats?

- **Clash** format is a YAML file suitable for Clash-family clients (Clash Verge Rev, Clash Meta, Clash for Windows, Stash, Surge, etc.).
- **V2Ray** format is a Base64-encoded list of subscription links suitable for v2rayN, v2rayNG, Shadowrocket, NekoBox, Quantumult X, and other V2Ray/Xray-core clients.
- **HTTP/SOCKS5** format is a plain-text proxy list for browser extensions, crawlers, curl, or other tools.

## Why does the update pipeline skip verification by default?

Connectivity verification requires making outbound TCP connections to every node. This is time-consuming and may put load on public sources. You can enable it locally with `PROXIEHUB_VERIFY_NODES=true python scripts/update.py --verify`.

## Can I self-host the web UI?

Yes. The `web/` directory is a Next.js static site. Run `cd web && npm install && npm run build` to generate static files in `web/dist`, which can be served by any static host.

## How do I report a security issue?

Please see [SECURITY.md](../SECURITY.md) for responsible disclosure guidelines.
