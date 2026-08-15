"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatPrice } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const router = useRouter();
  const mounted = useMounted();
  const [error, setError] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!mounted || started.current) return;
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    started.current = true;
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Unable to start checkout.");
        window.location.href = data.url;
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to start checkout.");
        started.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (error) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-serif-display text-2xl text-charcoal">Checkout is unavailable</h1>
        <p className="max-w-md text-sm text-muted">{error}</p>
        <ButtonLink href="/cart">Back to Bag</ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-serif-display text-2xl text-charcoal">
        {mounted ? "Redirecting to secure checkout…" : "Preparing your order…"}
      </h1>
      {mounted && items.length > 0 && (
        <p className="text-sm text-muted">Subtotal: {formatPrice(cartSubtotal(items))}</p>
      )}
    </div>
  );
}
