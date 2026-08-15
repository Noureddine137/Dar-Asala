import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
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

  const lineItems = parsed.data.items.flatMap((item) => {
    const variant = variants.find((v) => v.id === item.variantId);
    if (!variant) return [];
    const unitPrice = variant.priceOverride ? Number(variant.priceOverride) : Number(variant.product.price);
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

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["DE", "FR", "NL", "BE", "AT", "ES", "IT", "PT", "LU", "IE", "GB", "US", "CH"],
    },
    shipping_options: [
      { shipping_rate_data: { type: "fixed_amount", fixed_amount: { amount: 0, currency: "eur" }, display_name: "Standard Shipping (5-8 days)" } },
    ],
    metadata: {
      cart: JSON.stringify(parsed.data.items).slice(0, 490),
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
  });

  return NextResponse.json({ url: session.url });
}
