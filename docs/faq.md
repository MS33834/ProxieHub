# 常见问题

## 为什么所有节点都失效了？

免费公开节点生命周期很短，几小时内可能全部或大部分离线属于正常现象。等待下一次每日更新，或在 Issues 中报告失效的数据源。

## 这个项目合法吗？

本项目仅聚合公开可访问的资源，用于教育和研究目的。用户需自行遵守所在国家或地区的法律法规。

## 可以使用这些节点进行敏感操作吗？

不可以。不要在免费公开节点下登录银行、支付或社交等敏感账户。节点运营者可能查看、记录或篡改你的流量。

## 节点多久更新一次？

GitHub Actions 每天 UTC 02:00 运行一次更新流程。你也可以在 Actions 标签页中手动触发。

## 如何添加新的数据源？

参见 [CONTRIBUTING.md](../CONTRIBUTING.md)。提交一个编辑 `config/sources.json` 的 Pull Request 即可。

## 我的客户端里 GitCode 链接无法使用

GitCode 原始文件 URL 需要使用 API 端点。请使用 README 中提供的、指向 `api.gitcode.com` 的链接。

## Clash 和 V2Ray 格式有什么区别？

- **Clash** 格式是一个 YAML 文件，适用于 Clash 系客户端（Clash Verge Rev、Clash Meta、Clash for Windows、Stash、Surge 等）。
- **V2Ray** 格式是一个 Base64 编码的订阅链接列表，适用于 v2rayN、v2rayNG、Shadowrocket、NekoBox、Quantumult X 等基于 V2Ray/Xray 内核的客户端。
- **HTTP(S)/SOCKS4/SOCKS5** 格式是明文代理列表，适用于浏览器扩展、爬虫、curl 等工具。

## 为什么更新流程默认跳过验证？

连通性验证需要对每个节点发起出站 TCP 连接，耗时较长，也可能对公开源造成压力。你可以在本地通过 `PROXIEHUB_VERIFY_NODES=true python3 scripts/update.py --verify` 开启。

## 可以自己部署 Web UI 吗？

可以。`web/` 目录是一个 Next.js 静态站点。运行 `cd web && npm install && npm run build` 即可在 `web/dist` 中生成静态文件，可部署到任何静态托管服务。

## 如何报告安全问题？

请参见 [SECURITY.md](../SECURITY.md) 中的负责任披露指南。
