import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/commerce/products";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale: Locale = hasLocale(routing.locales, localeParam) ? localeParam : routing.defaultLocale;

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }
  const results = await searchProducts(q, locale);
  return NextResponse.json({ results });
}
