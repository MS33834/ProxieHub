# Beginner Guide

## What is a proxy/VPN?

A proxy or VPN is a tool that routes your internet traffic through another server, often used for privacy, security testing, or bypassing network restrictions.

## Quick Start

1. Choose a client for your platform from the [tool index](../tools/).
2. Download and install it from the official source.
3. Subscribe to a node list from the [README](../README.md).
4. Import the subscription into your client.
5. Select a node and connect.

## Choose the right subscription format

| Client | Recommended format |
|---|---|
| Clash Verge Rev, Clash Meta, Clash for Windows | Clash |
| v2rayN, v2rayNG, Shadowrocket, NekoBox, Quantumult X | V2Ray |
| SwitchyOmega, FoxyProxy, curl, Python requests | HTTP/SOCKS5 |

## Step-by-step example: v2rayN on Windows

1. Download v2rayN from [2dust/v2rayN](https://github.com/2dust/v2rayN/releases).
2. Extract and run the application.
3. Copy the V2Ray subscription link from the README.
4. In v2rayN, go to **Subscription** → **Import subscription from clipboard**.
5. Click **Subscription** → **Update subscription**.
6. Select a node from the list and press **Enter** to activate.

## Step-by-step example: Clash Verge Rev

1. Download Clash Verge Rev from the [official releases](https://github.com/clash-verge-rev/clash-verge-rev/releases).
2. Install and run the application.
3. Copy the Clash subscription link from the README.
4. In Clash Verge Rev, go to **Profiles** and paste the link.
5. Download the profile and select it.
6. Choose a proxy node in the **Proxies** tab and enable **System Proxy**.

## Safety Tips

- Do not log in to banking or payment sites through free public nodes.
- Prefer open-source clients when possible.
- Keep your client and subscription URLs up to date.
- Only download clients from official repositories or app stores.
- If a node asks for personal information, stop using it immediately.

## Troubleshooting

| Problem | Possible cause | Solution |
|---|---|---|
| Subscription cannot be updated | Network blocked GitHub Raw | Try the GitCode Raw mirror |
| All nodes show timeout | Nodes expired | Wait for the next daily update or try another source |
| Client shows "invalid config" | Format mismatch | Make sure you imported the correct format (Clash vs V2Ray) |
| Connection is very slow | Node quality varies | Try multiple nodes or enable verification locally |
