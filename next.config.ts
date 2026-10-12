import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // The 3D avatar is a large PNG; AVIF cuts it by an order of magnitude.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
