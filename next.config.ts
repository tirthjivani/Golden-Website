import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  images: {
    // Dev: WebP only (AVIF is far slower to encode on-demand). Prod: prefer AVIF.
    formats:
      process.env.NODE_ENV === "production"
        ? ["image/avif", "image/webp"]
        : ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    // Sources are capped at 2048px, so a 3840 tier only wastes encode time/bytes.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
