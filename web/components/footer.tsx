import Link from "next/link";
import { GithubIcon, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">ProxieHub</h3>
            <p className="text-muted text-sm leading-relaxed">
              社区维护的免费代理/VPN 工具与公开节点聚合项目。仅供学习网络协议、安全测试和隐私技术研究使用。
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">快速链接</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/subscribe" className="hover:text-primary">
                  订阅节点
                </Link>
              </li>
              <li>
                <Link href="/sources" className="hover:text-primary">
                  数据源
                </Link>
              </li>
              <li>
                <Link href="/clients" className="hover:text-primary">
                  客户端教程
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-primary">
                  免责声明
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">仓库</h4>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <a
                href="https://github.com/MS33834/ProxieHub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://gitcode.com/badhope/ProxieHub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                GitCode 镜像
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Released under MIT License.</span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-danger" /> by the community.
          </span>
        </div>
      </div>
    </footer>
  );
}
