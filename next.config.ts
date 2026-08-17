import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product photos are uploaded to Vercel Blob (Admin → Product → Images)
    // and served from its public storage domain — one random subdomain
    // segment per Blob store, hence the single-level wildcard. Locked to
    // this provider only; no open "any host" wildcard.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
