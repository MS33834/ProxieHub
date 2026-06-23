# 路线图

本页面记录 ProxieHub 的短期、中期与长期规划。状态标签含义如下：

| 标签 | 含义 |
|---|---|
| <span class="vp-badge">规划中</span> | 已有初步想法，尚未开始实施 |
| <span class="vp-badge tip">进行中</span> | 正在开发或已部分落地 |
| <span class="vp-badge success">已完成</span> | 已实现并可用 |
| <span class="vp-badge warning">待评估</span> | 需要社区讨论或技术验证 |

## 短期规划（1–3 个月）

短期目标以提升文档完整度、数据质量和自动化稳定性为主。

| 目标 | 状态 | 说明 |
|---|---|---|
| 扩展 VitePress 文档站 | <span class="vp-badge success">已完成</span> | 新增架构、贡献指南、路线图、更新日志、状态页与客户端对比页 |
| 统一文档与主站风格 | <span class="vp-badge tip">进行中</span> | 保持深色、简洁的视觉一致性，完善首页特性卡片 |
| 数据源审核与清洗 | <span class="vp-badge tip">进行中</span> | 定期检查 `config/sources.json` 中失效、重复或体积过大的源 |
| 修复 CI 偶发超时 | <span class="vp-badge">规划中</span> | 优化大文件源的超时与重试策略，减少 `update-nodes.yml` 失败率 |
| 节点质量报告 | <span class="vp-badge">规划中</span> | 在 `nodes/regions.json` 或新文件中记录每日存活率与平均延迟 |

## 中期规划（3–6 个月）

中期目标围绕可观测性、多格式支持与社区协作展开。

| 目标 | 状态 | 说明 |
|---|---|---|
| 实时节点状态页 | <span class="vp-badge">规划中</span> | 在主站展示最近一次更新的节点数、协议分布与存活率 |
| 订阅格式扩展 | <span class="vp-badge warning">待评估</span> | 评估是否需要 Sing-box JSON、Shadowsocks JSON 等额外格式 |
| 数据源可靠性评分 | <span class="vp-badge">规划中</span> | 根据历史抓取成功率与节点存活率给源打分 |
| 多区域镜像 | <span class="vp-badge warning">待评估</span> | 除 GitCode 外，评估其他静态托管或镜像方案 |
| 自动化 Issue 反馈 | <span class="vp-badge">规划中</span> | 当某个数据源连续多日失效时，自动创建/更新 Broken Source Issue |
| 更细粒度的验证 | <span class="vp-badge warning">待评估</span> | 在 TCP 检测基础上，评估协议层握手或 HTTP 探测的可行性 |

## 长期规划（6 个月以上）

长期目标让 ProxieHub 成为公开代理节点领域可靠、透明、可持续的社区项目。

| 目标 | 状态 | 说明 |
|---|---|---|
| 社区治理模型 | <span class="vp-badge">规划中</span> | 明确维护者、贡献者Reviewer 流程与数据源审核标准 |
| 可插拔数据源适配器 | <span class="vp-badge">规划中</span> | 支持抓取 GitHub Gist、API 分页、RSS 等更多形态的数据源 |
| 去中心化发布 | <span class="vp-badge warning">待评估</span> | 探索 IPFS、种子或其他去中心化方式分发节点列表 |
| 多语言文档 | <span class="vp-badge warning">待评估</span> | 在中文文档基础上提供英文等语言版本 |
| 官方 CLI 工具 | <span class="vp-badge">规划中</span> | 提供 `proxiehub` 命令行工具，支持本地抓取、验证与导出 |
| 安全审计与隐私加固 | <span class="vp-badge">规划中</span> | 定期审计抓取与验证逻辑，减少信息泄露与 SSRF 风险 |

## 如何影响路线图

- 如果你希望某个功能优先实现，请在 GitHub Discussions 中发起讨论。
- 如果你愿意认领某个任务，请在对应 Issue 中留言，避免重复劳动。
- 如果你有新的数据源或客户端建议，请参考 [参与贡献](/contributing) 页面提交 PR。

> 本路线图会根据社区反馈和实际维护节奏动态调整，最新状态以本页面为准。
