# ProxieHub

> A community-curated aggregator of free proxy/VPN tools and public node lists. **For educational and research use only.**

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

> GitHub Actions updates the GitHub repository every day at 02:00 UTC. GitCode is mirrored manually after each update.

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
└── .github/workflows/        # CI/CD automation
    └── update-nodes.yml
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
python tests/test_parser.py
```

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

## Contributing

- Add new public sources via PR to `config/sources.json`.
- Report broken sources or tools in Issues.
- Please do **not** submit private/paid nodes or cracked software links.

---

## License

[MIT](LICENSE)

---

## 中文说明

**ProxieHub** 是一个开源的代理/VPN 工具聚合与免费公开节点列表项目，**仅供学习网络协议、安全测试和隐私技术研究使用**。

本项目不生产节点，所有内容均来自互联网公开渠道，不保证可用性、安全性与隐私性。使用时请遵守当地法律法规，不要在免费代理/节点环境下登录敏感账户。

订阅地址同时提供 GitHub 与 GitCode 两个入口，方便不同地区用户访问。
