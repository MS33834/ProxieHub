# 支持与帮助

感谢你使用 ProxieHub。在寻求帮助之前，请先阅读以下指引，这能帮助我们更高效地解决问题。

## 快速入口

- **项目首页**：[https://ms33834.github.io/ProxieHub](https://ms33834.github.io/ProxieHub)
- **文档站点**：[https://ms33834.github.io/ProxieHub/docs/](https://ms33834.github.io/ProxieHub/docs/)
- **GitHub Issues**：[https://github.com/MS33834/ProxieHub/issues](https://github.com/MS33834/ProxieHub/issues)
- **GitCode 镜像**：[https://gitcode.com/badhope/ProxieHub](https://gitcode.com/badhope/ProxieHub)

## 常见问题

### 节点无法连接怎么办？

免费公开节点具有时效性，可能随时失效。建议：

1. 等待次日 UTC 02:00 的自动更新。
2. 在本地运行 `python scripts/update.py --verify` 获取经过连通性校验的节点。
3. 尝试切换不同协议（Clash / V2Ray）或不同数据源。

### 订阅链接无法导入？

请确认：

- 客户端支持的订阅格式与所选链接一致。
- 链接可正常访问（GitHub Raw 在国内可能需要镜像）。
- 可尝试使用 GitCode 镜像链接。

### 如何提交新的数据源？

请使用 [数据源报告模板](https://github.com/MS33834/ProxieHub/issues/new?template=source_report.md) 提交 Issue，并提供公开可访问的 URL、协议类型与更新频率。

## 报告问题

如果常见问题无法解决你的疑问，请在 GitHub Issues 中提交，并尽量包含：

1. 问题描述与复现步骤。
2. 环境信息（操作系统、客户端、浏览器等）。
3. 相关错误截图或日志。
4. 已尝试的解决方案。

## 安全漏洞

如果你发现了安全漏洞，请不要在公开 Issue 中披露。请按照 [SECURITY.md](SECURITY.md) 中的流程进行私密报告。

## 参与贡献

ProxieHub 欢迎各种形式的贡献。详情请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。
