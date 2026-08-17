import { getLocale, getTranslations } from "next-intl/server";
import { LOCALE_LABELS, type Locale } from "@/i18n/routing";

/**
 * Shown above genuinely English-only long-form content (legal pages,
 * journal articles, returns/FAQ policy copy) when the visitor is on a
 * non-English locale — per the checkpoint's explicit instruction not to
 * fabricate translations of legal/demo content. English is always shown
 * underneath, never a blank page.
 */
export async function TranslationNotice({ variant }: { variant: "legal" | "journal" }) {
  const locale = (await getLocale()) as Locale;
  if (locale === "en") return null;
  const t = await getTranslations("translationNotice");

  return (
    <p className="mb-6 rounded-sm border border-camel/40 bg-camel/10 px-4 py-3 text-sm text-charcoal/85">
      {t(variant, { language: LOCALE_LABELS[locale] })}
    </p>
  );
}
