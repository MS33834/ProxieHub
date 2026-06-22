"use client";

import { useState } from "react";
import { Check, ExternalLink, X, Filter } from "lucide-react";

interface Source {
  name: string;
  type: string;
  url: string;
  enabled: boolean;
  decode_base64?: boolean;
  note?: string;
  update_interval?: string;
  protocols?: string[];
  reliability?: "high" | "medium" | "low";
}

interface SourceTableProps {
  sources: Source[];
}

export function SourceTable({ sources }: SourceTableProps) {
  const [filter, setFilter] = useState<"all" | "enabled" | "disabled">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | string>("all");

  const types = Array.from(new Set(sources.map((s) => s.type)));

  const filtered = sources.filter((s) => {
    if (filter === "enabled") return s.enabled;
    if (filter === "disabled") return !s.enabled;
    return true;
  }).filter((s) => {
    if (typeFilter === "all") return true;
    return s.type === typeFilter;
  });

  return (
    <div className="rounded-2xl bg-surface border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            数据源列表
          </h3>
          <p className="text-xs text-muted mt-0.5">
            共 {sources.length} 个源，已启用 {sources.filter((s) => s.enabled).length} 个
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-lg bg-background border border-border p-1">
            {(["all", "enabled", "disabled"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  filter === key ? "bg-surface-hover text-foreground" : "text-muted"
                }`}
              >
                {key === "all" ? "全部" : key === "enabled" ? "已启用" : "已禁用"}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg bg-background border border-border px-3 py-1.5 text-sm text-muted focus:outline-none focus:border-primary"
          >
            <option value="all">所有类型</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-background text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">状态</th>
              <th className="px-4 py-3 font-medium">名称</th>
              <th className="px-4 py-3 font-medium">类型</th>
              <th className="px-4 py-3 font-medium">更新频率</th>
              <th className="px-4 py-3 font-medium">协议</th>
              <th className="px-4 py-3 font-medium">说明</th>
              <th className="px-4 py-3 font-medium">链接</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((source) => (
              <tr key={source.name} className="hover:bg-surface-hover/50 transition-colors">
                <td className="px-4 py-3">
                  {source.enabled ? (
                    <span className="inline-flex items-center gap-1 text-success text-xs font-medium px-2 py-1 rounded-full bg-success/10">
                      <Check className="w-3 h-3" /> 启用
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-muted text-xs font-medium px-2 py-1 rounded-full bg-muted/10">
                      <X className="w-3 h-3" /> 禁用
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium">{source.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 rounded-md bg-background border border-border">
                    {source.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {source.update_interval || "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(source.protocols || []).slice(0, 3).map((p) => (
                      <span
                        key={p}
                        className="text-xs px-1.5 py-0.5 rounded bg-background border border-border text-muted"
                      >
                        {p.toUpperCase()}
                      </span>
                    ))}
                    {(source.protocols || []).length > 3 && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-background border border-border text-muted">
                        +{(source.protocols || []).length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted max-w-xs">
                  <div className="truncate" title={source.note}>
                    {source.note || "—"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    查看 <ExternalLink className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="p-8 text-center text-muted text-sm">
          没有符合条件的数据源
        </div>
      )}
    </div>
  );
}
