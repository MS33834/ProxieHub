"use client";

import { useState } from "react";
import { CopyButton } from "./copy-button";

interface SubscribeCardProps {
  title: string;
  description: string;
  githubUrl: string;
  gitcodeUrl: string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green";
}

const colorMap = {
  blue: "from-primary/20 to-primary/5 border-primary/20",
  purple: "from-secondary/20 to-secondary/5 border-secondary/20",
  green: "from-success/20 to-success/5 border-success/20",
};

export function SubscribeCard({
  title,
  description,
  githubUrl,
  gitcodeUrl,
  icon,
  color,
}: SubscribeCardProps) {
  const [mirror, setMirror] = useState<"github" | "gitcode">("github");
  const url = mirror === "github" ? githubUrl : gitcodeUrl;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${colorMap[color]} border card-border transition-all hover:-translate-y-1 hover:glow`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-surface border border-border">{icon}</div>
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-muted text-sm">{description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex rounded-lg bg-background border border-border p-1">
          <button
            onClick={() => setMirror("github")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mirror === "github" ? "bg-surface-hover text-foreground" : "text-muted"
            }`}
          >
            GitHub
          </button>
          <button
            onClick={() => setMirror("gitcode")}
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
              mirror === "gitcode" ? "bg-surface-hover text-foreground" : "text-muted"
            }`}
          >
            GitCode
          </button>
        </div>

        <div className="relative">
          <input
            readOnly
            value={url}
            className="w-full bg-surface border border-border rounded-lg px-4 py-3 pr-24 text-sm font-mono text-foreground truncate focus:outline-none focus:border-primary"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <CopyButton text={url} className="py-1.5 px-3 text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
