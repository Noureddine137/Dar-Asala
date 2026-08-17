import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // Product photos are uploaded to Vercel Blob (Admin → Product → Images)
    // and served from its public storage domain — one random subdomain
    // segment per Blob store, hence the single-level wildcard. Locked to
    // this provider only; no open "any host" wildcard.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // app/[locale] and app/admin are two independent root layouts (see
    // app/[locale]/layout.tsx), so there's no single layout Next.js could
    // compose a top-level app/not-found.tsx from. global-not-found.tsx is
    // the documented escape hatch for exactly this "multiple root layouts"
    // case — it bypasses locale routing entirely for genuinely unmatched
    // URLs, so it can't be translated; in-locale 404s are handled by the
    // fully localized app/[locale]/(storefront)/not-found.tsx instead.
    globalNotFound: true,
  },
};

export default withNextIntl(nextConfig);
