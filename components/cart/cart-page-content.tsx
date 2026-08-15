"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { CartLineItem } from "./cart-line-item";
import { FreeShippingBar } from "./free-shipping-bar";
import { ButtonLink, Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_RATE } from "@/lib/config";

export function CartPageContent() {
  const items = useCartStore((s) => s.items);
  const mounted = useMounted();
  const router = useRouter();

  const displayItems = mounted ? items : [];
  const subtotal = cartSubtotal(displayItems);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_RATE;
  const total = subtotal + shipping;

  if (mounted && displayItems.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-muted" />
        <h1 className="font-serif-display text-2xl text-charcoal">Your bag is empty</h1>
        <p className="max-w-sm text-sm text-muted">
          Explore the collection to find your next handcrafted piece.
        </p>
        <ButtonLink href="/collections/all" className="mt-2">
          Shop the Collection
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-serif-display text-3xl text-charcoal md:text-4xl">Your Bag</h1>

      <div className="mt-8 grid gap-12 md:grid-cols-[1fr_360px]">
        <div className="divide-y divide-sand/60 border-y border-sand/70">
          {displayItems.map((item) => (
            <CartLineItem key={item.variantId} item={item} />
          ))}
        </div>

        <div className="h-fit space-y-6 rounded-sm bg-cream p-6">
          <FreeShippingBar subtotal={subtotal} />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Shipping</span>
              <span className="text-charcoal">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-sand/70 pt-2 text-base font-medium">
              <span className="text-charcoal">Total</span>
              <span className="text-charcoal">{formatPrice(total)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full" onClick={() => router.push("/checkout")}>
            Proceed to Checkout
          </Button>
          <ButtonLink href="/collections/all" variant="ghost" className="w-full">
            Continue Shopping
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
