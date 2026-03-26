import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com', // Domain ảnh của YouTube
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // Domain ảnh thay thế
      },
    ],
  },
};

export default nextConfig;
