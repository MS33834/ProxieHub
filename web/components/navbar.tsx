"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Code2, Globe } from "lucide-react";

const navItems = [
  { label: "首页", href: "/" },
  { label: "订阅", href: "/subscribe" },
  { label: "数据源", href: "/sources" },
  { label: "客户端", href: "/clients" },
  { label: "免责声明", href: "/disclaimer" },
];

const docsHref = "/ProxieHub/docs/";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight"
        >
          <Globe className="w-5 h-5 text-primary" />
          <span>ProxieHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "text-foreground border-b border-primary"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={docsHref}
            className="px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors"
          >
            文档
          </a>
          <a
            href="https://github.com/MS33834/ProxieHub"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-1.5 text-muted hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Code2 className="w-4 h-4" />
          </a>
        </nav>

        <button
          className="md:hidden p-1.5 hover:bg-surface-hover"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-4 py-2 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-sm ${
                  active
                    ? "text-foreground bg-surface"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <a
            href={docsHref}
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-hover"
          >
            文档
          </a>
        </div>
      )}
    </header>
  );
}
