import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product images are DB-driven (ProductImage.url) and editable from
    // /admin without code changes, including pointing at an external host
    // before a real object-storage provider is wired up. Once one is
    // chosen, narrow this to that provider's hostname.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
