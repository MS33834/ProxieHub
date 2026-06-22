"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";

export function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-warning/10 border-b border-warning/20 text-warning px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            <strong>安全提示：</strong>
            本项目所有节点来自公开渠道，仅供学习研究。不保证可用性、安全性与隐私性。请勿在免费节点下登录敏感账户。
            <Link href="/disclaimer" className="underline ml-1 hover:text-foreground">
              查看完整免责声明
            </Link>
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1 hover:bg-warning/20 rounded"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
