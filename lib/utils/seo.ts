import "server-only";
import { routing, type Locale } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const OG_LOCALES: Record<Locale, string> = { en: "en_US", de: "de_DE", fr: "fr_FR" };

/** e.g. localizedUrl("de", "/products/lalla-leather-bag") -> "https://.../de/products/lalla-leather-bag" */
export function localizedUrl(locale: Locale, path = "") {
  return `${siteUrl}/${locale}${path}`;
}

/**
 * hreflang alternates for a Metadata `alternates` field: canonical points at
 * the current locale's own URL (never a different locale — each locale's
 * page is a first-class, independently indexable URL, not a redirect
 * target), and `languages` lists every locale plus x-default (pointed at
 * English, the canonical/source locale) so search engines treat the three
 * locale URLs as intentional alternates rather than duplicate content.
 */
export function buildAlternates(locale: Locale, path = "") {
  const languages: Record<string, string> = { "x-default": localizedUrl(routing.defaultLocale, path) };
  for (const l of routing.locales) {
    languages[l] = localizedUrl(l, path);
  }
  return {
    canonical: localizedUrl(locale, path),
    languages,
  };
}
