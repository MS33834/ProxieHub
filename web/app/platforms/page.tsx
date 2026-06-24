"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Star,
  ExternalLink,
  Filter,
  Sparkles,
  Clock,
  ArrowRight,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { platforms, type Platform } from "@/lib/platforms";

const protocolFilters = [
  { label: "全部", value: "all" },
  { label: "V2Ray", value: "V2Ray" },
  { label: "Clash", value: "Clash" },
  { label: "SS", value: "SS" },
  { label: "Trojan", value: "Trojan" },
  { label: "HTTP代理", value: "HTTP代理" },
] as const;

const formatFilters = [
  { label: "全部格式", value: "all" },
  { label: "Clash", value: "Clash" },
  { label: "V2Ray", value: "V2Ray" },
  { label: "Base64", value: "Base64" },
  { label: "Sing-box", value: "Sing-box" },
  { label: "HTTP代理", value: "HTTP代理" },
  { label: "JSON", value: "JSON" },
] as const;

type ProtocolValue = (typeof protocolFilters)[number]["value"];
type FormatValue = (typeof formatFilters)[number]["value"];

function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <div className="group flex flex-col border border-border bg-surface p-5 transition-colors hover:border-primary/30">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <a
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-base font-semibold group-hover:text-primary transition-colors"
          >
            <span className="truncate">{platform.name}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted group-hover:text-primary" />
          </a>
          <p className="text-xs text-muted font-mono mt-0.5 truncate">
            {platform.owner}/{platform.name}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {platform.featured && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 border border-primary/30 bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3" />
              推荐
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 border border-border text-muted">
            <Star className="w-3 h-3 text-primary" />
            {platform.stars}
          </span>
        </div>
      </div>

      <p className="text-xs text-muted leading-relaxed mb-4 flex-1">
        {platform.description}
      </p>

      <div className="space-y-3">
        <div>
          <p className="text-[10px] text-muted mb-1.5">支持协议</p>
          <div className="flex flex-wrap gap-1">
            {platform.protocols.map((p) => (
              <span
                key={p}
                className="font-mono text-[10px] px-1.5 py-0.5 border border-border text-muted uppercase"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] text-muted mb-1.5">输出格式</p>
          <div className="flex flex-wrap gap-1">
            {platform.format.map((f) => (
              <span
                key={f}
                className="font-mono text-[10px] px-1.5 py-0.5 border border-primary/20 bg-primary/5 text-primary"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted pt-2 border-t border-border">
          <Clock className="w-3 h-3" />
          <span>更新频率：</span>
          <span className="text-foreground font-medium">{platform.updateFrequency}</span>
        </div>
      </div>
    </div>
  );
}

export default function PlatformsPage() {
  const [protocolFilter, setProtocolFilter] = useState<ProtocolValue>("all");
  const [formatFilter, setFormatFilter] = useState<FormatValue>("all");

  const filtered = useMemo(() => {
    return platforms.filter((p) => {
      const protocolMatch =
        protocolFilter === "all" ||
        p.protocols.includes(protocolFilter) ||
        p.format.includes(protocolFilter);
      const formatMatch =
        formatFilter === "all" || p.format.includes(formatFilter);
      return protocolMatch && formatMatch;
    });
  }, [protocolFilter, formatFilter]);

  const featuredCount = platforms.filter((p) => p.featured).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs text-muted font-mono mb-3">
          <Shield className="w-3.5 h-3.5 text-primary" />
          PLATFORM INDEX
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">平台索引</h1>
        <p className="text-sm text-muted max-w-2xl leading-relaxed">
          收集 GitHub 上知名的 VPN / 代理节点分享仓库，提供简介、协议与输出格式信息，方便你按需选择订阅源。
          所有仓库均由第三方维护，使用前请阅读各仓库的免责声明。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="border border-border bg-surface p-4">
          <Sparkles className="w-4 h-4 text-primary mb-2" />
          <div className="text-xl font-semibold font-mono">{platforms.length}</div>
          <div className="text-[10px] text-muted">收录仓库</div>
        </div>
        <div className="border border-border bg-surface p-4">
          <Star className="w-4 h-4 text-primary mb-2" />
          <div className="text-xl font-semibold font-mono">{featuredCount}</div>
          <div className="text-[10px] text-muted">推荐仓库</div>
        </div>
        <div className="border border-border bg-surface p-4">
          <Clock className="w-4 h-4 text-secondary mb-2" />
          <div className="text-xl font-semibold font-mono">每日</div>
          <div className="text-[10px] text-muted">主流更新频率</div>
        </div>
        <div className="border border-border bg-surface p-4">
          <Filter className="w-4 h-4 text-warning mb-2" />
          <div className="text-xl font-semibold font-mono">
            {Array.from(new Set(platforms.flatMap((p) => p.protocols))).length}
          </div>
          <div className="text-[10px] text-muted">覆盖协议</div>
        </div>
      </div>

      {/* Filters */}
      <div className="border border-border bg-surface p-4 mb-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs text-muted mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              按协议筛选
            </p>
            <div className="flex flex-wrap gap-1.5">
              {protocolFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setProtocolFilter(f.value)}
                  className={`px-2.5 py-1 text-xs transition-colors border ${
                    protocolFilter === f.value
                      ? "bg-primary text-background border-primary"
                      : "border-border text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted mb-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              按格式筛选
            </p>
            <div className="flex flex-wrap gap-1.5">
              {formatFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFormatFilter(f.value)}
                  className={`px-2.5 py-1 text-xs transition-colors border ${
                    formatFilter === f.value
                      ? "bg-primary text-background border-primary"
                      : "border-border text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-muted">
          共 <span className="text-foreground font-medium">{filtered.length}</span> 个仓库
          {protocolFilter !== "all" && ` · 协议：${protocolFilter}`}
          {formatFilter !== "all" && ` · 格式：${formatFilter}`}
        </p>
        {(protocolFilter !== "all" || formatFilter !== "all") && (
          <button
            onClick={() => {
              setProtocolFilter("all");
              setFormatFilter("all");
            }}
            className="text-xs text-primary hover:text-primary-hover"
          >
            重置筛选
          </button>
        )}
      </div>

      {/* Platform grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filtered.map((platform) => (
            <PlatformCard key={`${platform.owner}/${platform.name}`} platform={platform} />
          ))}
        </div>
      ) : (
        <div className="border border-border bg-surface p-10 text-center mb-12">
          <p className="text-sm text-muted">没有符合筛选条件的仓库</p>
          <button
            onClick={() => {
              setProtocolFilter("all");
              setFormatFilter("all");
            }}
            className="mt-3 text-xs text-primary hover:text-primary-hover"
          >
            重置筛选
          </button>
        </div>
      )}

      {/* Usage guide */}
      <section className="border border-border bg-surface p-6 md:p-8 mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          如何使用这些平台
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            {
              step: "1",
              title: "选择平台",
              desc: "根据你需要的协议与输出格式，从上方选择合适的仓库，点击仓库名跳转 GitHub。",
            },
            {
              step: "2",
              title: "获取订阅链接",
              desc: "在仓库 README 中找到 raw 订阅链接（通常为 Clash / V2Ray / Base64 格式）。",
            },
            {
              step: "3",
              title: "导入客户端",
              desc: "将订阅链接粘贴到 v2rayN、Clash Verge 等客户端，更新后即可拉取节点列表。",
            },
          ].map((item) => (
            <div key={item.step} className="border border-border bg-background p-4">
              <div className="w-6 h-6 border border-primary text-primary text-xs font-medium flex items-center justify-center mb-3">
                {item.step}
              </div>
              <h3 className="text-sm font-medium mb-1">{item.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="border border-warning/20 bg-warning/10 p-4 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
          <div>
            <h3 className="font-medium text-warning text-sm mb-1">安全提示</h3>
            <p className="text-xs text-muted leading-relaxed">
              公开节点由第三方维护，运营者可能查看、记录或篡改你的流量。请仅用于学习网络协议与隐私研究，
              不要登录银行、支付、社交等敏感账户。完整说明请阅读
              <Link href="/disclaimer" className="text-primary hover:text-primary-hover ml-1">
                免责声明
              </Link>
              。
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-3">
          <Link
            href="/subscribe"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-background text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            返回订阅页面 <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/clients"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-background text-sm font-medium hover:bg-surface-hover transition-colors"
          >
            查看客户端教程
          </Link>
        </div>
      </section>
    </div>
  );
}
