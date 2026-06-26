import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { DisclaimerBanner } from "@/components/disclaimer-banner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const siteUrl = "https://ms33834.github.io/ProxieHub";

export const metadataBase = new URL(siteUrl);

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
};

export const metadata: Metadata = {
  title: "ProxieHub — 免费公开代理/VPN 节点聚合站",
  description:
    "ProxieHub 自动抓取、解析、校验互联网公开节点，每日更新 Clash、V2Ray、HTTP(S)/SOCKS4/SOCKS5 三种订阅格式。仅供学习网络协议、安全测试和隐私技术研究使用。",
  keywords: [
    "免费节点",
    "代理",
    "VPN",
    "Clash",
    "V2Ray",
    "Shadowsocks",
    "VLESS",
    "VMess",
    "Trojan",
    "订阅",
  ],
  authors: [{ name: "ProxieHub Community" }],
  openGraph: {
    title: "ProxieHub — 免费公开代理/VPN 节点聚合站",
    description:
      "每日自动更新的公开节点聚合站，提供 Clash、V2Ray、HTTP(S)/SOCKS4/SOCKS5 三种订阅格式。",
    type: "website",
    url: "/",
    siteName: "ProxieHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProxieHub — 免费公开代理/VPN 节点聚合站",
    description:
      "每日自动更新的公开节点聚合站，提供 Clash、V2Ray、HTTP(S)/SOCKS4/SOCKS5 三种订阅格式。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <DisclaimerBanner />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
