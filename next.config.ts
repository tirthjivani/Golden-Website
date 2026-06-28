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
    // Next 16 requires an explicit allowlist; without it quality defaults to
    // [75] and any quality={90} prop is silently clamped back to 75 (blurry).
    qualities: [75, 90, 100],
    // Sources run up to ~5000px, so keep high-DPI tiers — a full-width hero on a
    // 2x display needs >3000px or it visibly upscales and blurs.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
