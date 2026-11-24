import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.decathlon.vn",
      },
      {
        protocol: "https",
        hostname: "**.decathlon.vn",
      },
      {
        protocol: "https",
        hostname: "contents.mediadecathlon.com",
      },
      {
        protocol: "https",
        hostname: "fanfan.vn",
      },
      {
        protocol: "https",
        hostname: "**.fanfan.vn",
      },
      {
        protocol: "https",
        hostname: "product.hstatic.net",
      },
      {
        protocol: "https",
        hostname: "file.hstatic.net",
      },
      {
        protocol: "https",
        hostname: "api.peakgear.vn",
      },
    ],
  },
};

export default nextConfig;
