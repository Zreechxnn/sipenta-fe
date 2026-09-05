import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["192.168.0.104", "192.168.0.104:3000", "localhost:3000", ".rechanpage.my.id"],
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.0.104", "192.168.0.104:3000", "localhost:3000", ".rechanpage.my.id"],
    },
  },
  async headers() {
    return [
      {
        source: "/_next/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
