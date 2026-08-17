import "server-only";
import { prisma } from "@/lib/db/prisma";

// Stripe Checkout Sessions accept at most 5 shipping_options — the customer
// picks the one matching their own address, since Stripe doesn't expose the
// entered address back to us mid-session to auto-select one server-side.
// See the comment in getCheckoutShippingConfig() below for the full reasoning.
const MAX_STRIPE_SHIPPING_OPTIONS = 5;

export function parseCountryCodes(countries: string): string[] {
  return countries
    .split(",")
    .map((c) => c.trim().toUpperCase())
    .filter((c) => /^[A-Z]{2}$/.test(c));
}

export type CheckoutShippingOption = {
  shipping_rate_data: {
    type: "fixed_amount";
    fixed_amount: { amount: number; currency: string };
    display_name: string;
  };
};

export type CheckoutShippingConfig = {
  allowedCountries: string[];
  shippingOptions: CheckoutShippingOption[];
};

/**
 * Builds Stripe Checkout `shipping_options` + `allowed_countries` from the
 * active ShippingZone rows, with each option's amount computed here on the
 * server (never trusting a client-supplied shipping amount) from the real
 * cart subtotal vs. that zone's configured free-shipping threshold.
 *
 * Stripe limitation: a Checkout Session's shipping_options list is fixed at
 * session-creation time — Stripe does not let the server react to the
 * address the customer types into the hosted Checkout page, so we can't
 * "look up the one correct zone" after the fact within Checkout itself.
 * Short of collecting the shipping country on our own site before creating
 * the session (a bigger architecture change), the safest supported approach
 * is to present one option per active zone (region + estimate in the
 * label), restrict `allowed_countries` to the union of all zone countries so
 * customers can't select somewhere we don't configure shipping for, and let
 * the customer pick the option that matches their own address. Every
 * option's amount is still fully server-computed and immutable by the
 * client — the browser can only choose among pre-priced options, never set
 * a price.
 *
 * Returns null if there's no usable shipping configuration (no active
 * zones, or none with a parseable country list) so the caller can fail
 * closed instead of silently charging nothing.
 */
export async function getCheckoutShippingConfig(
  subtotal: number,
  currency: string
): Promise<CheckoutShippingConfig | null> {
  const zones = await prisma.shippingZone.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
    take: MAX_STRIPE_SHIPPING_OPTIONS,
  });

  if (zones.length === 0) return null;

  const allowedCountries = Array.from(new Set(zones.flatMap((z) => parseCountryCodes(z.countries))));
  if (allowedCountries.length === 0) return null;

  const shippingOptions: CheckoutShippingOption[] = zones.map((zone) => {
    const threshold = zone.freeThreshold != null ? Number(zone.freeThreshold) : null;
    const isFree = threshold != null && subtotal >= threshold;
    const amount = isFree ? 0 : Math.round(Number(zone.price) * 100);
    const label = zone.carrier ? `${zone.region} — ${zone.estimate} (${zone.carrier})` : `${zone.region} — ${zone.estimate}`;

    return {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount, currency: currency.toLowerCase() },
        display_name: label,
      },
    };
  });

  return { allowedCountries, shippingOptions };
}
