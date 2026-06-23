import {
  Zap,
  Shield,
  Lock,
  Server,
  Globe,
  Network,
} from "lucide-react";

interface ProtocolItemProps {
  icon: React.ReactNode;
  name: string;
  fullName: string;
  description: string;
}

function ProtocolItem({ icon, name, fullName, description }: ProtocolItemProps) {
  return (
    <div className="flex gap-3 border border-border bg-surface p-4">
      <div className="p-1.5 border border-border h-fit text-primary shrink-0">
        {icon}
      </div>
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className="font-mono text-sm font-medium uppercase">{name}</h3>
          <span className="text-[10px] text-muted">{fullName}</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const protocols = [
  {
    icon: <Zap className="w-4 h-4" />,
    name: "VLESS",
    fullName: "Lightweight Encrypted Security Standard",
    description:
      "V2Ray 生态中的轻量级协议，流量特征更简洁，常与 XTLS/Reality 搭配以获得更好的性能和隐蔽性。",
  },
  {
    icon: <Shield className="w-4 h-4" />,
    name: "VMess",
    fullName: "Versatile Multiplexing Encryption",
    description:
      "V2Ray 的核心传输协议，支持多路复用和多种传输层（TCP / WebSocket / gRPC 等）。",
  },
  {
    icon: <Lock className="w-4 h-4" />,
    name: "Trojan",
    fullName: "Trojan-GFW",
    description:
      "将代理流量伪装成 HTTPS 流量，协议本身与正常 TLS 网站难以区分，强调隐蔽性。",
  },
  {
    icon: <Server className="w-4 h-4" />,
    name: "Shadowsocks",
    fullName: "SS / SIP002",
    description:
      "经典的轻量级加密代理协议，被众多客户端原生支持，适合移动设备和路由器。",
  },
  {
    icon: <Globe className="w-4 h-4" />,
    name: "HTTP(S)",
    fullName: "Web Proxy",
    description:
      "通用的应用层代理格式，适合浏览器扩展、爬虫、命令行工具等临时场景。",
  },
  {
    icon: <Network className="w-4 h-4" />,
    name: "SOCKS5",
    fullName: "Socket Secure 5",
    description:
      "支持 UDP 和身份验证的传输层代理，常用于游戏、P2P 或需要 UDP 转发的场景。",
  },
];

export function ProtocolSection() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-1">支持的协议</h2>
          <p className="text-sm text-muted">
            ProxieHub 聚合多种公开协议节点，覆盖主流代理客户端与使用场景。
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {protocols.map((p) => (
            <ProtocolItem key={p.name} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}
