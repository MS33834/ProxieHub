# 参与 ProxieHub 贡献

感谢你对 ProxieHub 的关注！本文件介绍如何报告问题、提议新数据源以及提交代码。请在提交 Issue 或 Pull Request 前先阅读本指南。

## 如何报告 Bug

1. **先搜索现有 Issue**：在 [Issues](../../issues) 中搜索关键词，确认问题未被报告过。
2. **使用 Bug 报告模板**：选择 `.github/ISSUE_TEMPLATE/bug_report.yml` 模板，填写必填项。
3. **提供复现步骤**：给出最小可复现的命令、输入或配置，不要粘贴节点 URL 中的敏感信息。
4. **说明运行环境**：操作系统、Python 版本、所在分支、工作流运行 ID 等。
5. **附上日志或截图**：如有错误日志，请先脱敏（删除 token、Cookie、邮箱等）再上传。

## 如何提议新数据源

新增数据源建议通过 Issue 或 Pull Request 提交。详细标准、格式示例与提交步骤请见 [docs/data-source-guide.md](../docs/data-source-guide.md)。请提供以下信息：

- **数据源名称**：便于识别的名称。
- **URL**：公开可访问的链接，例如 GitHub Raw 或公开 API。
- **协议类型**：如 `vmess`、`vless`、`ss`、`trojan`、`http`、`socks5` 等。
- **更新频率**：`5min`、`hourly`、`daily`、`12h`、`30min` 或 `inactive`。
- **可访问性说明**：是否需要认证、是否允许自动化抓取、是否遵守 `robots.txt`。
- **编码方式**：是否 Base64 编码。
- **备注**：文件大小、来源限制、地域特点等。

新增数据源需满足：

- 必须来自**公开渠道**，不接受私有、付费或破解节点。
- 允许自动化、非破坏性地抓取。
- 不违反来源站点的使用条款或当地法律法规。

如需提交 Pull Request，请在 `config/sources.json` 的对应数组（`free_node_sources` 或 `free_proxy_apis`）中添加条目，并将 `enabled` 设为 `false` 表示待审阅；审阅通过后可开启。

## 代码贡献流程

1. **Fork 仓库**：从本仓库 fork 到你自己的账号。
2. **创建分支**：从 `main` 切出功能分支，例如 `feat/add-source-foo`、`fix/parser-timeout`。
3. **保持提交小巧清晰**：一个 PR 只解决一个问题或一个功能。
4. **本地验证**：

   ```bash
   make test      # 运行 Python 单元测试
   make lint      # 检查 Python 语法
   make lint-web  # 若修改了 web/ 目录
   make build-web # 若修改了前端，确认能构建
   ```

5. **提交 Pull Request**：使用仓库提供的 PR 模板，描述变更原因、测试方式和影响范围。
6. **等待审阅**：维护者会尽快审阅，可能需要你补充测试或调整代码。

## 提交信息风格

建议使用 Conventional Commits 风格，前缀含义如下：

| 前缀 | 用途 |
|---|---|
| `feat:` | 新增功能或数据源 |
| `fix:` | 修复 Bug |
| `docs:` | 仅文档变更 |
| `chore:` | 构建、依赖、工作流等杂项 |
| `style:` | 代码格式调整（不影响功能） |
| `test:` | 测试相关变更 |
| `refactor:` | 重构（既不新增功能也不修复 Bug） |

示例：

```text
feat: 添加 proxifly HTTP/SOCKS5 代理源
fix: 修复 verifier 在高并发下连接泄漏的问题
docs: 更新 Clash 客户端配置说明
```

## 注意事项

- **不要提交任何密钥、token 或个人节点列表**。
- 免费节点具有时效性，Issue 中仅讨论项目脚本、配置和文档本身，不保证节点可用性。
- 保持友善和尊重，遵守 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)。

如有疑问，欢迎通过 [Discussions](../../discussions) 交流。
