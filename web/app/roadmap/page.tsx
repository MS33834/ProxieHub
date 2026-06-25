import type { Metadata } from "next";
import {
  CheckCircle2,
  Loader2,
  CircleDashed,
  Calendar,
  Route,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "项目路线图 — ProxieHub",
  description:
    "ProxieHub 的短期、中期与长期规划，涵盖稳定性、验证策略、地区分组、JSON API 与社区建设。",
};

const phases = [
  {
    title: "短期",
    subtitle: "稳定性与数据源",
    icon: CheckCircle2,
    items: [
      {
        label: "监控失效数据源",
        desc: "持续清理抓取失败、更新停滞或质量明显下降的公开源。",
        status: "进行中",
      },
      {
        label: "优化校验器性能",
        desc: "调整 verifier.py 的并发与超时策略，降低 CI 运行耗时。",
        status: "进行中",
      },
      {
        label: "完善测试覆盖",
        desc: "补充更多协议解析与边界场景的单元测试。",
        status: "进行中",
      },
    ],
  },
  {
    title: "中期",
    subtitle: "验证策略与地区分组",
    icon: Calendar,
    items: [
      {
        label: "节点质量评分",
        desc: "引入延迟、丢包与协议支持度指标，按质量排序输出。",
        status: "规划中",
      },
      {
        label: "地区识别与拆分",
        desc: "默认开启轻量 GeoIP 分组，按国家/地区生成独立订阅文件。",
        status: "规划中",
      },
      {
        label: "自定义过滤规则",
        desc: "支持按协议、地区、延迟上限等条件筛选输出节点。",
        status: "规划中",
      },
    ],
  },
  {
    title: "长期",
    subtitle: "API 与社区",
    icon: Target,
    items: [
      {
        label: "JSON API",
        desc: "基于每日生成的 nodes/ 产物提供稳定 API，方便第三方客户端拉取。",
        status: "规划中",
      },
      {
        label: "数据源反馈机制",
        desc: "通过 Issue 模板与运行状态数据，标记高质量或已失效的数据源。",
        status: "规划中",
      },
      {
        label: "英文文档",
        desc: "在中文文档稳定后，逐步补充核心页面的英文版本。",
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
          ProxieHub 的发展方向分为短期落地、中期优化与长期规划三个阶段。你可以通过
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
