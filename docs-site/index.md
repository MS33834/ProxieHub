---
layout: home

hero:
  name: ProxieHub
  text: 文档中心
  tagline: 免费公开代理 / VPN 节点聚合项目的使用指南、数据源说明与自动化工作流。
  image:
    src: /logo.svg
    alt: ProxieHub
  actions:
    - theme: brand
      text: 新手指南
      link: /beginner-guide
    - theme: alt
      text: 查看数据源
      link: /data-sources
    - theme: alt
      text: GitHub 仓库
      link: https://github.com/MS33834/ProxieHub

features:
  - icon: 📡
    title: 多格式订阅
    details: 同时提供 Clash、V2Ray 与 HTTP/SOCKS5 三种格式，覆盖主流客户端与使用场景。
  - icon: 🔄
    title: 每日自动更新
    details: GitHub Actions 每天 UTC 02:00 自动抓取、解析、校验并发布最新节点。
  - icon: 🔍
    title: 数据源透明
    details: 所有公开数据源与更新频率均可在 config/sources.json 中审计与贡献。
  - icon: 🛡️
    title: 安全提示
    details: 明确的使用边界与免责声明，帮助用户安全、合法地使用公开节点。
  - icon: 🏗️
    title: 架构清晰
    details: 配置、抓取、解析、验证、格式化、部署六层分离，便于理解与扩展。
  - icon: 🤝
    title: 社区共建
    details: 完善的新手文档、贡献指南与客户端对比，欢迎提交数据源、代码与文档改进。
---

## 快速开始

1. **选择客户端**：根据设备平台查看 [客户端配置](/client-setup/clash)。
2. **复制订阅链接**：在 [README](https://github.com/MS33834/ProxieHub#quick-start) 中选择 Clash、V2Ray 或 HTTP/SOCKS5 订阅地址。
3. **导入并更新**：将订阅链接粘贴到客户端中，点击更新即可获取当日节点。
4. **连接使用**：选择一个节点连接。免费节点稳定性有限，可等待次日自动更新。

> ⚠️ **免责声明**：本项目所有节点均来自互联网公开渠道，仅供学习网络协议、安全测试和隐私技术研究使用。使用时请遵守当地法律法规，不要在免费代理/节点环境下登录敏感账户。
