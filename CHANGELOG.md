# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-06-23

### Added
- 新增网站页面：路线图、更新日志、参与贡献、架构说明、运行状态、关于、工具生态、社区。
- 数据源页面新增协议筛选、更新频率分布与数据源提交入口。
- 客户端教程扩展至 Clash Verge Rev、FlClash、v2rayN、v2rayNG、Shadowrocket、Surge、Nekoray、Hiddify、Sing-box 等。
- 运行状态面板，基于构建时读取节点文件生成实时统计。
- 数据源页面新增协议覆盖与更新频率分布概览。
- 新增仓库治理文件：CODEOWNERS、FUNDING.yml、release.yml、AUTHORS.md、SUPPORT.md、.gitattributes、VERSION。
- 新增开发运维文档：docs/development.md、docs/deployment.md、docs/maintenance.md。
- README 增加 Actions 状态徽章、社区支持入口与扩展页面说明。

### Improved
- 导航栏与页脚统一加入新增页面入口，并适配移动端菜单。
- 订阅页面补充各格式使用说明与客户端匹配建议。
- 首页新增架构流程 teaser、最新动态卡片与参与贡献 CTA。

### Fixed
- 统一全站协议表述为 HTTP(S)/SOCKS4/SOCKS5，修正页面与文档中的不一致。
- 客户端卡片统一使用外部锚点标签打开官方仓库，符合静态导出链接规范。
- 去除部分页面中的套话，使文案更直接、贴合 ProxieHub 风格。
- 修复 formatter.py 存活率统计在全部节点失效时误报 100% 的逻辑错误。
- 修复 crawler.py 编码检测死代码（errors="ignore" 导致 gbk/latin-1 分支永不执行）。
- 修复 PROXIEHUB_CRAWL_WORKERS=0 时 ThreadPoolExecutor 崩溃。
- 修复 parser.py 正则截断 IPv6 地址（排除 ] 导致 [2001:db8::1] 被切断）。
- 修复 vmess JSON 中 port/aid 为 null 时 int() 崩溃。
- 修复 verifier.py port=0 因 falsy 判断被误判为无端口。
- 修复 sources.json 数据源名称重复（ermaozi-get-subscribe-v2ray）。
- 移除 sources.json 中无效的 gfpcom wiki raw URL（GitHub Wiki 不可通过 raw 路径访问）。
- 修复 sources/page.tsx 免责声明链接未走 basePath 导致 GitHub Pages 404。
- 修复 formatter.py YAML 回退路径字符串未加引号可能生成无效 YAML。
- 修复 verifier.py geo 缓存读写未加锁的竞态条件。
- 修正 docs/development.md 中不存在的 --dry-run 参数说明。
- 修正 docs/deployment.md 工作流步骤顺序与实际不一致。
- Barabama-FreeNodes 数据源 URL 从 feature 分支改为 main 分支。

## [1.1.0] - 2026-06-15

### Added
- 支持三种输出格式：Clash YAML、V2Ray 订阅、HTTP/SOCKS5 代理列表。
- GitHub Actions 工作流：每日自动更新节点与自动部署网站。
- 双仓库同步：GitHub 主仓库与 GitCode 镜像同时更新。

### Improved
- 数据源配置迁移至 config/sources.json，支持单独启用/禁用。
- 新增基础 TCP 连通性校验，过滤明显不可用的节点。

### Fixed
- 修复多个数据源重叠导致的重复节点问题。

## [1.0.0] - 2026-06-01

### Added
- 搭建初始自动化流水线：爬虫、解析、格式化、校验。
- 使用 Next.js + Tailwind CSS 构建静态网站。
- 上线数据源透明度、免责声明与订阅说明页面。
