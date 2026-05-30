import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/peel',
  images: {
    unoptimized: true, // required for static export
  },
};

export default nextConfig;
