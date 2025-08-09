import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-motion",
    "rc-resize-observer",
    "rc-virtual-list",
    "rc-pagination",
    "rc-picker",
  ],
};

export default nextConfig;
