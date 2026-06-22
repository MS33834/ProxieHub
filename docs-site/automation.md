# 自动化工作流说明

ProxieHub 的日常运维主要由 GitHub Actions 驱动，从节点抓取、解析、校验到站点部署基本实现无人值守。

## 工作流概览

| 工作流文件 | 触发条件 | 主要职责 |
|---|---|---|
| `update-nodes.yml` | 每天 UTC 02:00 / 手动触发 | 运行 Python 流水线更新节点，提交并可选同步 GitCode |
| `ci.yml` | push / PR / 手动触发 | Python 代码检查与测试、Next.js 构建检查 |
| `deploy-web.yml` | web/、nodes/、config/sources.json 变更 / Update Nodes 完成后 / 手动触发 | 构建 Next.js 站点与 VitePress 文档并部署到 GitHub Pages |

## 节点更新流程（update-nodes.yml）

1. **检出仓库**：拉取完整历史，便于后续提交。
2. **安装 Python 依赖**：`pip install -r requirements.txt`。
3. **运行更新脚本**：
   ```bash
   PROXIEHUB_VERIFY_NODES=true \
   PROXIEHUB_MAX_NODES=800 \
   PROXIEHUB_MAX_PROXIES=300 \
   python scripts/update.py --verify
   ```
4. **运行测试**：`make test`。
5. **提交变更**：如果 `nodes/` 目录有变化，自动提交并推送 `chore: daily node update`。
6. **同步 GitCode**：如果配置了 `GITCODE_TOKEN` 密钥，则同时推送到 GitCode 镜像仓库。

## Python 流水线（scripts/）

`scripts/update.py` 按以下顺序调用各模块：

1. **`crawler.py`**：并发拉取 `config/sources.json` 中所有启用源。
2. **`parser.py`**：从原始内容中提取 `ss://`、`vmess://`、`vless://`、`trojan://` 等链接。
3. **`verifier.py`**：可选地对节点进行 TCP 连通性与延迟检测。
4. **`formatter.py`**：生成 `nodes/clash.yaml`、`nodes/v2ray.txt` 与 `nodes/proxies.txt`。

## 站点部署流程（deploy-web.yml）

当 Next.js 前端、节点产物或数据源配置发生变更时，部署工作流会：

1. 安装 Node.js 20 并缓存 `web/package-lock.json`。
2. 在 `web/` 目录执行 `npm ci`、`npm run lint` 与 `npm run build`。
3. 在 `docs-site/` 目录安装依赖并执行 `npm run docs:build`。
4. 将 `docs-site/.vitepress/dist` 复制到 `web/dist/docs/`。
5. 通过 `actions/upload-pages-artifact` 上传 `web/dist`。
6. 由 `deploy-pages` 任务将产物部署到 GitHub Pages。

最终访问路径：

- 主站：`https://<owner>.github.io/ProxieHub/`
- 文档站：`https://<owner>.github.io/ProxieHub/docs/`

## CI 检查（ci.yml）

每次 push 或 PR 时，CI 会并行执行：

- **Python 任务**：运行 `make lint`、`make test`，并在不启用验证的情况下执行一次完整更新流程。
- **Web 任务**：安装依赖、执行 ESLint 检查并构建 Next.js 站点，确保前端改动不会破坏静态导出。

## 本地模拟自动化

如果你想在本地复现完整流程：

```bash
# 1. 安装 Python 依赖
pip install -r requirements.txt

# 2. 运行完整更新（不验证，速度较快）
python scripts/update.py

# 3. 或开启连通性验证（较慢，但节点质量更高）
PROXIEHUB_VERIFY_NODES=true python scripts/update.py --verify

# 4. 运行测试
make test

# 5. 构建前端与文档站
cd web && npm install && npm run build
cd ../docs-site && npm install && npm run docs:build
```

## 环境变量

| 变量 | 默认值 | 说明 |
|---|---|---|
| `PROXIEHUB_VERIFY_NODES` | `false` | 更新时是否启用 TCP 连通性校验 |
| `PROXIEHUB_MAX_NODES` | `500` | 输出节点链接最大数量 |
| `PROXIEHUB_MAX_PROXIES` | `200` | 输出 HTTP/SOCKS 代理最大数量 |
| `PROXIEHUB_ALLOWED_HOSTS` | `raw.githubusercontent.com,gitcode.com,api.gitcode.com` | 爬虫额外允许的域名 |
| `PROXIEHUB_CRAWL_WORKERS` | `min(16, enabled_sources)` | 并发抓取源数量 |
| `GITCODE_TOKEN` | 无 | GitCode 同步所需的个人访问令牌 |
