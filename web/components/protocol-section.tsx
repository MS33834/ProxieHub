import {
  Globe,
  Shield,
  Zap,
  Lock,
  Server,
  Network,
  CircleDot,
} from "lucide-react";

interface ProtocolCardProps {
  icon: React.ReactNode;
  name: string;
  fullName: string;
  description: string;
  features: string[];
  color: string;
}

function ProtocolCard({
  icon,
  name,
  fullName,
  description,
  features,
  color,
}: ProtocolCardProps) {
  return (
    <div className="group rounded-2xl bg-surface border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-card">
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="font-bold text-lg">{name}</h3>
        <span className="text-xs text-muted">{fullName}</span>
      </div>
      <p className="text-sm text-muted mb-4 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted">
            <CircleDot className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const protocols = [
  {
    icon: <Zap className="w-6 h-6 text-blue-400" />,
    name: "VLESS",
    fullName: "Lightweight Encrypted Security Standard",
    description:
      "V2Ray 生态中的轻量级协议，流量特征更简洁，常与 XTLS/Reality 搭配以获得更好的性能和隐蔽性。",
    features: ["轻量头部", "高性能", "适合大流量场景"],
    color: "bg-blue-500/10",
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    name: "VMess",
    fullName: "Versatile Multiplexing Encryption",
    description:
      "V2Ray 的核心传输协议，支持多路复用和多种传输层（TCP / WebSocket / gRPC 等）。",
    features: ["成熟稳定", "多传输层", "广泛兼容"],
    color: "bg-purple-500/10",
  },
  {
    icon: <Lock className="w-6 h-6 text-orange-400" />,
    name: "Trojan",
    fullName: "Trojan-GFW",
    description:
      "将代理流量伪装成 HTTPS 流量，协议本身与正常 TLS 网站难以区分，强调隐蔽性。",
    features: ["HTTPS 伪装", "高隐蔽性", "简单配置"],
    color: "bg-orange-500/10",
  },
  {
    icon: <Server className="w-6 h-6 text-emerald-400" />,
    name: "Shadowsocks",
    fullName: "SS / SIP002",
    description:
      "经典的轻量级加密代理协议，被众多客户端原生支持，适合移动设备和路由器。",
    features: ["轻量快速", "广泛支持", "低资源占用"],
    color: "bg-emerald-500/10",
  },
  {
    icon: <Globe className="w-6 h-6 text-gray-400" />,
    name: "HTTP(S)",
    fullName: "Web Proxy",
    description:
      "通用的应用层代理格式，适合浏览器扩展、爬虫、命令行工具等临时场景。",
    features: ["即拿即用", "工具兼容广", "适合爬虫"],
    color: "bg-gray-500/10",
  },
  {
    icon: <Network className="w-6 h-6 text-cyan-400" />,
    name: "SOCKS5",
    fullName: "Socket Secure 5",
    description:
      "支持 UDP 和身份验证的传输层代理，常用于游戏、P2P 或需要 UDP 转发的场景。",
    features: ["支持 UDP", "传输层代理", "低延迟"],
    color: "bg-cyan-500/10",
  },
];

export function ProtocolSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">支持的协议</h2>
          <p className="text-muted">
            ProxieHub 聚合多种公开协议节点，覆盖主流代理客户端与使用场景。
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {protocols.map((p) => (
            <ProtocolCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
