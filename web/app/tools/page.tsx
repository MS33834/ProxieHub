import Link from "next/link";
import {
  Wrench,
  Monitor,
  Smartphone,
  Router,
  Terminal,
  Globe,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    icon: Monitor,
    title: "桌面客户端",
    description: "Windows、macOS、Linux 上的图形化代理客户端，适合日常浏览与规则分流。",
    items: [
      { name: "Clash Verge Rev", href: "https://github.com/clash-verge-rev/clash-verge-rev", note: "跨平台 Clash GUI" },
      { name: "FlClash", href: "https://github.com/chen08209/FlClash", note: "Clash Meta 跨平台客户端" },
      { name: "v2rayN", href: "https://github.com/2dust/v2rayN", note: "Windows 首选" },
      { name: "Nekoray", href: "https://github.com/MatsuriDayo/nekoray", note: "sing-box / Xray 桌面端" },
      { name: "Hiddify", href: "https://github.com/hiddify/hiddify-next", note: "全平台友好" },
      { name: "Sing-box", href: "https://github.com/SagerNet/sing-box", note: "通用代理平台" },
    ],
  },
  {
    icon: Smartphone,
    title: "移动客户端",
    description: "Android 与 iOS 上的代理应用，支持二维码、订阅链接导入。",
    items: [
      { name: "v2rayNG", href: "https://github.com/2dust/v2rayNG", note: "Android 首选" },
      { name: "NekoBox", href: "https://github.com/MatsuriDayo/NekoBoxForAndroid", note: "Android sing-box" },
      { name: "Shadowrocket", href: "https://apps.apple.com/us/app/shadowrocket/id932747118", note: "iOS 付费" },
      { name: "Stash", href: "https://apps.apple.com/us/app/stash-rule-based-proxy/id1596063349", note: "iOS/tvOS 付费" },
      { name: "Quantumult X", href: "https://apps.apple.com/us/app/quantumult-x/id1443988620", note: "iOS 高阶" },
      { name: "Surge", href: "https://nssurge.com/", note: "iOS/macOS 高级" },
    ],
  },
  {
    icon: Globe,
    title: "浏览器扩展",
    description: "配合 HTTP/SOCKS5 代理列表使用，适合临时访问、爬虫或分场景代理。",
    items: [
      { name: "SwitchyOmega", href: "https://github.com/FelisCatus/SwitchyOmega", note: "Chrome/Firefox 经典" },
      { name: "FoxyProxy", href: "https://github.com/foxyproxy/browser-extension", note: "多浏览器支持" },
      { name: "Proxy SwitchySharp", href: "#", note: "轻量切换" },
    ],
  },
  {
    icon: Terminal,
    title: "命令行工具",
    description: "适合开发者、运维人员在服务器或本地脚本中快速验证代理可用性。",
    items: [
      { name: "curl", href: "https://curl.se/", note: "配合 --proxy 测试" },
      { name: "proxychains-ng", href: "https://github.com/rofl0r/proxychains-ng", note: "Linux 透明代理" },
      { name: "sing-box CLI", href: "https://sing-box.sagernet.org/", note: "核心库命令行" },
      { name: "mitmproxy", href: "https://mitmproxy.org/", note: "HTTPS 抓包与代理" },
    ],
  },
  {
    icon: Router,
    title: "路由器 / 软路由",
    description: "将代理部署在网关层，实现局域网内全设备透明代理。",
    items: [
      { name: "OpenClash", href: "https://github.com/vernesong/OpenClash", note: "OpenWrt Clash 插件" },
      { name: "PassWall", href: "https://github.com/xiaorouji/openwrt-passwall", note: "OpenWrt 代理集合" },
      { name: "HomeLede / ImmortalWrt", href: "https://github.com/immortalwrt/immortalwrt", note: "自带代理插件的固件" },
    ],
  },
  {
    icon: Wrench,
    title: "辅助工具",
    description: "节点解析、格式转换、延迟测试等小工具，可与 ProxieHub 配合使用。",
    items: [
      { name: "subconverter", href: "https://github.com/tindy2013/subconverter", note: "订阅格式转换" },
      { name: "v2rayN 订阅解析", href: "https://github.com/2dust/v2rayN", note: "内置解析" },
      { name: "Clash Dashboard", href: "https://github.com/Dreamacro/clash-dashboard", note: "Clash 面板" },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs text-muted font-mono mb-3">
          <Wrench className="w-3.5 h-3.5" />
          TOOLS
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">工具与生态</h1>
        <p className="text-sm text-muted max-w-2xl">
          除了 ProxieHub 提供的订阅，这里整理了各平台常用客户端、浏览器扩展、命令行工具和路由器方案，方便你根据场景组合使用。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-12">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.title} className="border border-border bg-surface p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 border border-border text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-semibold text-base">{cat.title}</h2>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-4">{cat.description}</p>
              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary-hover"
                    >
                      {item.name} <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-xs text-muted">{item.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold mb-3">如何选择？</h2>
        <div className="space-y-3 text-sm text-muted mb-5">
          <p>
            <strong className="text-foreground">新手入门：</strong>
            先选择对应平台的 GUI 客户端（Clash Verge Rev、v2rayN、v2rayNG、Shadowrocket），导入 Clash 或 V2Ray 订阅即可使用。
          </p>
          <p>
            <strong className="text-foreground">进阶玩家：</strong>
            可尝试 Sing-box、NekoBox、Quantumult X 等支持更灵活规则与 TUN 模式的工具。
          </p>
          <p>
            <strong className="text-foreground">批量/自动化：</strong>
            使用 ProxieHub 的 HTTP/SOCKS5 代理列表，配合 curl、proxychains-ng 或 subconverter 做二次处理。
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-3">
          <Link
            href="/clients"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            查看客户端教程 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background text-sm font-medium hover:bg-surface-hover transition-colors"
          >
            去复制订阅链接
          </Link>
        </div>
      </div>
    </div>
  );
}
