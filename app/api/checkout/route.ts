import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { getCheckoutShippingConfig } from "@/lib/commerce/shipping";
import { colorLabel, sizeLabel } from "@/lib/utils/format";

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
});

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Checkout is not yet configured. Add STRIPE_SECRET_KEY to enable payments." },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart." }, { status: 400 });
  }

  const variantIds = parsed.data.items.map((i) => i.variantId);
  const variants = await prisma.productVariant.findMany({
    where: { id: { in: variantIds } },
    include: { product: { include: { images: { orderBy: { position: "asc" }, take: 1 } } } },
  });

  if (variants.length === 0) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
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
            name: `${variant.product.name} — ${colorLabel(variant.color)} / ${sizeLabel(variant.size)}`,
            images: image ? [`${siteUrl}${image.url}`] : undefined,
            metadata: { productId: variant.productId, variantId: variant.id },
          },
        },
      },
    ];
  });

  if (lineItems.length === 0) {
    return NextResponse.json({ error: "No valid items in cart." }, { status: 400 });
  }

  const currency = variants[0].product.currency;
  const shippingConfig = await getCheckoutShippingConfig(subtotal, currency);
  if (!shippingConfig) {
    return NextResponse.json(
      { error: "Shipping is not configured. Add at least one active shipping zone in Admin → Shipping." },
      { status: 503 }
    );
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    payment_method_types: ["card"],
    shipping_address_collection: {
      // Dynamic, admin-configured country codes vs. Stripe's closed literal
      // union type for this field — validated at runtime by parseCountryCodes()
      // (2-letter alpha codes only) rather than against Stripe's exact list.
      allowed_countries: shippingConfig.allowedCountries as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
    },
    shipping_options: shippingConfig.shippingOptions,
    metadata: {
      cart: JSON.stringify(parsed.data.items).slice(0, 490),
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
