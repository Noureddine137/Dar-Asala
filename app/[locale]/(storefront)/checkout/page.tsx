"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { formatPrice } from "@/lib/utils/format";
import { ButtonLink } from "@/components/ui/button-link";
import type { Locale } from "@/i18n/routing";

export default function CheckoutPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("checkout");
  const items = useCartStore((s) => s.items);
  const shippingCountry = useCartStore((s) => s.shippingCountry);
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
    // Country is chosen on the cart page/drawer, immediately before this —
    // if it's missing (direct navigation, stale bookmark), don't guess or
    // silently default; send them back to choose one.
    if (!shippingCountry) return;

    started.current = true;
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
        country: shippingCountry,
        locale,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? t("genericError"));
        window.location.href = data.url;
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : t("genericError"));
        started.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, shippingCountry]);

  if (error) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-serif-display text-2xl text-charcoal">{t("unavailableTitle")}</h1>
        <p className="max-w-md text-sm text-muted">{error}</p>
        <ButtonLink href="/cart">{t("backToBag")}</ButtonLink>
      </div>
    );
  }

  if (mounted && items.length > 0 && !shippingCountry) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-serif-display text-2xl text-charcoal">{t("selectDestinationTitle")}</h1>
        <p className="max-w-md text-sm text-muted">{t("selectDestinationBody")}</p>
        <ButtonLink href="/cart">{t("backToBag")}</ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="font-serif-display text-2xl text-charcoal">
        {mounted ? t("redirecting") : t("preparingOrder")}
      </h1>
      {mounted && items.length > 0 && (
        <p className="text-sm text-muted">{t("subtotalLabel", { amount: formatPrice(cartSubtotal(items), "EUR", locale) })}</p>
      )}
    </div>
  );
}
