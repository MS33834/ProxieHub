import Link from "next/link";
import {
  Globe,
  Shield,
  RefreshCw,
  Users,
  Scale,
  Eye,
  BookOpen,
  Heart,
  ArrowRight,
} from "lucide-react";

const principles = [
  {
    icon: Eye,
    title: "完全透明",
    description:
      "所有数据源、脚本、配置和输出文件均公开可查。任何人都可以审计数据流向，确认项目没有隐藏节点或私有服务器。",
  },
  {
    icon: RefreshCw,
    title: "自动化优先",
    description:
      "节点每天自动抓取、解析、格式化并发布。人工只需维护数据源配置与代码，降低因手动操作导致的延迟和错误。",
  },
  {
    icon: Shield,
    title: "安全边界",
    description:
      "默认过滤私有 IP 与本地地址，所有产物附带免责声明。我们明确告知风险，不提供任何安全承诺。",
  },
  {
    icon: Users,
    title: "社区驱动",
    description:
      "数据源由社区推荐，代码由社区 Review。项目走向通过 Issue、PR 和路线图公开讨论，没有封闭的决策。",
  },
  {
    icon: Scale,
    title: "合规使用",
    description:
      "项目定位为网络协议学习、安全测试与隐私技术研究的公共资源索引，不鼓励、不协助任何违法行为。",
  },
  {
    icon: BookOpen,
    title: "文档完整",
    description:
      "从新手快速上手到架构说明、开发部署、维护排错，文档覆盖多个层次，降低使用者与贡献者的门槛。",
  },
];

const milestones = [
  { date: "2026-06", title: "项目启动", desc: "确定 ProxieHub 定位，搭建自动化流水线与初始数据源。" },
  { date: "2026-06", title: "多格式输出", desc: "支持 Clash、V2Ray、HTTP/SOCKS5 三种订阅格式。" },
  { date: "2026-06", title: "双仓库同步", desc: "GitHub 主仓库与 GitCode 镜像同步，提升访问稳定性。" },
  { date: "2026-06", title: "前端与文档站", desc: "Next.js 展示站与 VitePress 文档站上线，内容持续扩展。" },
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs text-muted font-mono mb-3">
          <Globe className="w-3.5 h-3.5" />
          ABOUT
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">关于 ProxieHub</h1>
        <p className="text-sm text-muted max-w-2xl">
          一个社区维护的免费代理与公开节点聚合项目，致力于让网络协议学习、安全测试与隐私技术研究变得更透明、更高效。
        </p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">
        <div>
          <h2 className="text-xl font-semibold mb-3">我们做什么</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            ProxieHub 不运营任何代理或 VPN 节点。我们只做三件事：发现互联网上公开分享的节点与代理源，将其解析为标准化格式，再通过自动化流水线每日发布到仓库与静态站点。
          </p>
          <p className="text-sm text-muted leading-relaxed mb-4">
            通过统一的配置、可复用的脚本和透明的数据源列表，用户可以快速找到适合自己的客户端订阅，开发者也可以基于此构建自己的工具链。
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              获取订阅 <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-surface text-sm font-medium hover:bg-surface-hover transition-colors"
            >
              <Heart className="w-4 h-4" /> 参与贡献
            </Link>
          </div>
        </div>
        <div className="border border-border bg-surface p-5">
          <h3 className="font-medium text-sm mb-4">项目速览</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted">项目名称</dt>
              <dd className="font-mono">ProxieHub</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted">许可证</dt>
              <dd>MIT</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted">主仓库</dt>
              <dd className="font-mono text-primary">github.com/MS33834/ProxieHub</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted">镜像仓库</dt>
              <dd className="font-mono text-primary">gitcode.com/badhope/ProxieHub</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="text-muted">更新频率</dt>
              <dd>每日 UTC 02:00</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">主要技术栈</dt>
              <dd>Python / Next.js / Tailwind CSS / VitePress</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-6">核心原则</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {principles.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="border border-border bg-surface p-5">
                <div className="p-1.5 border border-border text-primary inline-flex mb-3">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-medium text-sm mb-2">{p.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-14">
        <h2 className="text-xl font-semibold mb-6">项目里程碑</h2>
        <div className="border border-border bg-surface p-5">
          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-16 shrink-0 text-xs font-mono text-primary pt-1">{m.date}</div>
                <div>
                  <h3 className="text-sm font-medium mb-1">{m.title}</h3>
                  <p className="text-xs text-muted">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold mb-3">重要声明</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          ProxieHub 仅作为公开资源的聚合与格式化工具，所有节点与代理均来自第三方公开渠道。我们不保证其可用性、安全性或隐私性，也不对因使用本项目而产生的任何直接或间接损失负责。
        </p>
        <Link
          href="/disclaimer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover"
        >
          阅读完整免责声明 <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}
