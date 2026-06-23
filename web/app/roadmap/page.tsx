import {
  CheckCircle2,
  Loader2,
  CircleDashed,
  Calendar,
  Route,
  Target,
} from "lucide-react";

const phases = [
  {
    title: "短期",
    subtitle: "已完成 / 进行中",
    icon: CheckCircle2,
    items: [
      {
        label: "多格式输出",
        desc: "同时生成 Clash、V2Ray、HTTP/SOCKS5 三种订阅格式。",
        status: "已完成",
      },
      {
        label: "自动化流水线",
        desc: "GitHub Actions 每日 UTC 02:00 自动抓取、解析、校验并发布。",
        status: "已完成",
      },
      {
        label: "双仓库同步",
        desc: "主仓库与 GitCode 镜像同步更新，提升国内访问稳定性。",
        status: "已完成",
      },
      {
        label: "数据源透明化",
        desc: "在 /sources 页面公开所有数据源、协议与更新频率。",
        status: "进行中",
      },
      {
        label: "状态仪表盘",
        desc: "/status 页面展示节点数量、代理池数量与协议分布。",
        status: "进行中",
      },
    ],
  },
  {
    title: "中期",
    subtitle: "Q3 2026",
    icon: Calendar,
    items: [
      {
        label: "更精细的校验",
        desc: "引入延迟测试与协议级握手检测，提升可用节点比例。",
        status: "规划中",
      },
      {
        label: "区域与运营商标签",
        desc: "为节点补充国家、城市与运营商 ASN 信息，便于用户筛选。",
        status: "规划中",
      },
      {
        label: "数据源健康度评分",
        desc: "基于抓取成功率与节点可用率，给数据源打分并自动降级。",
        status: "规划中",
      },
      {
        label: "订阅分组与规则模板",
        desc: "为 Clash/Sing-box 输出内置分流规则模板。",
        status: "规划中",
      },
    ],
  },
  {
    title: "长期",
    subtitle: "2026+",
    icon: Target,
    items: [
      {
        label: "社区贡献门户",
        desc: "提供 Web 表单，降低提交新数据源与翻译文档的门槛。",
        status: "规划中",
      },
      {
        label: "历史节点存档",
        desc: "保留每日节点快照，支持回溯分析与长期稳定性研究。",
        status: "规划中",
      },
      {
        label: "API 与 RSS",
        desc: "提供 JSON API 与更新 RSS，方便第三方集成与监控。",
        status: "规划中",
      },
      {
        label: "多语言支持",
        desc: "在中文基础上逐步支持英文文档与页面。",
        status: "规划中",
      },
    ],
  },
];

const statusConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: typeof CheckCircle2 }
> = {
  已完成: {
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    icon: CheckCircle2,
  },
  进行中: {
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    icon: Loader2,
  },
  规划中: {
    color: "text-muted",
    bg: "bg-surface-hover",
    border: "border-border",
    icon: CircleDashed,
  },
};

export default function RoadmapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs text-muted font-mono mb-3">
          <Route className="w-3.5 h-3.5" />
          ROADMAP
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">项目路线图</h1>
        <p className="text-sm text-muted max-w-2xl">
          ProxieHub 的发展方向分为短期落地、中期优化与长期生态三个阶段。你可以通过
          <a
            href="https://github.com/MS33834/ProxieHub/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover mx-1"
          >
            GitHub Issues
          </a>
          对优先级提出建议。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {phases.map((phase) => {
          const PhaseIcon = phase.icon;
          return (
            <div key={phase.title} className="border border-border bg-surface p-5">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-border">
                <div className="p-2 border border-border text-primary">
                  <PhaseIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{phase.title}</h2>
                  <p className="text-xs text-muted">{phase.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                {phase.items.map((item) => {
                  const config = statusConfig[item.status];
                  const StatusIcon = config.icon;
                  return (
                    <div key={item.label} className="group">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className="text-sm font-medium group-hover:text-primary transition-colors">
                          {item.label}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 border shrink-0 ${config.color} ${config.bg} ${config.border}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 border border-border bg-surface p-5">
        <h2 className="font-medium text-sm mb-3">状态图例</h2>
        <div className="flex flex-wrap gap-4 text-xs text-muted">
          {Object.entries(statusConfig).map(([label, config]) => {
            const Icon = config.icon;
            return (
              <span
                key={label}
                className={`inline-flex items-center gap-1.5 px-2 py-1 border ${config.border} ${config.color} ${config.bg}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
