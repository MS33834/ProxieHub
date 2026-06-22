import { loadStats } from "@/lib/data";
import { SourceTable } from "@/components/source-table";
import { ProtocolChart } from "@/components/protocol-chart";
import { Shield, Info, Database, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SourcesPage() {
  const stats = loadStats();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">数据源透明度</h1>
        <p className="text-muted">
          ProxieHub 不生产节点，所有内容均来自以下公开数据源。我们尊重各源的 robots.txt 和服务条款。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="rounded-2xl bg-surface border border-border p-5">
          <Database className="w-5 h-5 text-primary mb-2" />
          <div className="text-2xl font-bold">{stats.totalSources}</div>
          <div className="text-xs text-muted">数据源总数</div>
        </div>
        <div className="rounded-2xl bg-surface border border-border p-5">
          <CheckCircle2 className="w-5 h-5 text-success mb-2" />
          <div className="text-2xl font-bold">{stats.enabledSources}</div>
          <div className="text-xs text-muted">已启用源</div>
        </div>
        <div className="rounded-2xl bg-surface border border-border p-5">
          <RefreshCw className="w-5 h-5 text-secondary mb-2" />
          <div className="text-2xl font-bold">{Object.keys(stats.protocolCounts).length || 0}</div>
          <div className="text-xs text-muted">识别协议</div>
        </div>
        <div className="rounded-2xl bg-surface border border-border p-5">
          <Shield className="w-5 h-5 text-warning mb-2" />
          <div className="text-2xl font-bold">{stats.totalNodes}</div>
          <div className="text-xs text-muted">当前节点数</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <SourceTable sources={stats.sources} />
        </div>
        <div className="space-y-6">
          <ProtocolChart counts={stats.protocolCounts} />
          <div className="rounded-2xl bg-surface border border-border p-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              数据说明
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>• 已启用源每天 02:00 UTC 自动抓取。</li>
              <li>• 大文件源默认禁用，避免拖慢流水线。</li>
              <li>• 失效源可在 GitHub Issues 中报告。</li>
              <li>• 新增源需经过维护者审核后合并。</li>
              <li>• 协议分布基于当前 Clash 配置文件解析。</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-surface border border-border p-6">
            <h3 className="font-bold text-lg mb-3">更新频率图例</h3>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>每小时 / 持续更新</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span>每 12 小时 / 每日</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-muted" />
                <span>未标注 / 低频</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-warning/10 border border-warning/20 p-6 flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
        <div>
          <h3 className="font-bold text-warning mb-1">来源可信提示</h3>
          <p className="text-sm text-muted">
            公开节点由第三方维护，其运营者可能查看、记录或篡改你的流量。我们仅做格式转换与聚合，无法验证每个节点的真实运营者。
            使用前请仔细阅读
            <a href="/disclaimer" className="text-primary hover:underline ml-1">
              完整免责声明
            </a>
            。
          </p>
        </div>
      </div>
    </div>
  );
}
