import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.NETLIFY ? { output: "export" as const } : {}),
};

export default nextConfig;
