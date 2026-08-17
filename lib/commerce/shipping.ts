import "server-only";
import { prisma } from "@/lib/db/prisma";
import { toPrismaLocale, withTranslation, type Locale } from "@/lib/i18n/merge";

export function parseCountryCodes(countries: string): string[] {
  return countries
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter((c) => /^[A-Z]{2}$/.test(c));
}

export type ShippingQuote = {
  zoneId: string;
  region: string;
  estimate: string;
  carrier: string | null;
  price: number;
  freeThreshold: number | null;
  isFree: boolean;
  shipping: number;
  /** Full parsed country list for this zone — used to scope Stripe's allowed_countries. */
  countries: string[];
};

/**
 * The single authority for "what does shipping cost for this destination".
 * Used both by /api/shipping/quote (a display-only estimate for the cart —
 * the subtotal it's given there is client-reported and not trusted for any
 * charge) and by /api/checkout (the real charge, where subtotal is always
 * computed server-side from verified cart contents). Same code path either
 * way, so the two can never disagree.
 *
 * Returns null if the country isn't well-formed or doesn't fall inside any
 * active ShippingZone — the caller must fail closed rather than charge
 * nothing or guess.
 */
const ZONE_TRANSLATION_KEYS = ["region", "estimate"] as const;

/**
 * Looks up (and, if translated, merges in) the DE/FR label for a zone.
 * Never touches price/countries/threshold — those stay identical regardless
 * of locale, since this same lookup backs the real Stripe charge in
 * /api/checkout as well as the display-only estimate in /api/shipping/quote.
 */
async function localizeZone<Z extends { id: string; region: string; estimate: string }>(
  zone: Z,
  locale: Locale | undefined
): Promise<Z> {
  const prismaLocale = locale ? toPrismaLocale(locale) : null;
  if (!prismaLocale) return zone;
  const translation = await prisma.shippingZoneTranslation.findUnique({
    where: { zoneId_locale: { zoneId: zone.id, locale: prismaLocale } },
  });
  return withTranslation(zone, translation, ZONE_TRANSLATION_KEYS);
}

export async function getShippingQuoteForCountry(
  countryCode: string,
  subtotal: number,
  locale?: Locale
): Promise<ShippingQuote | null> {
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;

  const zones = await prisma.shippingZone.findMany({ where: { active: true }, orderBy: { position: "asc" } });
  const zone = zones.find((z) => parseCountryCodes(z.countries).includes(code));
  if (!zone) return null;

  const localizedZone = await localizeZone(zone, locale);
  const threshold = zone.freeThreshold != null ? Number(zone.freeThreshold) : null;
  const isFree = threshold != null && subtotal >= threshold;
  const price = Number(zone.price);

  return {
    zoneId: zone.id,
    region: localizedZone.region,
    estimate: localizedZone.estimate,
    carrier: zone.carrier,
    price,
    freeThreshold: threshold,
    isFree,
    shipping: isFree ? 0 : price,
    countries: parseCountryCodes(zone.countries),
  };
}

export type ShippingCountryOption = { code: string; region: string };

/** Every country covered by an active zone — the storefront selector only offers these. */
export async function getSupportedShippingCountries(locale?: Locale): Promise<ShippingCountryOption[]> {
  const zones = await prisma.shippingZone.findMany({ where: { active: true }, orderBy: { position: "asc" } });
  const prismaLocale = locale ? toPrismaLocale(locale) : null;
  const translations = prismaLocale
    ? await prisma.shippingZoneTranslation.findMany({
        where: { zoneId: { in: zones.map((z) => z.id) }, locale: prismaLocale },
      })
    : [];
  const translationByZoneId = new Map(translations.map((t) => [t.zoneId, t]));

  const seen = new Set<string>();
  const result: ShippingCountryOption[] = [];
  for (const zone of zones) {
    const region = withTranslation(zone, translationByZoneId.get(zone.id), ZONE_TRANSLATION_KEYS).region;
    for (const code of parseCountryCodes(zone.countries)) {
      if (seen.has(code)) continue;
      seen.add(code);
      result.push({ code, region });
    }
  }
  return result;
}
