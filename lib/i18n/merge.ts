import "server-only";
import type { Locale as PrismaLocale } from "@prisma/client";
import type { Locale } from "@/i18n/routing";
import { DEFAULT_LOCALE } from "@/i18n/routing";

/**
 * Our app-level locale codes ("en"/"de"/"fr") map onto the Prisma `Locale`
 * enum used by *Translation tables — which only has DE/FR, since English is
 * never stored as a translation row (it's the canonical data on the base
 * model). Returns null for English, meaning "no translation lookup needed".
 */
export function toPrismaLocale(locale: Locale): PrismaLocale | null {
  if (locale === "de") return "DE";
  if (locale === "fr") return "FR";
  return null;
}

/**
 * Overlays a translation row onto a base (English) record, field by field.
 * Any translated field that is null/undefined/empty falls back to the
 * English value already on `base` — so a partially-translated row (or no
 * row at all, when `translation` is undefined) never produces blank text.
 */
export function withTranslation<Base extends object, Keys extends keyof Base>(
  base: Base,
  translation: { [K in Keys]?: Base[K] | null } | null | undefined,
  keys: readonly Keys[]
): Base {
  if (!translation) return base;
  const merged = { ...base };
  for (const key of keys) {
    const value = translation[key];
    if (value !== null && value !== undefined && value !== "") {
      merged[key] = value as Base[Keys];
    }
  }
  return merged;
}

export { DEFAULT_LOCALE };
export type { Locale };
