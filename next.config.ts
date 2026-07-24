import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/chat": ["*.md"],
  },
  ...(process.env.DEV_LAN_IP ? { allowedDevOrigins: [process.env.DEV_LAN_IP] } : {}),
};

export default nextConfig;
