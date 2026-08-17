import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { prisma } from "@/lib/db/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { getShippingQuoteForCountry } from "@/lib/commerce/shipping";
import { colorLabel, sizeLabel } from "@/lib/utils/format";
import { routing, type Locale } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const schema = z.object({
  items: z
    .array(
      z.object({
        variantId: z.string().min(1),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1),
  // The customer's destination, chosen on our own site before Checkout —
  // required. Only ever used to look up the matching ShippingZone; the
  // browser never supplies (and this route never reads) a shipping price.
  country: z
    .string()
    .trim()
    .length(2)
    .regex(/^[A-Za-z]{2}$/, "Invalid country code"),
  // Active storefront locale — passed to Stripe Checkout so its hosted UI
  // appears in the customer's language, used to localize this route's own
  // error messages, and stored on the Order for a possible future
  // confirmation-email system. Never affects pricing.
  locale: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const localeCandidate = body && typeof body === "object" ? (body as { locale?: unknown }).locale : undefined;
  const locale: Locale = hasLocale(routing.locales, localeCandidate) ? localeCandidate : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "checkoutApi" });

  if (!isStripeConfigured()) {
    return NextResponse.json({ error: t("notConfigured") }, { status: 503 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const countryIssue = parsed.error.issues.some((issue) => issue.path[0] === "country");
    return NextResponse.json({ error: countryIssue ? t("selectDestination") : t("invalidCart") }, { status: 400 });
  }

  const variantIds = parsed.data.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } } },
  });

  if (variants.length === 0) {
    return NextResponse.json({ error: t("noValidItems") }, { status: 400 });
  }

  // Shipping amounts must be computed server-side from the real cart total —
  // never trust a subtotal or shipping amount supplied by the browser.
  let subtotal = 0;
  const lineItems = parsed.data.items.flatMap((item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant) return [];
    const unitPrice = variant.priceOverride ? Number(variant.priceOverride) : Number(variant.product.price);
    subtotal += unitPrice * item.quantity;
    const image = variant.product.images[0];
    return [
      {
        quantity: item.quantity,
        price_data: {
          currency: variant.product.currency.toLowerCase(),
          unit_amount: Math.round(unitPrice * 100),
          product_data: {
            name: `${variant.product.name} — ${colorLabel(variant.color, locale)} / ${sizeLabel(variant.size, locale)}`,
            images: image ? [`${siteUrl}${image.url}`] : undefined,
            metadata: { productId: variant.productId, variantId: variant.id },
          },
        },
      },
    ];
  });

  if (lineItems.length === 0) {
    return NextResponse.json({ error: t("noValidItems") }, { status: 400 });
  }

  const currency = variants[0].product.currency;
  const countryCode = parsed.data.country.toUpperCase();
  const quote = await getShippingQuoteForCountry(countryCode, subtotal, locale);

  if (!quote) {
    const anyActiveZones = await prisma.shippingZone.count({ where: { active: true } });
    if (anyActiveZones === 0) {
      return NextResponse.json({ error: t("shippingNotConfigured") }, { status: 503 });
    }
    return NextResponse.json({ error: t("shippingUnavailable") }, { status: 400 });
  }

  // Exactly one shipping option — the one server-computed rate for the
  // customer's own selected destination. Stripe no longer sees a menu of
  // regions to pick from, so a customer can't select a cheaper zone that
  // doesn't correspond to where they're actually shipping. region/estimate
  // are already localized by getShippingQuoteForCountry above.
  const shippingOption = {
    shipping_rate_data: {
      type: "fixed_amount" as const,
      fixed_amount: { amount: Math.round(quote.shipping * 100), currency: currency.toLowerCase() },
      display_name: quote.carrier ? `${quote.region} — ${quote.estimate} (${quote.carrier})` : `${quote.region} — ${quote.estimate}`,
    },
  };

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    // Renders Stripe's hosted Checkout UI in the customer's language —
    // "en"/"de"/"fr" are all natively supported Stripe locale codes.
    locale: locale as Stripe.Checkout.SessionCreateParams.Locale,
    line_items: lineItems,
    payment_method_types: ["card"],
    shipping_address_collection: {
      // Scoped to the matched zone's countries (not just the single selected
      // code) so an address anywhere in the same zone still prices
      // correctly — but never a country outside it. Dynamic, admin-
      // configured codes vs. Stripe's closed literal union type: validated
      // at runtime by parseCountryCodes() (2-letter alpha only), not
      // against Stripe's exact supported list.
      allowed_countries: quote.countries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
    },
    shipping_options: [shippingOption],
    metadata: {
      cart: JSON.stringify(parsed.data.items).slice(0, 490),
      shippingCountry: countryCode,
      shippingZoneId: quote.zoneId,
      locale,
    },
    success_url: `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${locale}/checkout/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
