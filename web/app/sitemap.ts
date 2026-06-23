import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ms33834.github.io/ProxieHub";
  const routes = [
    "",
    "/subscribe",
    "/sources",
    "/sources/guide",
    "/clients",
    "/tools",
    "/status",
    "/roadmap",
    "/changelog",
    "/architecture",
    "/about",
    "/community",
    "/contribute",
    "/disclaimer",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
