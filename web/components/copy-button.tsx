"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "复制", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select the text for manual copying
      const selection = window.getSelection();
      if (selection) {
        selection.selectAllChildren(document.getElementById("copy-target") || document.body);
      }
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium border transition-colors ${
        copied
          ? "border-success/30 text-success bg-success/10"
          : "border-primary text-primary hover:bg-primary hover:text-background"
      } ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "已复制" : label}
    </button>
  );
}
