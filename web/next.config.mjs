/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  distDir: "dist",
  ...(isProd
    ? { basePath: "/ProxieHub" }
    : {
        allowedDevOrigins: [
          "127.0.0.1",
          "*.trae.cn",
        ],
      }),
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
