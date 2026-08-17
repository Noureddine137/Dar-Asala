"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { ButtonLink } from "@/components/ui/button-link";

export default function CheckoutSuccessPage() {
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <CheckCircle2 className="h-12 w-12 text-olive" />
      <h1 className="font-serif-display text-3xl text-charcoal">Thank you for your order</h1>
      <p className="max-w-md text-sm text-muted">
        Your order has been placed. A confirmation email is on its way, and our artisans will begin
        preparing your piece shortly.
      </p>
      <ButtonLink href="/collections/all" className="mt-2">
        Continue Shopping
      </ButtonLink>
    </div>
  );
}
