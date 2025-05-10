import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: "https://spark-api-open.xf-yun.com/v1/:path*",
      },
    ];
  },
  output: "export",
  distDir: "dist",
};

export default nextConfig;
