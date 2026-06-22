import { Clock, Database, Globe, Server } from "lucide-react";

interface StatsSectionProps {
  generatedAt: string;
  totalNodes: number;
  enabledSources: number;
  totalSources: number;
}

export function StatsSection({
  generatedAt,
  totalNodes,
  enabledSources,
  totalSources,
}: StatsSectionProps) {
  const items = [
    { label: "节点总数", value: totalNodes, icon: Server },
    { label: "启用数据源", value: `${enabledSources}/${totalSources}`, icon: Database },
    { label: "覆盖协议", value: "4+", icon: Globe },
    { label: "最近更新", value: generatedAt, icon: Clock },
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl bg-surface border border-border p-5 flex items-center gap-4 animate-slide-up"
            >
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-sm text-muted">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
