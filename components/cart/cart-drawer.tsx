"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { X, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { CartLineItem } from "./cart-line-item";
import { FreeShippingBar } from "./free-shipping-bar";
import { Button, ButtonLink } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";

export function CartDrawer() {
  const overlay = useUIStore((s) => s.overlay);
  const close = useUIStore((s) => s.close);
  const open = overlay === "cart";
  const items = useCartStore((s) => s.items);
  const mounted = useMounted();
  const router = useRouter();

  const subtotal = mounted ? cartSubtotal(items) : 0;
  const displayItems = mounted ? items : [];

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/40 data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[92%] max-w-md flex-col bg-ivory shadow-xl focus:outline-none data-[state=open]:animate-slide-in">
          <div className="flex items-center justify-between border-b border-sand/70 px-5 py-4">
            <Dialog.Title className="font-serif-display text-xl text-charcoal">
              Your Bag {displayItems.length > 0 && `(${displayItems.length})`}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Close cart" className="flex h-9 w-9 items-center justify-center text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Shopping cart</Dialog.Description>

          {displayItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBag className="h-10 w-10 text-muted" />
              <p className="text-charcoal">Your bag is empty.</p>
              <ButtonLink href="/collections/all" onClick={close} variant="secondary" size="sm">
                Shop the collection
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="flex-1 divide-y divide-sand/60 overflow-y-auto px-5">
                {displayItems.map((item) => (
                  <CartLineItem key={item.variantId} item={item} onNavigate={close} />
                ))}
              </div>
              <div className="space-y-4 border-t border-sand/70 px-5 py-5">
                <FreeShippingBar subtotal={subtotal} />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted">Shipping and taxes calculated at checkout.</p>
                <ButtonLink href="/cart" onClick={close} variant="secondary" className="w-full">
                  View Bag
                </ButtonLink>
                <Button
                  onClick={() => {
                    close();
                    router.push("/checkout");
                  }}
                  className="w-full"
                  size="lg"
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
