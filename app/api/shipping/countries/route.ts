import { NextRequest, NextResponse } from "next/server";
import { getSupportedShippingCountries } from "@/lib/commerce/shipping";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Public, read-only — the same information already shown on /shipping.
 * Powers the storefront's destination-country selector, which only ever
 * offers countries covered by an active ShippingZone.
 */
export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale: Locale = hasLocale(routing.locales, localeParam) ? localeParam : routing.defaultLocale;
  const countries = await getSupportedShippingCountries(locale);
  return NextResponse.json({ countries });
}
