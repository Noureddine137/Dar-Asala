import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Every storefront route now lives under a /en, /de or /fr prefix, so the
// account/cart/checkout/wishlist disallow rules need one entry per locale —
// a bare "/account" rule wouldn't match "/en/account".
const PRIVATE_PATHS = ["/account", "/cart", "/checkout", "/wishlist"];

export default function robots(): MetadataRoute.Robots {
  const localizedDisallow = routing.locales.flatMap((locale) =>
    PRIVATE_PATHS.map((path) => `/${locale}${path}`)
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", ...localizedDisallow],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
