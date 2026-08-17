import { NextResponse } from "next/server";
import { getSupportedShippingCountries } from "@/lib/commerce/shipping";

/**
 * Public, read-only — the same information already shown on /shipping.
 * Powers the storefront's destination-country selector, which only ever
 * offers countries covered by an active ShippingZone.
 */
export async function GET() {
  const countries = await getSupportedShippingCountries();
  return NextResponse.json({ countries });
}
