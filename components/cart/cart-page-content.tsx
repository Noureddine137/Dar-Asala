"use client";

import { ShoppingBag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useShippingQuote } from "@/lib/hooks/use-shipping-quote";
import { CartLineItem } from "./cart-line-item";
import { ShippingCountrySelect } from "./shipping-country-select";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { formatPrice } from "@/lib/utils/format";
import type { Locale } from "@/i18n/routing";

export function CartPageContent() {
  const locale = useLocale() as Locale;
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const mounted = useMounted();
  const router = useRouter();

  const displayItems = mounted ? items : [];
  const subtotal = cartSubtotal(displayItems);
  const { country, setCountry, countries, quote, loading } = useShippingQuote(subtotal);
  const canCheckout = Boolean(quote?.ok);
  const shipping = quote?.ok ? quote.shipping : null;
  const total = subtotal + (shipping ?? 0);

  if (mounted && displayItems.length === 0) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
        <ShoppingBag className="h-10 w-10 text-muted" />
        <h1 className="font-serif-display text-2xl text-charcoal">{t("emptyBagTitle")}</h1>
        <p className="max-w-sm text-sm text-muted">{t("emptyBagBody")}</p>
        <ButtonLink href="/collections/all" className="mt-2">
          {t("shopTheCollection")}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-serif-display text-3xl text-charcoal md:text-4xl">{t("yourBag")}</h1>

      <div className="mt-8 grid gap-12 md:grid-cols-[1fr_360px]">
        <div className="divide-y divide-sand/60 border-y border-sand/70">
          {displayItems.map((item) => (
            <CartLineItem key={item.variantId} item={item} />
          ))}
        </div>

        <div className="h-fit space-y-6 rounded-sm bg-cream p-6">
          <ShippingCountrySelect
            subtotal={subtotal}
            country={country}
            setCountry={setCountry}
            countries={countries}
            quote={quote}
            loading={loading}
          />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">{t("subtotal")}</span>
              <span className="text-charcoal">{formatPrice(subtotal, "EUR", locale)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">{t("shipping")}</span>
              <span className="text-charcoal">
                {shipping == null ? t("selectDestinationAbove") : shipping === 0 ? t("free") : formatPrice(shipping, "EUR", locale)}
              </span>
            </div>
            <div className="flex justify-between border-t border-sand/70 pt-2 text-base font-medium">
              <span className="text-charcoal">{t("total")}</span>
              <span className="text-charcoal">{formatPrice(total, "EUR", locale)}</span>
            </div>
          </div>
          <Button size="lg" className="w-full" onClick={() => router.push("/checkout")} disabled={!canCheckout}>
            {t("proceedToCheckout")}
          </Button>
          <ButtonLink href="/collections/all" variant="ghost" className="w-full">
            {t("continueShopping")}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
