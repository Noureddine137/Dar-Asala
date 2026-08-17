import { NextRequest, NextResponse } from "next/server";
import { getShippingQuoteForCountry } from "@/lib/commerce/shipping";

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

  const quote = await getShippingQuoteForCountry(country, subtotal);
  if (!quote) {
    return NextResponse.json({ ok: false, error: "Shipping is currently unavailable for this destination." });
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
