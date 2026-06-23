# 部署说明

ProxieHub 的部署分为两部分：自动化节点更新与静态站点部署。本文档介绍相关配置与排错方法。

## GitHub Actions 工作流

### update-nodes.yml

每日 UTC 02:00 自动运行：

1. 检出代码
2. 安装 Python 依赖
3. 执行 `scripts/update.py --verify`（启用节点验证）
4. 运行单元测试
5. 提交节点文件变更
6. 可选同步到 GitCode

### deploy-web.yml

在 `main` 分支推送或 `update-nodes.yml` 完成后触发：

1. 检出代码
2. 在 `web/` 目录安装 Node 依赖
3. 运行 `npm run build`
4. 将 `web/dist/` 部署到 GitHub Pages

## GitCode 同步配置

1. 进入仓库 **Settings → Secrets and variables → Actions**。
2. 新建名为 `GITCODE_TOKEN` 的 repository secret。
3. 值为 GitCode 个人访问令牌。
4. 保存后，定时更新会自动推送到 GitCode 镜像。

## 手动触发

在 GitHub 仓库页面进入 **Actions** 标签，选择对应工作流后点击 **Run workflow**。

## 站点访问地址

- GitHub Pages：`https://ms33834.github.io/ProxieHub`
- 文档站点：`https://ms33834.github.io/ProxieHub/docs/`
- GitCode Pages：可在 GitCode 仓库设置中启用

## 常见问题

### 工作流提示权限不足

确保 `GITHUB_TOKEN` 拥有 Contents 与 Pages 的写入权限，或在仓库 Settings → Actions → General → Workflow permissions 中选择 **Read and write permissions**。

### 部署后页面 404

检查 `next.config.mjs` 中的 `basePath` 是否与仓库名一致，并确认 GitHub Pages 的发布源设置正确。

### GitCode 同步失败

- 确认 `GITCODE_TOKEN` 已正确设置且未过期。
- 检查 GitCode 仓库地址是否与工作流中的远程 URL 一致。
- 若出现 non-fast-forward 错误，工作流会自动先拉取再推送。
