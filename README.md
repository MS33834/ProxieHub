# ProxieHub

> A community-curated aggregator of free proxy/VPN tools and public node lists. **For educational and research use only.**

[![CI](https://github.com/MS33834/ProxieHub/actions/workflows/ci.yml/badge.svg)](https://github.com/MS33834/ProxieHub/actions/workflows/ci.yml)
[![Update Nodes](https://github.com/MS33834/ProxieHub/actions/workflows/update-nodes.yml/badge.svg)](https://github.com/MS33834/ProxieHub/actions/workflows/update-nodes.yml)
[![Deploy Web](https://github.com/MS33834/ProxieHub/actions/workflows/deploy-web.yml/badge.svg)](https://github.com/MS33834/ProxieHub/actions/workflows/deploy-web.yml)

[English](#proxiehub) | [中文](#中文说明)

---

## ⚠️ Disclaimer

1. This project is for **network protocol learning, security testing, and privacy research** only.
2. All nodes and proxies come from **publicly available sources**. We do **not** guarantee availability, security, or privacy.
3. Do **not** log in to sensitive accounts (banking, payment, social media, etc.) while using free proxies or nodes.
4. Please comply with the laws and regulations of your jurisdiction.
5. Maintainers are **not** responsible for any direct or indirect losses caused by using this project.

---

## Quick Start

### Subscribe to daily node lists

| Format | GitHub Raw | GitCode Raw |
|---|---|---|
| Clash | `https://raw.githubusercontent.com/MS33834/ProxieHub/main/nodes/clash.yaml` | `https://api.gitcode.com/api/v5/repos/badhope/ProxieHub/raw/nodes/clash.yaml?ref=main` |
| V2Ray | `https://raw.githubusercontent.com/MS33834/ProxieHub/main/nodes/v2ray.txt` | `https://api.gitcode.com/api/v5/repos/badhope/ProxieHub/raw/nodes/v2ray.txt?ref=main` |
| HTTP/SOCKS5 | `https://raw.githubusercontent.com/MS33834/ProxieHub/main/nodes/proxies.txt` | `https://api.gitcode.com/api/v5/repos/badhope/ProxieHub/raw/nodes/proxies.txt?ref=main` |

> GitHub Actions updates the GitHub repository every day at 02:00 UTC. If you configure the `GITCODE_TOKEN` secret, the same workflow will also push the update to GitCode automatically.

### Browse the web interface

A static web UI is automatically built from the `web/` directory and deployed to GitHub Pages:

- **Home**: project overview, live stats, FAQ
- **Subscribe**: copy subscription links for Clash / V2Ray / HTTP(S)/SOCKS5
- **Sources**: transparent data-source list with protocol/update-frequency metadata
- **Clients**: recommended clients and setup guides by platform
- **Disclaimer**: full terms of use
- **Docs**: VitePress documentation site at `/docs/` — new user guide, client setup, data sources and automation workflow

### Node quality

The daily update workflow can optionally verify node connectivity and measure latency. Region identification is available but disabled by default in CI to keep runtime reasonable; enable it locally with `PROXIEHUB_GEO_ENABLED=true`.

### Browse tools by platform

- [Windows](tools/windows.md)
- [macOS](tools/macos.md)
- [Android](tools/android.md)
- [iOS](tools/ios.md)
- [Browser Extensions](tools/browser-extensions.md)

---

## Project Structure

```
ProxieHub/
├── README.md
├── LICENSE
├── requirements.txt          # Python dependencies
├── .env.example              # Local environment template (no secrets committed)
├── Makefile                  # Common dev commands
├── docs/                     # Guides and documentation
├── tools/                    # Client tool index by platform
├── nodes/                    # Auto-updated node lists
├── scripts/                  # Crawler & updater scripts
│   ├── crawler.py
│   ├── parser.py
│   ├── verifier.py
│   ├── formatter.py
│   └── update.py
├── config/                   # Data source configuration
│   └── sources.json
├── tests/                    # Unit tests
├── web/                      # Next.js static site
└── .github/workflows/        # CI/CD automation
    ├── update-nodes.yml
    └── deploy-web.yml
```

---

## How It Works

1. `scripts/crawler.py` fetches raw content from public sources listed in `config/sources.json`.
2. `scripts/parser.py` extracts proxy links (`ss://`, `vmess://`, `vless://`, `trojan://`, etc.).
3. `scripts/verifier.py` performs lightweight concurrent connectivity/latency checks.
4. `scripts/formatter.py` generates `clash.yaml`, `v2ray.txt`, and `proxies.txt`.
5. GitHub Actions runs the pipeline daily at 02:00 UTC, runs tests, and commits updates.

### Run locally

```bash
pip install -r requirements.txt
python scripts/update.py
make test
```

To enable node verification (slower but filters out dead nodes):

```bash
PROXIEHUB_VERIFY_NODES=true python scripts/update.py --verify
```

### Environment variables

| Variable | Default | Description |
|---|---|---|
| `PROXIEHUB_VERIFY_NODES` | `false` | Enable TCP connectivity checks during update |
| `PROXIEHUB_MAX_NODES` | `500` | Maximum node links to keep in output |
| `PROXIEHUB_MAX_PROXIES` | `200` | Maximum HTTP/SOCKS5 proxies to keep in output |
| `PROXIEHUB_ALLOWED_HOSTS` | `raw.githubusercontent.com,gitcode.com,api.gitcode.com` | Comma-separated extra allowed hosts for crawler |
| `PROXIEHUB_CRAWL_WORKERS` | `min(16, enabled_sources)` | Concurrent source fetch workers |
| `PROXIEHUB_GITHUB_OWNER` | `MS33834` | GitHub repository owner used in web UI links |
| `PROXIEHUB_REPO_NAME` | `ProxieHub` | Repository name used in web UI links |
| `PROXIEHUB_GITCODE_OWNER` | `badhope` | GitCode repository owner used in web UI links |

---

## Sync to GitCode

The GitHub Actions workflow can automatically push daily updates to GitCode as well.

### Enable automatic sync

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret**.
3. Name: `GITCODE_TOKEN`
4. Value: your GitCode personal access token.
5. Save.

After this, every daily update will be pushed to both GitHub and GitCode automatically.

### Manual sync

If you prefer to sync manually from your local machine:

```bash
git remote add github https://github.com/MS33834/ProxieHub.git
git remote add gitcode https://gitcode.com/badhope/ProxieHub.git

git pull github main
git push github main
git push gitcode main
```

> Never store tokens in remote URLs. Use a credential helper or enter tokens when prompted.

---

## Web Development

The `web/` directory is a Next.js 14 static site using TypeScript and Tailwind CSS.

```bash
cd web
npm install
npm run dev        # Start development server
npm run lint       # Run ESLint
npm run build      # Build static files to web/dist
```

The site is configured for GitHub Pages deployment with `basePath: "/ProxieHub"`.

---

## Contributing

- Add new public sources via PR to `config/sources.json`.
- Report broken sources or tools in Issues.
- Improve the web UI, docs, or scripts via PR.
- Please do **not** submit private/paid nodes or cracked software links.

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Community & Support

- GitHub Issues: bug reports, broken source reports, feature requests
- GitHub Discussions: general questions and ideas
- Security concerns: see [SECURITY.md](SECURITY.md)

---

## License

[MIT](LICENSE)

---

## 中文说明

**ProxieHub** 是一个开源的代理/VPN 工具聚合与免费公开节点列表项目，**仅供学习网络协议、安全测试和隐私技术研究使用**。

本项目不生产节点，所有内容均来自互联网公开渠道，不保证可用性、安全性与隐私性。使用时请遵守当地法律法规，不要在免费代理/节点环境下登录敏感账户。

### 主要特性

- **每日自动更新**：GitHub Actions 每天 UTC 02:00 自动抓取、解析、校验并发布节点。
- **多格式输出**：同时提供 Clash、V2Ray、HTTP/SOCKS5 三种订阅格式。
- **双端镜像**：订阅地址同时提供 GitHub 与 GitCode 两个入口，方便不同地区用户访问。
- **透明开源**：所有数据源、脚本与配置完全公开，社区可审计、可贡献。
- **静态前端**：基于 Next.js 的展示站点，提供节点统计、数据源透明度、客户端教程等。

### 快速开始

1. 选择适合你设备和客户端的订阅格式（Clash / V2Ray / HTTP SOCKS5）。
2. 复制 GitHub Raw 或 GitCode Raw 订阅链接。
3. 在客户端中粘贴订阅链接并更新。
4. 选择一个节点连接即可使用。

### 免责声明

使用本项目即表示你已阅读并同意 [免责声明](docs/index.md)。公开节点存在流量被查看、记录或篡改的风险，请仅用于学习研究。
