"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GithubIcon, Globe } from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "首页", href: "/" },
  { label: "订阅", href: "/subscribe" },
  { label: "数据源", href: "/sources" },
  { label: "客户端", href: "/clients" },
  { label: "免责声明", href: "/disclaimer" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Globe className="w-6 h-6 text-primary" />
          <span>ProxieHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://github.com/MS33834/ProxieHub"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover"
            aria-label="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
        </nav>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-surface-hover"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-4 py-3 space-y-1 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                pathname === item.href
                  ? "text-primary bg-primary/10"
                  : "text-muted hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
