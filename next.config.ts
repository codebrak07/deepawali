import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
