interface ProtocolChartProps {
  counts: Record<string, number>;
}

const protocolColors: Record<string, string> = {
  vless: "#3b82f6",
  vmess: "#8b5cf6",
  trojan: "#f97316",
  ss: "#10b981",
  ssr: "#06b6d4",
  http: "#6b7280",
  https: "#9ca3af",
  socks4: "#4b5563",
  socks5: "#374151",
};

export function ProtocolChart({ counts }: ProtocolChartProps) {
  const entries = Object.entries(counts).filter(([, v]) => v > 0);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (total === 0) {
    return (
      <div className="rounded-2xl bg-surface border border-border p-6 text-center text-muted">
        暂无节点数据
      </div>
    );
  }

  let cumulative = 0;

  return (
    <div className="rounded-2xl bg-surface border border-border p-6">
      <h3 className="font-bold text-lg mb-6">协议分布</h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-40 h-40 shrink-0">
          <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
            {entries.map(([protocol, count]) => {
              const dash = (count / total) * 100;
              const offset = cumulative;
              cumulative += dash;
              return (
                <circle
                  key={protocol}
                  r="15.9"
                  cx="16"
                  cy="16"
                  fill="transparent"
                  stroke={protocolColors[protocol.toLowerCase()] || "#6b7280"}
                  strokeWidth="4"
                  strokeDasharray={`${dash} ${100 - dash}`}
                  strokeDashoffset={-offset}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted">节点</span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="space-y-3">
            {entries.map(([protocol, count]) => (
              <div key={protocol} className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: protocolColors[protocol.toLowerCase()] || "#6b7280" }}
                />
                <span className="flex-1 text-sm capitalize">{protocol.toUpperCase()}</span>
                <span className="text-sm font-medium mr-1">{count}</span>
                <span className="text-xs text-muted w-12 text-right">
                  {((count / total) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
