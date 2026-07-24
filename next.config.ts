import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/chat": ["*.md"],
  },
  // allowedDevOrigins: ['192.168.68.65'],
};

export default nextConfig;
