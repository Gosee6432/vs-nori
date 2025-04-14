import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  /* 오류무시 */
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
