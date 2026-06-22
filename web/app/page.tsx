import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Zap,
  Clock,
  RefreshCw,
  Globe,
  Lock,
  Layers,
  Users,
  Server,
  Eye,
  HeartHandshake,
  Sparkles,
  FileText,
} from "lucide-react";
import { loadStats, getSubscribeUrls } from "@/lib/data";
import { StatsSection } from "@/components/stats-section";
import { ProtocolChart } from "@/components/protocol-chart";
import { SubscribeCard } from "@/components/subscribe-card";
import { FeatureCard } from "@/components/feature-card";
import { StepCard } from "@/components/step-card";
import { FaqSection } from "@/components/faq-section";
import { ProtocolSection } from "@/components/protocol-section";

const features = [
  {
    icon: RefreshCw,
    title: "每日自动更新",
    description: "GitHub Actions 每天 UTC 02:00 自动抓取、解析、校验并发布最新节点，无需手动维护。",
  },
  {
    icon: Layers,
    title: "多格式输出",
    description: "同时提供 Clash、V2Ray 与 HTTP/SOCKS5 三种订阅格式，覆盖主流客户端与使用场景。",
  },
  {
    icon: Globe,
    title: "双端镜像",
    description: "GitHub Raw 与 GitCode Raw 双端同步，不同网络环境下都能稳定访问订阅链接。",
  },
  {
    icon: Shield,
    title: "安全过滤",
    description: "内置 URL 白名单、私有 IP 过滤与基础连通性校验，降低误用内网或恶意节点的风险。",
  },
  {
    icon: Lock,
    title: "透明开源",
    description: "所有数据源、脚本与配置完全公开，社区可审计、可贡献、可替换。",
  },
  {
    icon: Users,
    title: "社区驱动",
    description: "通过 Issue 与 PR 持续补充新数据源、客户端教程与改进建议，共同维护节点池质量。",
  },
];

const steps = [
  {
    title: "选择客户端",
    description: "根据你的设备（Windows / macOS / Android / iOS）选择合适的代理客户端。",
  },
  {
    title: "复制订阅链接",
    description: "前往订阅中心，选择 Clash 或 V2Ray 格式，复制 GitHub 或 GitCode 镜像链接。",
  },
  {
    title: "导入并更新",
    description: "在客户端中粘贴订阅链接，点击更新，即可拉取当日最新节点列表。",
  },
  {
    title: "连接使用",
    description: "选择一个延迟较低的节点连接。免费节点稳定性有限，可次日等待自动更新。",
  },
];

const faqs = [
  {
    question: "ProxieHub 的节点从哪里来？",
    answer:
      "所有节点均来自互联网公开渠道（GitHub、公开订阅等）。本项目仅做聚合、解析与格式转换，不生产也不运营节点。",
  },
  {
    question: "订阅链接多久更新一次？",
    answer:
      "自动化流程每天 UTC 02:00（北京时间 10:00）运行一次，抓取最新数据源并更新产物文件。",
  },
  {
    question: "为什么有些节点无法连接？",
    answer:
      "免费公开节点时效性强，可能随时失效。流水线会做基础 TCP 连通性校验，但无法保证每个节点在每位用户网络下都可用。",
  },
  {
    question: "使用免费节点是否安全？",
    answer:
      "公开节点存在流量被查看、记录或篡改的风险。请仅用于学习研究，不要登录银行、支付、社交等敏感账户。",
  },
  {
    question: "如何贡献新的数据源？",
    answer:
      "编辑 config/sources.json 添加公开数据源，并提交 Pull Request。新源需为公开可访问、持续更新的链接。",
  },
];

