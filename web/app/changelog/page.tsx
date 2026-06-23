import { parseChangelog } from "@/lib/data";
import {
  Clock,
  Tag,
  Plus,
  Wrench,
  Bug,
  Sparkles,
  FileText,
} from "lucide-react";

const categoryConfig: Record<
  string,
  { label: string; icon: typeof Plus; color: string; bg: string; border: string }
> = {
  Added: { label: "新增", icon: Plus, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  新增: { label: "新增", icon: Plus, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  Improved: { label: "优化", icon: Sparkles, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  改进: { label: "优化", icon: Sparkles, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  优化: { label: "优化", icon: Sparkles, color: "text-secondary", bg: "bg-secondary/10", border: "border-secondary/20" },
  Fixed: { label: "修复", icon: Bug, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
  修复: { label: "修复", icon: Bug, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
};

function getCategoryStyle(name: string) {
  return (
    categoryConfig[name] || {
      label: name,
      icon: Wrench,
      color: "text-muted",
      bg: "bg-surface-hover",
      border: "border-border",
    }
  );
}

export default function ChangelogPage() {
  const entries = parseChangelog();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 text-xs text-muted font-mono mb-3">
          <FileText className="w-3.5 h-3.5" />
          CHANGELOG
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">更新日志</h1>
        <p className="text-sm text-muted max-w-2xl">
          记录 ProxieHub 每个版本的重要变更。也可在 GitHub 上查看{" "}
          <a
            href="https://github.com/MS33834/ProxieHub/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover"
          >
            CHANGELOG.md
          </a>
          。
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="border border-border bg-surface p-8 text-center text-sm text-muted">
          暂无更新日志
        </div>
      ) : (
        <div className="space-y-8">
          {entries.map((entry) => (
            <div
              key={entry.version}
              className="border border-border bg-surface p-5 md:p-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 border border-border text-primary">
                    <Tag className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-semibold font-mono">
                    {entry.version}
                  </h2>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {entry.date}
                </div>
              </div>

              <div className="space-y-5">
                {Object.entries(entry.categories).map(([category, items]) => {
                  const style = getCategoryStyle(category);
                  const Icon = style.icon;
                  return (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 border ${style.color} ${style.bg} ${style.border}`}
                        >
                          <Icon className="w-3 h-3" />
                          {style.label}
                        </span>
                        <span className="text-xs text-muted">
                          {items.length} 项
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {items.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-muted leading-relaxed"
                          >
                            <span className="text-primary mt-1.5">·</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
