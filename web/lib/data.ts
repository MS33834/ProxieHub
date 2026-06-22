import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(process.cwd(), "..");
const NODES_DIR = path.join(PROJECT_ROOT, "nodes");
const CONFIG_PATH = path.join(PROJECT_ROOT, "config", "sources.json");

export interface SourceConfig {
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

export interface SiteStats {
  generatedAt: string;
  totalNodes: number;
  protocolCounts: Record<string, number>;
  sources: SourceConfig[];
  enabledSources: number;
  totalSources: number;
}

function parseClashYaml(filePath: string): { total: number; protocols: Record<string, number> } {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split("\n");
  let inProxies = false;
  let depth = 0;
  const protocols: Record<string, number> = {};
  let currentType: string | null = null;
  let total = 0;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r/g, "");
    if (line.startsWith("proxies:")) {
      inProxies = true;
      depth = 0;
      continue;
    }
    if (!inProxies) continue;

    const leading = line.match(/^(\s*)/)?.[1].length || 0;

    if (line.trim().startsWith("- name:")) {
      if (currentType) {
        protocols[currentType] = (protocols[currentType] || 0) + 1;
      }
      currentType = null;
      depth = leading;
      total++;
      continue;
    }

    if (total > 0 && leading > depth && line.trim().startsWith("type:")) {
      currentType = line.trim().replace("type:", "").trim();
    }
  }

  if (currentType) {
    protocols[currentType] = (protocols[currentType] || 0) + 1;
  }

  return { total, protocols };
}

export function loadStats(): SiteStats {
  const clashPath = path.join(NODES_DIR, "clash.yaml");
  let totalNodes = 0;
  let protocolCounts: Record<string, number> = {};

  if (fs.existsSync(clashPath)) {
    const parsed = parseClashYaml(clashPath);
    totalNodes = parsed.total;
    protocolCounts = parsed.protocols;
  }

  let sources: SourceConfig[] = [];
  if (fs.existsSync(CONFIG_PATH)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    sources = [
      ...(config.free_node_sources || []),
      ...(config.free_proxy_apis || []),
    ];
  }

  const enabledSources = sources.filter((s) => s.enabled).length;

  let generatedAt = "Unknown";
  try {
    const stat = fs.statSync(clashPath);
    generatedAt = new Date(stat.mtime).toLocaleString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    // ignore
  }

  return {
    generatedAt,
    totalNodes,
    protocolCounts,
    sources,
    enabledSources,
    totalSources: sources.length,
  };
}

export function getSubscribeUrls() {
  const owner = process.env.PROXIEHUB_GITHUB_OWNER || "MS33834";
  const repo = process.env.PROXIEHUB_REPO_NAME || "ProxieHub";
  const gitcodeOwner = process.env.PROXIEHUB_GITCODE_OWNER || "badhope";
  return {
    clash: {
      github: `https://raw.githubusercontent.com/${owner}/${repo}/main/nodes/clash.yaml`,
      gitcode: `https://api.gitcode.com/api/v5/repos/${gitcodeOwner}/${repo}/raw/nodes/clash.yaml?ref=main`,
    },
    v2ray: {
      github: `https://raw.githubusercontent.com/${owner}/${repo}/main/nodes/v2ray.txt`,
      gitcode: `https://api.gitcode.com/api/v5/repos/${gitcodeOwner}/${repo}/raw/nodes/v2ray.txt?ref=main`,
    },
    proxies: {
      github: `https://raw.githubusercontent.com/${owner}/${repo}/main/nodes/proxies.txt`,
      gitcode: `https://api.gitcode.com/api/v5/repos/${gitcodeOwner}/${repo}/raw/nodes/proxies.txt?ref=main`,
    },
  };
}
