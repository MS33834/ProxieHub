import fs from "fs";
import path from "path";

const PROJECT_ROOT = path.join(process.cwd(), "..");
const NODES_DIR = path.join(PROJECT_ROOT, "nodes");
const CONFIG_PATH = path.join(PROJECT_ROOT, "config", "sources.json");
const CHANGELOG_PATH = path.join(PROJECT_ROOT, "CHANGELOG.md");

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
  max_size?: number;
  proxy_scheme?: string;
}

export interface SiteStats {
  generatedAt: string;
  totalNodes: number;
  protocolCounts: Record<string, number>;
  sources: SourceConfig[];
  enabledSources: number;
  totalSources: number;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  categories: Record<string, string[]>;
}

export interface StatusStats {
  lastUpdated: string;
  nodeCount: number;
  proxyCount: number;
  enabledSources: number;
  totalSources: number;
  protocolCounts: Record<string, number>;
  actionsStatus: string;
}

function parseClashYaml(filePath: string): { total: number; protocols: Record<string, number> } {
  const text = fs.readFileSync(filePath, "utf-8");
  const lines = text.split("\n");
  let inProxies = false;
  let itemIndent = -1;
  const protocols: Record<string, number> = {};
  let currentType: string | null = null;
  let total = 0;

  for (const rawLine of lines) {
    const line = rawLine.replace(/\r/g, "");
    const stripped = line.trim();
    if (stripped.startsWith("#")) continue;

    if (!inProxies) {
      if (/^\s*proxies:\s*$/.test(line)) {
        inProxies = true;
        itemIndent = -1;
      }
      continue;
    }

    const leading = line.match(/^(\s*)/)?.[1].length || 0;

    // End of the proxies list: a sibling top-level key appears.
    if (
      itemIndent >= 0 &&
      leading <= itemIndent &&
      stripped.length > 0 &&
      !/^\s*- /.test(line)
    ) {
      break;
    }

    // A new proxy entry starts with `- name:` or `- type:`.
    if (
      /^\s*- /.test(line) &&
      (stripped.startsWith("- name:") || stripped.startsWith("- type:"))
    ) {
      if (currentType) {
        protocols[currentType] = (protocols[currentType] || 0) + 1;
      }
      currentType = null;
      total++;

      const match = line.match(/^(\s*)- /);
      itemIndent = match ? match[1].length : leading;

      if (stripped.startsWith("- type:")) {
        currentType = stripped.replace("- type:", "").trim();
      }
      continue;
    }

    // Capture type when it appears after the name.
    if (total > 0 && itemIndent >= 0 && leading > itemIndent && stripped.startsWith("type:")) {
      currentType = stripped.replace("type:", "").trim();
    }
  }

  if (currentType) {
    protocols[currentType] = (protocols[currentType] || 0) + 1;
  }

  return { total, protocols };
}

function loadSources(): SourceConfig[] {
  if (!fs.existsSync(CONFIG_PATH)) return [];
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  return [
    ...(config.free_node_sources || []),
    ...(config.free_proxy_apis || []),
  ];
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

  const sources = loadSources();
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

export function parseChangelog(): ChangelogEntry[] {
  if (!fs.existsSync(CHANGELOG_PATH)) return [];
  const text = fs.readFileSync(CHANGELOG_PATH, "utf-8");
  const entries: ChangelogEntry[] = [];

  const blocks = text.split(/\n(?=##\s+\[)/).filter((b) => /^##\s+\[/.test(b.trim()));

  for (const block of blocks) {
    const headerMatch = block.match(/^##\s+\[([^\]]+)\]\s+-\s+(\d{4}-\d{2}-\d{2})/);
    if (!headerMatch) continue;

    const [, version, date] = headerMatch;
    const categories: Record<string, string[]> = {};
    let currentCategory = "";

    for (const line of block.split("\n").slice(1)) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("### ")) {
        currentCategory = trimmed.replace("### ", "").trim();
        categories[currentCategory] = categories[currentCategory] || [];
      } else if (trimmed.startsWith("- ") && currentCategory) {
        categories[currentCategory].push(trimmed.replace("- ", "").trim());
      }
    }

    entries.push({ version, date, categories });
  }

  return entries;
}

export function loadStatusStats(): StatusStats {
  const clashPath = path.join(NODES_DIR, "clash.yaml");
  const proxiesPath = path.join(NODES_DIR, "proxies.txt");

  let nodeCount = 0;
  let protocolCounts: Record<string, number> = {};
  let lastUpdated = "Unknown";

  if (fs.existsSync(clashPath)) {
    const parsed = parseClashYaml(clashPath);
    nodeCount = parsed.total;
    protocolCounts = parsed.protocols;
    try {
      const stat = fs.statSync(clashPath);
      lastUpdated = new Date(stat.mtime).toLocaleString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      // ignore
    }
  }

  let proxyCount = 0;
  if (fs.existsSync(proxiesPath)) {
    proxyCount = fs
      .readFileSync(proxiesPath, "utf-8")
      .split("\n")
      .filter((line) => line.trim() && !line.trim().startsWith("#")).length;
  }

  const sources = loadSources();
  const enabledSources = sources.filter((s) => s.enabled).length;

  return {
    lastUpdated,
    nodeCount,
    proxyCount,
    enabledSources,
    totalSources: sources.length,
    protocolCounts,
    actionsStatus: "每日自动运行（UTC 02:00）",
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
