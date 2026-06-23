import Link from "next/link";
import {
  Users,
  MessageSquare,
  GitPullRequest,
  Heart,
  Award,
  Code2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

const channels = [
  {
    icon: MessageSquare,
    title: "GitHub Issues",
    description: "报告 Bug、提交数据源、反馈页面问题或提出功能建议。所有公开讨论都在这里进行。",
    href: "https://github.com/MS33834/ProxieHub/issues",
    action: "打开 Issues",
  },
  {
    icon: GitPullRequest,
    title: "Pull Requests",
    description: "无论是修复代码、补充文档还是新增数据源，都欢迎通过 PR 参与。我们会尽快 Review。",
    href: "https://github.com/MS33834/ProxieHub/pulls",
    action: "查看 PRs",
  },
  {
    icon: Code2,
    title: "GitCode 镜像",
    description: "国内访问较慢时，可通过 GitCode 镜像获取最新代码、提交 Issue 与查看文档。",
    href: "https://gitcode.com/badhope/ProxieHub",
    action: "访问镜像",
  },
];

const contributors = [
  { role: "维护者", name: "MS33834", desc: "项目发起人与主要维护者" },
  { role: "贡献者", name: "社区贡献者", desc: "数据源、代码、文档的持续贡献者" },
  { role: "审阅者", name: "代码审阅者", desc: "对代码与文档进行质量把关" },
];

const recognitions = [
  "发现并报告关键 Bug 的用户",
  "持续提交高质量数据源建议的贡献者",
  "补充文档、翻译与教程的社区成员",
  "参与 Issue 讨论、帮助他人的活跃用户",
];

export default function CommunityPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs text-muted font-mono mb-3">
          <Users className="w-3.5 h-3.5" />
          COMMUNITY
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">社区与贡献</h1>
        <p className="text-sm text-muted max-w-2xl">
          ProxieHub 由社区驱动。你的反馈、贡献与传播都会让项目更完善、更透明。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {channels.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.title} className="border border-border bg-surface p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 border border-border text-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="font-medium text-sm">{c.title}</h2>
              </div>
              <p className="text-xs text-muted leading-relaxed mb-4 flex-1">{c.description}</p>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover"
              >
                {c.action} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="border border-border bg-surface p-5">
          <h2 className="font-medium text-base mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            贡献方式
          </h2>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">·</span>
              <span>
                发现新的公开数据源？使用{" "}
                <a
                  href="https://github.com/MS33834/ProxieHub/issues/new?template=source_report.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-hover"
                >
                  数据源报告模板
                </a>{" "}
                提交。
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">·</span>
              <span>改进爬虫、解析器、校验器或前端代码，提交 Pull Request。</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">·</span>
              <span>补充文档、FAQ、客户端教程或翻译，降低新用户门槛。</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">·</span>
              <span>在 Issue 中帮助他人排查问题，参与路线图的公开讨论。</span>
            </li>
          </ul>
          <div className="mt-5">
            <Link
              href="/contribute"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              查看贡献指南 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="border border-border bg-surface p-5">
          <h2 className="font-medium text-base mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            贡献者角色
          </h2>
          <div className="space-y-3">
            {contributors.map((c) => (
              <div key={c.name} className="flex items-start gap-3 text-sm">
                <span className="inline-block px-1.5 py-0.5 border border-border text-[10px] text-muted shrink-0">
                  {c.role}
                </span>
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted">{c.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <h3 className="text-xs font-medium mb-2 text-foreground">特别感谢</h3>
            <ul className="space-y-1.5 text-xs text-muted">
              {recognitions.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">·</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold mb-3">行为准则</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          参与 ProxieHub 社区时，请尊重他人、保持建设性、遵守法律法规。这里倡导开放、友好、专业的交流氛围。
        </p>
        <a
          href="https://github.com/MS33834/ProxieHub/blob/main/CODE_OF_CONDUCT.md"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover"
        >
          阅读 CODE_OF_CONDUCT.md <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
