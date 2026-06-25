export type NewsCategory = "project" | "protocol" | "security";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: NewsCategory;
  summary: string;
  content: string;
}

export const categoryLabels: Record<NewsCategory | "all", string> = {
  all: "全部",
  project: "项目",
  protocol: "协议",
  security: "安全",
};

export const categoryStyles: Record<NewsCategory, string> = {
  project: "border-primary/30 text-primary bg-primary/10",
  protocol: "border-secondary/30 text-secondary bg-secondary/10",
  security: "border-warning/30 text-warning bg-warning/10",
};

export const news: NewsItem[] = [
  {
    id: "proxiehub-v2",
    title: "ProxieHub 网站 2.0 改版上线",
    date: "2026-06-20",
    category: "project",
    summary: "全新的响应式界面、数据源健康度看板与工具决策树，让订阅与排查更高效。",
    content:
      "我们对 ProxieHub 的 Web 界面进行了全面重构：新增数据源健康度、失效源报告入口、命令行示例与工具选择决策树。页面加载速度更快，移动端体验也得到优化。后续将陆续支持节点测速结果展示与多语言。",
  },
  {
    id: "hybrid-protocol",
    title: "混合协议订阅使用指南",
    date: "2026-06-18",
    category: "protocol",
    summary: "Clash、V2Ray 与 Base64 订阅各有什么区别，如何根据客户端选择正确格式。",
    content:
      "Clash 订阅基于 YAML，支持规则分流，适合 Clash 系列客户端；V2Ray 订阅通常为 vmess/vless 链接集合，兼容 v2rayN、v2rayNG 等；Base64 订阅是通用格式，可被大多数客户端识别。 ProxieHub 同时提供三种输出，用户只需复制对应链接即可。",
  },
  {
    id: "public-node-risks",
    title: "公开节点安全使用建议",
    date: "2026-06-15",
    category: "security",
    summary: "免费公开节点可能存在流量嗅探与中间人风险，建议遵循最小权限原则。",
    content:
      "公开节点由第三方维护，运营者可能查看、记录或篡改流量。建议仅用于临时访问、学习研究或低敏感场景；涉及账号、支付、隐私数据时，请使用可信商业服务或自建节点。同时保持客户端与系统更新，避免下载来路不明的配置文件。",
  },
  {
    id: "source-verification",
    title: "数据源可靠性标注更新",
    date: "2026-06-10",
    category: "project",
    summary: "为每个数据源新增 reliability 字段，优先展示高可靠源并标注更新频率。",
    content:
      "我们在 sources.json 中引入了 reliability（high / medium / low）字段，用于标识数据源的历史稳定性与维护活跃度。网站健康度卡片中的“已验证源数量”即来源于此。未来还将结合每日连通性检测结果进一步校准该指标。",
  },
  {
    id: "sing-box-intro",
    title: "sing-box 核心与客户端入门",
    date: "2026-06-05",
    category: "protocol",
    summary: "sing-box 作为新一代跨平台代理核心，正被越来越多客户端采用。",
    content:
      "sing-box 支持 VLESS、VMess、Trojan、Shadowsocks、Hysteria 2 等多种协议，并提供统一的路由与 DNS 配置。NekoBox、Nekoray、Hiddify 等客户端均已内置 sing-box 内核。对于喜欢命令行的用户，也可直接使用 sing-box CLI 在服务器或本地运行。",
  },
  {
    id: "subscription-leak",
    title: "避免订阅链接泄露小贴士",
    date: "2026-06-01",
    category: "security",
    summary: "订阅链接一旦泄露可能被他人滥用，建议不要随意分享或公开张贴。",
    content:
      "订阅链接通常包含大量节点信息，泄露后可能导致节点被滥用、IP 被封禁或被恶意抓取。请仅在受信任的客户端中使用，不要粘贴到公共论坛、聊天群或代码仓库。若怀疑链接已泄露，可在 GitHub Issues 中联系维护者并考虑更换订阅地址。",
  },
];
