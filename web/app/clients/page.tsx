import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  ArrowRight,
  AlertTriangle,
  Wrench,
  BookOpen,
} from "lucide-react";
import { ClientCard } from "@/components/client-card";
import { FeatureCard } from "@/components/feature-card";

const REPO_DOCS_BASE = "https://github.com/MS33834/ProxieHub/blob/main/docs";

const platforms = [
  {
    icon: Monitor,
    name: "Windows",
    clients: ["v2rayN", "Clash Verge Rev", "NekoBox"],
    guide: `${REPO_DOCS_BASE}/client-setup/v2rayn.md`,
  },
  {
    icon: Monitor,
    name: "macOS",
    clients: ["Clash Verge Rev", "V2RayXS", "Shadowrocket (M1/M2)"],
    guide: `${REPO_DOCS_BASE}/client-setup/clash.md`,
  },
  {
    icon: Smartphone,
    name: "Android",
    clients: ["v2rayNG", "NekoBox", "Clash Meta for Android"],
    guide: `${REPO_DOCS_BASE}/client-setup/v2rayng.md`,
  },
  {
    icon: Tablet,
    name: "iOS",
    clients: ["Shadowrocket", "Stash", "Quantumult X"],
    guide: `${REPO_DOCS_BASE}/client-setup/shadowrocket.md`,
  },
  {
    icon: Globe,
    name: "Browser",
    clients: ["SwitchyOmega", "FoxyProxy", "浏览器扩展"],
    guide: "#",
  },
];

const clients = [
  {
    name: "Clash Verge Rev",
    description: "Clash 内核的跨平台 GUI 客户端，界面现代，支持规则订阅与 TUN 模式。",
    icon: Monitor,
    platforms: ["Windows", "macOS", "Linux"],
    href: "https://github.com/clash-verge-rev/clash-verge-rev",
    tags: ["开源", "免费", "推荐新手"],
  },
  {
    name: "v2rayN",
    description: "Windows 平台最受欢迎的 V2Ray 客户端，支持 VMess/VLESS/Trojan/SS 等协议。",
    icon: Monitor,
    platforms: ["Windows"],
    href: "https://github.com/2dust/v2rayN",
    tags: ["开源", "免费", "Windows 首选"],
  },
  {
    name: "v2rayNG",
    description: "Android 平台经典 V2Ray 客户端，支持多种协议与二维码导入。",
    icon: Smartphone,
    platforms: ["Android"],
    href: "https://github.com/2dust/v2rayNG",
    tags: ["开源", "免费", "Android 首选"],
  },
  {
    name: "Shadowrocket",
    description: "iOS 平台功能强大的代理客户端，支持多种协议与规则，需付费购买。",
    icon: Tablet,
    platforms: ["iOS"],
    href: "https://apps.apple.com/us/app/shadowrocket/id932747118",
    tags: ["付费", "iOS 首选"],
  },
  {
    name: "NekoBox / NekoRay",
    description: "基于 sing-box 的跨平台客户端，适合进阶用户，支持多种出站协议。",
    icon: Wrench,
    platforms: ["Windows", "Android", "Linux"],
    href: "https://github.com/MatsuriDayo/nekoray",
    tags: ["开源", "免费", "进阶"],
  },
  {
    name: "Sing-box",
    description: "新一代通用代理平台，提供核心库与官方客户端，支持几乎所有现代协议。",
    icon: Globe,
    platforms: ["Windows", "macOS", "Linux", "Android", "iOS"],
    href: "https://github.com/SagerNet/sing-box",
    tags: ["开源", "免费", "全平台"],
  },
];

const beginnerGuides = [
  {
    title: "新手快速上手",
    desc: "从零开始：选择客户端、复制订阅、导入节点、连接使用。",
    href: `${REPO_DOCS_BASE}/beginner-guide.md`,
  },
  {
    title: "常见问题 FAQ",
    desc: "节点失效、订阅无法更新、客户端报错等问题的排查思路。",
    href: `${REPO_DOCS_BASE}/faq.md`,
  },
  {
    title: "v2rayN 配置教程",
    desc: "Windows 上最受欢迎的 V2Ray 客户端图文配置步骤。",
    href: `${REPO_DOCS_BASE}/client-setup/v2rayn.md`,
  },
  {
    title: "Shadowrocket 配置教程",
    desc: "iOS 平台导入订阅、选择节点、开启连接的完整流程。",
    href: `${REPO_DOCS_BASE}/client-setup/shadowrocket.md`,
  },
];

export default function ClientsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">客户端教程</h1>
        <p className="text-muted">
          根据你的设备和需求选择合适的客户端，并查看对应配置教程。所有链接均指向官方或开源仓库。
        </p>
      </div>

      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-10 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="text-sm">
          <strong className="text-warning">安全提示：</strong>
          客户端本身不会保护你的隐私，免费节点的运营者仍可能查看你的流量。请仅从官方渠道下载客户端，避免使用来路不明的破解版或修改版。
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
        {platforms.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl bg-surface border border-border p-5 text-center hover:-translate-y-1 transition-transform"
          >
            <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <p.icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold mb-2">{p.name}</h3>
            <ul className="text-sm text-muted space-y-1 mb-4">
              {p.clients.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <a
              href={p.guide}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              查看教程 <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-6">推荐客户端</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {clients.map((c) => (
          <ClientCard key={c.name} {...c} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            图文教程
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {beginnerGuides.map((g) => (
              <a
                key={g.title}
                href={g.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl bg-surface border border-border p-5 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-bold group-hover:text-primary transition-colors mb-1">
                  {g.title}
                </h3>
                <p className="text-sm text-muted">{g.desc}</p>
              </a>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-6">如何选择客户端？</h2>
          <div className="space-y-4">
            <FeatureCard
              icon={Monitor}
              title="新手用户"
              description="推荐 Clash Verge Rev（Windows/macOS/Linux）、v2rayN（Windows）、v2rayNG（Android）、Shadowrocket（iOS）。界面直观，支持一键订阅。"
            />
            <FeatureCard
              icon={Wrench}
              title="进阶用户"
              description="可尝试 NekoBox、Sing-box、Stash、Quantumult X 等，支持更灵活的规则、TUN 模式与协议组合。"
            />
            <FeatureCard
              icon={Globe}
              title="临时/轻量"
              description="浏览器扩展 + HTTP/SOCKS5 代理列表，适合临时访问或爬虫场景，不建议长期使用。"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-surface to-surface border border-primary/20 p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">还没决定用哪个？</h2>
        <p className="text-muted mb-6 max-w-xl mx-auto">
          先阅读新手快速上手指南，了解代理的基本概念和使用流程，再根据自己的设备选择客户端。
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`${REPO_DOCS_BASE}/beginner-guide.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-glow-sm"
          >
            阅读新手指南 <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border font-semibold hover:bg-surface-hover transition-all"
          >
            去复制订阅链接
          </Link>
        </div>
      </div>
    </div>
  );
}
