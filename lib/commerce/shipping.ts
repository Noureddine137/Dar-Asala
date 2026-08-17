import "server-only";
import { prisma } from "@/lib/db/prisma";

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
export async function getShippingQuoteForCountry(countryCode: string, subtotal: number): Promise<ShippingQuote | null> {
  const code = countryCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;

  const zones = await prisma.shippingZone.findMany({ where: { active: true }, orderBy: { position: "asc" } });
  const zone = zones.find((z) => parseCountryCodes(z.countries).includes(code));
  if (!zone) return null;

  const threshold = zone.freeThreshold != null ? Number(zone.freeThreshold) : null;
  const isFree = threshold != null && subtotal >= threshold;
  const price = Number(zone.price);

  return {
    zoneId: zone.id,
    region: zone.region,
    estimate: zone.estimate,
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
export async function getSupportedShippingCountries(): Promise<ShippingCountryOption[]> {
  const zones = await prisma.shippingZone.findMany({ where: { active: true }, orderBy: { position: "asc" } });
  const seen = new Set<string>();
  const result: ShippingCountryOption[] = [];
  for (const zone of zones) {
    for (const code of parseCountryCodes(zone.countries)) {
      if (seen.has(code)) continue;
      seen.add(code);
      result.push({ code, region: zone.region });
    }
  }
  return result;
}
