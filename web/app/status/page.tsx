import { loadStatusStats } from "@/lib/data";
import { ProtocolChart } from "@/components/protocol-chart";
import {
  Clock,
  Server,
  Database,
  Globe,
  Activity,
  Workflow,
  Shield,
  Zap,
  MapPin,
} from "lucide-react";

export default function StatusPage() {
  const stats = loadStatusStats();
  const protocolTotal = Object.values(stats.protocolCounts).reduce(
    (sum, v) => sum + v,
    0
  );

  const regionEntries = Object.entries(stats.regions)
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);
  const maxRegionCount = Math.max(
    ...regionEntries.map(([, count]) => count),
    1
  );

  const cards = [
    {
      label: "最后更新时间",
      value: stats.lastUpdated,
      icon: Clock,
      hint: "基于 nodes/clash.yaml 文件修改时间",
    },
    {
      label: "当前节点总数",
      value: stats.nodeCount.toString(),
      icon: Server,
      hint: "MAX_NODES 限制后的 Clash 节点数量",
    },
    {
      label: "代理池数量",
      value: stats.proxyCount.toString(),
      icon: Globe,
      hint: "nodes/proxies.txt 中的公开代理数量",
    },
    {
      label: "启用数据源",
      value: `${stats.enabledSources}/${stats.totalSources}`,
      icon: Database,
      hint: "config/sources.json 中 enabled=true 的源",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs text-muted font-mono mb-3">
          <Activity className="w-3.5 h-3.5" />
          STATUS
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">运行状态</h1>
        <p className="text-sm text-muted max-w-2xl">
          以下数据在构建时从静态文件读取，反映最近一次成功生成后的状态。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="border border-border bg-surface p-4">
              <Icon className="w-4 h-4 text-muted mb-3" />
              <div className="text-xl font-semibold font-mono mb-0.5">
                {card.value}
              </div>
              <div className="text-xs text-muted">{card.label}</div>
              <div className="mt-2 text-[10px] text-muted leading-relaxed">
                {card.hint}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProtocolChart counts={stats.protocolCounts} />
        </div>
        <div className="space-y-4">
          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <Workflow className="w-4 h-4 text-primary" />
              <h2 className="font-medium text-sm">GitHub Actions</h2>
            </div>
            <div className="text-xs text-muted leading-relaxed mb-3">
              {stats.actionsStatus}
            </div>
            <div className="flex items-center gap-2 text-xs text-success">
              <span className="w-2 h-2 bg-success" />
              定时任务已启用
            </div>
          </div>

          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" />
              <h2 className="font-medium text-sm">验证说明</h2>
            </div>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>· CI 每日默认启用 TCP 连通性校验。</li>
              <li>· 本地可运行 --verify 获得更严格筛选。</li>
              <li>· 节点可用性受用户网络环境影响。</li>
            </ul>
          </div>

          <div className="border border-border bg-surface p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="font-medium text-sm">协议覆盖</h2>
            </div>
            <div className="text-2xl font-semibold font-mono mb-1">
              {Object.keys(stats.protocolCounts).length}
            </div>
            <div className="text-[10px] text-muted">
              已识别协议 / {protocolTotal} 个已分类节点
            </div>
          </div>
        </div>
      </div>

      <div className="border border-border bg-surface p-5 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <h2 className="font-medium text-sm">节点地区分布</h2>
        </div>
        {regionEntries.length === 0 ? (
          <p className="text-xs text-muted">
            地区数据暂未生成，可在本地启用 PROXIEHUB_GEO_ENABLED=true 生成
          </p>
        ) : (
          <div className="space-y-2">
            {regionEntries.map(([region, count]) => (
              <div key={region} className="flex items-center gap-3 text-xs">
                <span className="w-24 shrink-0 text-muted font-mono uppercase">
                  {region}
                </span>
                <div className="flex-1 h-2 bg-background border border-border overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(count / maxRegionCount) * 100}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border border-warning/20 bg-warning/10 p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-warning shrink-0" />
        <div>
          <h3 className="font-medium text-warning text-sm mb-1">状态说明</h3>
          <p className="text-xs text-muted leading-relaxed">
            本页面为静态生成，展示的是构建时刻的快照。实际节点可用性会随时间变化，建议每日重新导入订阅或等待 GitHub Actions 自动更新。
          </p>
        </div>
      </div>
    </div>
  );
}
