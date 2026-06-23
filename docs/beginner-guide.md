# 新手指南

## 什么是代理 / VPN？

代理或 VPN 是一种将你的网络流量通过另一台服务器中转的工具，常用于隐私保护、安全测试与理解网络路由。

## 快速开始

1. 根据你的设备平台从 [工具索引](https://github.com/MS33834/ProxieHub/tree/main/tools) 选择客户端。
2. 从官方来源下载并安装。
3. 从 [README](https://github.com/MS33834/ProxieHub/blob/main/README.md) 复制订阅链接。
4. 将订阅导入客户端。
5. 选择一个节点并连接。

## 选择正确的订阅格式

| 客户端 | 推荐格式 |
|---|---|
| Clash Verge Rev、Clash Meta、Clash for Windows、Stash | Clash |
| v2rayN、v2rayNG、Shadowrocket、NekoBox、Quantumult X、Hiddify | V2Ray |
| Surge、Sing-box | Clash / V2Ray（取决于导入方式） |
| SwitchyOmega、FoxyProxy、SmartProxy、curl、Python requests | HTTP(S)/SOCKS4/SOCKS5 |

## 分步示例：Windows 上的 v2rayN

1. 从 [2dust/v2rayN](https://github.com/2dust/v2rayN/releases) 下载 v2rayN。
2. 解压并运行程序。
3. 从 README 复制 V2Ray 订阅链接。
4. 在 v2rayN 中，进入 **订阅** → **从剪贴板导入订阅**。
5. 点击 **订阅** → **更新订阅**。
6. 从列表中选择一个节点并按 **回车键** 激活。

## 分步示例：Clash Verge Rev

1. 从 [官方发布页](https://github.com/clash-verge-rev/clash-verge-rev/releases) 下载 Clash Verge Rev。
2. 安装并运行程序。
3. 从 README 复制 Clash 订阅链接。
4. 在 Clash Verge Rev 中，进入 **配置文件** 并粘贴链接。
5. 下载配置文件并选中它。
6. 在 **代理** 标签页中选择一个节点，并启用 **系统代理**。

## 安全提示

- 不要在免费公开节点下登录银行或支付网站。
- 尽可能选择开源客户端。
- 保持客户端和订阅 URL 为最新。
- 只从官方仓库或应用商店下载客户端。
- 如果某个节点要求提供个人信息，请立即停止使用。

## 故障排查

| 问题 | 可能原因 | 解决方案 |
|---|---|---|
| 订阅无法更新 | 网络屏蔽了 GitHub Raw | 尝试 GitCode Raw 镜像 |
| 所有节点都超时 | 节点已过期 | 等待下一次每日更新或换用其他数据源 |
| 客户端提示“配置无效” | 格式不匹配 | 确保导入了正确格式（Clash 或 V2Ray） |
| 连接速度很慢 | 节点质量不一 | 尝试多个节点，或在本地启用验证 |
