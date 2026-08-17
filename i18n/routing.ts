import { defineRouting } from "next-intl/routing";

export const LOCALES = ["en", "de", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

// Maps our short locale codes to the BCP-47 tags used for Intl formatting
// (currency, dates) and passed to Stripe Checkout.
export const INTL_LOCALE_TAGS: Record<Locale, string> = {
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
};

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
};

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // Always show the prefix, including for English (/en/..., not bare /...) —
  // the checkpoint's examples are explicit about this, and it keeps every
  // locale's canonical URL unambiguous for hreflang/SEO.
  localePrefix: "always",
});
