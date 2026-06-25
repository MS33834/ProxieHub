import { defineConfig } from "vitepress";

export default defineConfig({
  base: "/ProxieHub/docs/",
  lang: "zh-CN",
  title: "ProxieHub 文档",
  description:
    "ProxieHub 使用文档：免费公开代理/VPN 节点聚合项目的指南、数据源说明与自动化工作流。",
  cleanUrls: false,
  lastUpdated: true,

  themeConfig: {
    logo: "/logo.svg",
    nav: [
      { text: "首页", link: "/" },
      { text: "新手指南", link: "/beginner-guide" },
      { text: "客户端配置", link: "/client-setup/clash" },
      { text: "数据源", link: "/data-sources" },
      { text: "自动化", link: "/automation" },
      { text: "参与贡献", link: "/contributing" },
      { text: "状态", link: "/status" },
    ],

    sidebar: [
      {
        text: "开始",
        items: [
          { text: "首页", link: "/" },
          { text: "新手指南", link: "/beginner-guide" },
          { text: "常见问题", link: "/faq" },
        ],
      },
      {
        text: "客户端配置",
        collapsed: false,
        items: [
          { text: "Clash Verge Rev", link: "/client-setup/clash-verge-rev" },
          { text: "v2rayN (Windows)", link: "/client-setup/v2rayn" },
          { text: "v2rayNG (Android)", link: "/client-setup/v2rayng" },
          { text: "Shadowrocket (iOS)", link: "/client-setup/shadowrocket" },
          { text: "Clash / Clash Verge（旧版）", link: "/client-setup/clash" },
          { text: "客户端对比", link: "/advanced/client-comparison" },
        ],
      },
      {
        text: "项目参考",
        items: [
          { text: "项目架构", link: "/architecture" },
          { text: "数据源说明", link: "/data-sources" },
          { text: "数据源贡献指南", link: "/data-source-guide" },
          { text: "自动化工作流", link: "/automation" },
          { text: "项目状态", link: "/status" },
        ],
      },
      {
        text: "开发与运维",
        items: [
          { text: "开发指南", link: "/development" },
          { text: "部署说明", link: "/deployment" },
          { text: "维护手册", link: "/maintenance" },
        ],
      },
      {
        text: "参与贡献",
        items: [
          { text: "参与贡献", link: "/contributing" },
          { text: "路线图", link: "/roadmap" },
          { text: "更新日志", link: "/changelog" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/MS33834/ProxieHub" },
    ],

    editLink: {
      pattern:
        "https://github.com/MS33834/ProxieHub/edit/main/docs-site/:path",
      text: "在 GitHub 上编辑此页",
    },

    lastUpdated: {
      text: "最后更新",
      formatOptions: {
        dateStyle: "short",
        timeStyle: "short",
      },
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "回到顶部",
    externalLinkIcon: true,

    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
              closeText: "关闭",
            },
          },
        },
      },
    },

    footer: {
      message:
        "Released under MIT License. 仅供学习网络协议、安全测试和隐私技术研究使用。",
      copyright: "Copyright © 2026-present ProxieHub contributors",
    },
  },

  head: [
    ["link", { rel: "icon", href: "/ProxieHub/docs/logo.svg", type: "image/svg+xml" }],
    ["meta", { name: "theme-color", content: "#6366f1" }],
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
  },
});
