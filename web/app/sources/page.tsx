import { loadStats } from "@/lib/data";
import { SourceTable } from "@/components/source-table";
import { ProtocolChart } from "@/components/protocol-chart";
import Link from "next/link";
import {
  Shield,
  Info,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Clock,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="border border-border bg-surface p-5">
          <h3 className="font-medium text-sm mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            协议覆盖
          </h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(
              new Set(stats.sources.flatMap((s) => s.protocols || []))
            )
              .sort()
              .map((protocol) => (
                <span
                  key={protocol}
                  className="font-mono text-xs px-2 py-1 border border-border text-muted uppercase"
                >
                  {protocol}
                </span>
              ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            当前数据源声明覆盖 {new Set(stats.sources.flatMap((s) => s.protocols || [])).size} 种协议。
          </p>
        </div>

        <div className="border border-border bg-surface p-5">
          <h3 className="font-medium text-sm mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            更新频率分布
          </h3>
          <div className="space-y-2">
            {(() => {
              const distribution = stats.sources.reduce<Record<string, number>>(
                (acc, source) => {
                  const key = source.update_interval || "未标注";
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                },
                {}
              );
              const max = Math.max(...Object.values(distribution));
              return Object.entries(distribution)
                .sort(([, a], [, b]) => b - a)
                .map(([interval, count]) => (
                  <div key={interval} className="flex items-center gap-3 text-xs">
                    <span className="w-20 shrink-0 text-muted">{interval}</span>
                    <div className="flex-1 h-2 bg-background border border-border overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(count / max) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono">{count}</span>
                  </div>
                ));
            })()}
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="border border-border bg-surface p-5">
          <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-primary" />
            缺少你想要的源？
          </h3>
          <p className="text-xs text-muted leading-relaxed mb-4">
            如果你知道其他公开、持续更新的节点或代理源，欢迎通过 Issue 模板提交。审核通过后会加入每日自动抓取列表。
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-2">
            <a
              href="https://github.com/MS33834/ProxieHub/issues/new?template=source_report.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-background text-xs font-medium hover:bg-primary-hover transition-colors"
            >
              提交新数据源 <ExternalLink className="w-3 h-3" />
            </a>
            <Link
                href="/sources/guide"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-medium hover:bg-surface-hover transition-colors"
              >
                查看贡献指南
              </Link>
          </div>
        </div>
        <div className="border border-border bg-surface p-5">
          <h3 className="font-medium text-sm mb-2 flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            数据源质量说明
          </h3>
          <ul className="space-y-1.5 text-xs text-muted">
            <li>· 所有源默认每 24 小时抓取一次（部分高频率源每小时或每 5 分钟）。</li>
            <li>· 大文件源默认禁用，避免拖慢 CI；需要时可手动启用。</li>
            <li>· 节点经过去重、私有 IP 过滤，部分工作流还会进行连通性验证。</li>
            <li>· 公开源可能随时失效，数量波动属于正常现象。</li>
          </ul>
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