export default function HomePage() {
  const stats = loadStats();
  const urls = getSubscribeUrls();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-glow),transparent_55%)]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Zap className="w-4 h-4" />
              每日自动更新 · 双端镜像 · 完全开源
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              免费公开代理 / VPN
              <br />
              <span className="gradient-text">节点聚合站</span>
            </h1>
            <p className="text-lg text-muted mb-8 leading-relaxed max-w-2xl mx-auto">
              ProxieHub 自动抓取、解析、校验互联网公开节点，输出 Clash、V2Ray、HTTP/SOCKS5
              三种订阅格式。仅供学习网络协议、安全测试和隐私技术研究使用。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-glow-sm"
              >
                获取订阅链接 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/sources"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border font-semibold hover:bg-surface-hover transition-all"
              >
                <Shield className="w-4 h-4" /> 查看数据源
              </Link>
            </div>
          </div>

          <StatsSection
            generatedAt={stats.generatedAt}
            totalNodes={stats.totalNodes}
            enabledSources={stats.enabledSources}
            totalSources={stats.totalSources}
          />
        </div>
      </section>

      {/* Subscribe Preview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">三种订阅格式</h2>
              <p className="text-muted mt-1">根据你使用的客户端选择合适的订阅链接</p>
            </div>
            <Link
              href="/subscribe"
              className="hidden sm:inline-flex items-center gap-1 text-primary hover:underline"
            >
              查看全部 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SubscribeCard
              title="Clash"
              description="Clash Verge / Clash Meta / Clash for Windows / Stash / Surge"
              githubUrl={urls.clash.github}
              gitcodeUrl={urls.clash.gitcode}
              icon={<Server className="w-6 h-6" />}
              color="blue"
            />
            <SubscribeCard
              title="V2Ray"
              description="v2rayN / v2rayNG / Shadowrocket / NekoBox / 其他 V2Ray 内核客户端"
              githubUrl={urls.v2ray.github}
              gitcodeUrl={urls.v2ray.gitcode}
              icon={<Globe className="w-6 h-6" />}
              color="purple"
            />
            <SubscribeCard
              title="HTTP / SOCKS5"
              description="浏览器扩展、爬虫、命令行工具使用的公开代理列表"
              githubUrl={urls.proxies.github}
              gitcodeUrl={urls.proxies.gitcode}
              icon={<Layers className="w-6 h-6" />}
              color="green"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-surface/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">为什么选择 ProxieHub</h2>
            <p className="text-muted">
              从数据源到产物输出，每个环节都围绕自动化、透明度与可扩展性设计。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">四步开始使用</h2>
              <p className="text-muted mb-8">无需注册，复制订阅链接即可导入你的客户端。</p>
              <div>
                {steps.map((s, index) => (
                  <StepCard key={s.title} step={index + 1} {...s} />
                ))}
              </div>
            </div>
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl bg-surface border border-border p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  每日自动更新流程
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { step: "1", title: "抓取", desc: "从公开源获取原始订阅" },
                    { step: "2", title: "解析", desc: "提取 VLESS/VMess/SS 等链接" },
                    { step: "3", title: "校验", desc: "轻量级连通性检测" },
                    { step: "4", title: "生成", desc: "输出 Clash/V2Ray/代理列表" },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="rounded-xl bg-background border border-border p-4 text-center"
                    >
                      <div className="w-8 h-8 mx-auto rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mb-2">
                        {item.step}
                      </div>
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-muted mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm text-muted">
                    <strong className="text-foreground">提示：</strong>
                    流水线默认不启用深度验证（避免对公开源造成过大压力）。可在本地通过{" "}
                    <code className="px-1 py-0.5 rounded bg-background text-primary font-mono text-xs">
                      python scripts/update.py --verify
                    </code>{" "}
                    开启连通性校验。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Chart */}
      <section className="py-16 bg-surface/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-surface border border-border p-6 h-full">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-primary" />
                  当前节点概览
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="rounded-xl bg-background border border-border p-4">
                    <div className="text-2xl font-bold">{stats.totalNodes}</div>
                    <div className="text-xs text-muted">可用节点</div>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-4">
                    <div className="text-2xl font-bold">{stats.enabledSources}</div>
                    <div className="text-xs text-muted">启用数据源</div>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-4">
                    <div className="text-2xl font-bold">
                      {Object.keys(stats.protocolCounts).length || 0}
                    </div>
                    <div className="text-xs text-muted">识别协议</div>
                  </div>
                  <div className="rounded-xl bg-background border border-border p-4">
                    <div className="text-2xl font-bold">{stats.generatedAt}</div>
                    <div className="text-xs text-muted">最近更新</div>
                  </div>
                </div>
                <p className="text-sm text-muted">
                  数据每日自动刷新，具体可用性受网络环境和数据源稳定性影响。
                </p>
              </div>
            </div>
            <div>
              <ProtocolChart counts={stats.protocolCounts} />
            </div>
          </div>
        </div>
      </section>

      {/* Protocols */}
      <ProtocolSection />

      {/* Data Transparency */}
      <section className="py-16 bg-surface/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                <Eye className="w-4 h-4" />
                数据透明
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                每个节点都来自公开渠道
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                ProxieHub 不生产、不运营任何节点。所有数据源均列在{" "}
                <Link href="/sources" className="text-primary hover:underline">
                  数据源页面
                </Link>
                ，包含更新频率、协议类型与来源说明。你可以随时审计、替换或贡献新的公开源。
              </p>
              <ul className="space-y-3">
                {[
                  "数据源配置完全公开（config/sources.json）",
                  "每日自动抓取并记录抓取结果",
                  "输出文件附带免责声明与生成时间",
                  "私有 IP 与本地地址默认被过滤",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-surface border border-border p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                自动化流水线
              </h3>
              <div className="space-y-4">
                {[
                  { title: "抓取", desc: "并发拉取所有启用数据源" },
                  { title: "解析", desc: "提取并去重 VLESS/VMess/SS/Trojan 链接" },
                  { title: "校验", desc: "可选 TCP 连通性与延迟检测" },
                  { title: "生成", desc: "输出 Clash / V2Ray / 代理列表" },
                  { title: "同步", desc: "自动推送 GitHub 与 GitCode 双端" },
                ].map((step, index) => (
                  <div key={step.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{step.title}</div>
                      <div className="text-sm text-muted">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community / Contribute */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">一起维护更好的节点池</h2>
            <p className="text-muted">
              这是一个社区驱动的开源项目，欢迎从多个维度参与贡献。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Globe,
                title: "补充数据源",
                desc: "发现新的公开订阅或代理 API，提交 PR 到 config/sources.json。",
              },
              {
                icon: FileText,
                title: "完善文档",
                desc: "补充客户端教程、故障排查或平台指南，帮助新手快速上手。",
              },
              {
                icon: Sparkles,
                title: "改进前端",
                desc: "优化 UI/UX、增加可视化或交互功能，让数据更直观。",
              },
              {
                icon: HeartHandshake,
                title: "反馈问题",
                desc: "报告失效数据源、安全顾虑或功能建议，推动项目持续迭代。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-surface border border-border p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/20"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="https://github.com/MS33834/ProxieHub/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-glow-sm"
            >
              阅读贡献指南 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-surface/30 border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">常见问题</h2>
            <p className="text-muted">关于数据源、更新频率、安全与贡献的常见问题解答。</p>
          </div>
          <FaqSection items={faqs} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-surface to-surface border border-primary/20 p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">准备好开始了吗？</h2>
            <p className="text-muted mb-8 max-w-xl mx-auto">
              选择适合你的客户端，复制订阅链接，即可导入每日更新的免费节点。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/clients"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all active:scale-[0.98] shadow-glow-sm"
              >
                查看客户端教程 <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border font-semibold hover:bg-surface-hover transition-all"
              >
                获取订阅链接
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
