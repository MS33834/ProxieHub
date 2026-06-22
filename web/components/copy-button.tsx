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
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all active:scale-[0.98] ${
        copied
          ? "bg-success/20 text-success border border-success/30"
          : "bg-primary text-white hover:bg-primary/90"
      } ${className}`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "已复制" : label}
    </button>
  );
}
