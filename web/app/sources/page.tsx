import { loadStats } from "@/lib/data";
import { SourceTable } from "@/components/source-table";
import { ProtocolChart } from "@/components/protocol-chart";
import { Shield, Info, Database, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SourcesPage() {
  const stats = loadStats();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">数据源透明度</h1>
        <p className="text-sm text-muted max-w-2xl">
          ProxieHub 不生产节点，所有内容均来自以下公开数据源。我们尊重各源的 robots.txt 和服务条款。
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="border border-border bg-surface p-4">
          <Database className="w-4 h-4 text-muted mb-2" />
          <div className="text-xl font-semibold font-mono">{stats.totalSources}</div>
          <div className="text-[10px] text-muted">数据源总数</div>
        </div>
        <div className="border border-border bg-surface p-4">
          <CheckCircle2 className="w-4 h-4 text-success mb-2" />
          <div className="text-xl font-semibold font-mono">{stats.enabledSources}</div>
          <div className="text-[10px] text-muted">已启用源</div>
        </div>
        <div className="border border-border bg-surface p-4">
          <RefreshCw className="w-4 h-4 text-secondary mb-2" />
          <div className="text-xl font-semibold font-mono">
            {Object.keys(stats.protocolCounts).length || 0}
          </div>
          <div className="text-[10px] text-muted">识别协议</div>
        </div>
        <div className="border border-border bg-surface p-4">
          <Shield className="w-4 h-4 text-warning mb-2" />
          <div className="text-xl font-semibold font-mono">{stats.totalNodes}</div>
          <div className="text-[10px] text-muted">当前节点数</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SourceTable sources={stats.sources} />
        </div>
        <div className="space-y-4">
          <ProtocolChart counts={stats.protocolCounts} />
          <div className="border border-border bg-surface p-4">
            <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              数据说明
            </h3>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>· 已启用源每天 02:00 UTC 自动抓取。</li>
              <li>· 大文件源默认禁用，避免拖慢流水线。</li>
              <li>· 失效源可在 GitHub Issues 中报告。</li>
              <li>· 新增源需经过维护者审核后合并。</li>
              <li>· 协议分布基于当前 Clash 配置文件解析。</li>
            </ul>
          </div>
          <div className="border border-border bg-surface p-4">
            <h3 className="font-medium text-sm mb-3">更新频率图例</h3>
            <div className="space-y-1.5 text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-success" />
                <span>每小时 / 持续更新</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-warning" />
                <span>每 12 小时 / 每日</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-muted" />
                <span>未标注 / 低频</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-warning/20 bg-warning/10 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
        <div>
          <h3 className="font-medium text-warning text-sm mb-1">来源可信提示</h3>
          <p className="text-xs text-muted leading-relaxed">
            公开节点由第三方维护，其运营者可能查看、记录或篡改你的流量。我们仅做格式转换与聚合，无法验证每个节点的真实运营者。
            使用前请仔细阅读
            <a href="/disclaimer" className="text-primary hover:text-primary-hover ml-1">
              完整免责声明
            </a>
            。
          </p>
        </div>
      </div>
    </div>
  );
}
