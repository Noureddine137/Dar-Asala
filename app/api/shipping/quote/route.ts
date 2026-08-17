import { NextRequest, NextResponse } from "next/server";
import { getShippingQuoteForCountry } from "@/lib/commerce/shipping";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Public, display-only estimate for the cart (country selector, free-shipping
 * message, estimated total). The `subtotal` here is client-reported and used
 * only to render this estimate — it is NEVER trusted for an actual charge.
 * The real Stripe Checkout Session (see /api/checkout) always recomputes the
 * subtotal itself from server-verified cart contents before pricing
 * shipping, using this same getShippingQuoteForCountry() function so the
 * two can never disagree.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") ?? "";
  const subtotalRaw = Number(searchParams.get("subtotal") ?? "0");
  const subtotal = Number.isFinite(subtotalRaw) && subtotalRaw > 0 ? subtotalRaw : 0;
  const localeParam = searchParams.get("locale");
  const locale: Locale = hasLocale(routing.locales, localeParam) ? localeParam : routing.defaultLocale;

  const quote = await getShippingQuoteForCountry(country, subtotal, locale);
  if (!quote) {
    // A stable error code, not prose — the client (shipping-country-select.tsx)
    // maps this to a translated message via next-intl.
    return NextResponse.json({ ok: false, error: "no_zone" });
  }

  return NextResponse.json({
    ok: true,
    region: quote.region,
    estimate: quote.estimate,
    carrier: quote.carrier,
    shipping: quote.shipping,
    freeThreshold: quote.freeThreshold,
    isFree: quote.isFree,
  });
}
