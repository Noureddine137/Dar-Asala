import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured } from "@/lib/stripe/client";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing signature");
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const existing = await prisma.order.findUnique({ where: { stripeSessionId: session.id } });
    if (existing) {
      return NextResponse.json({ received: true });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price.product"],
    });

    let cartMeta: { variantId: string; quantity: number }[] = [];
    try {
      cartMeta = JSON.parse(session.metadata?.cart ?? "[]");
    } catch {
      cartMeta = [];
    }

    const orderNumber = `DA-${Date.now().toString(36).toUpperCase()}`;
    const subtotal = (session.amount_subtotal ?? 0) / 100;
    const total = (session.amount_total ?? 0) / 100;
    const shipping = (session.shipping_cost?.amount_total ?? 0) / 100;

    // Integrity check: does the address Stripe actually collected match the
    // destination the customer selected on our site before Checkout (stored
    // in session metadata by /api/checkout)? A mismatch doesn't change what
    // was charged — Stripe's allowed_countries already constrained the
    // address field to the matched zone's countries, so this mainly catches
    // edge cases — but it's flagged for manual review rather than ignored.
    // Payment already succeeded, so the order is still recorded normally;
    // never auto-cancelled or refunded.
    const selectedCountry = session.metadata?.shippingCountry ?? null;
    const actualCountry = session.customer_details?.address?.country ?? null;
    // Storefront locale active when the order was placed (see
    // Order.locale) — stored so a future transactional-email system could
    // send confirmations in the customer's language.
    const locale = session.metadata?.locale ?? null;
    const shippingCountryMismatch = Boolean(selectedCountry && actualCountry && selectedCountry !== actualCountry);
    if (shippingCountryMismatch) {
      console.warn(
        `[stripe-webhook] shipping country mismatch on session ${session.id}: selected=${selectedCountry} actual=${actualCountry}`
      );
    }

    const orderItemsData = await Promise.all(
      lineItems.data.map(async (li) => {
        const product = li.price?.product as Stripe.Product | undefined;
        const variantId = product?.metadata?.variantId ?? cartMeta.find(() => true)?.variantId;
        const variant = variantId ? await prisma.productVariant.findUnique({ where: { id: variantId } }) : null;
        return {
          productId: variant?.productId ?? product?.metadata?.productId ?? "",
          variantId: variant?.id ?? null,
          name: li.description ?? product?.name ?? "Item",
          variantLabel: variant ? `${variant.color} / ${variant.size}` : null,
          unitPrice: (li.price?.unit_amount ?? 0) / 100,
          quantity: li.quantity ?? 1,
          imageUrl: product?.images?.[0] ?? null,
        };
      })
    );

    const validItems = orderItemsData.filter((i) => i.productId);
    if (validItems.length > 0) {
      await prisma.order.create({
        data: {
          orderNumber,
          email: session.customer_details?.email ?? "unknown@darasala.example",
          status: "PAID",
          subtotal,
          shipping,
          total,
          currency: (session.currency ?? "eur").toUpperCase(),
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          shippingAddress: session.customer_details?.address
            ? JSON.parse(JSON.stringify(session.customer_details.address))
            : undefined,
          shippingCountry: actualCountry,
          selectedShippingCountry: selectedCountry,
          shippingCountryMismatch,
          locale,
          items: { create: validItems },
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
