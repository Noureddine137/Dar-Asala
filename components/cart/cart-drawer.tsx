"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, ShoppingBag, Lock, RotateCcw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useUIStore } from "@/lib/store/ui-store";
import { useCartStore, cartSubtotal } from "@/lib/store/cart-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useShippingQuote } from "@/lib/hooks/use-shipping-quote";
import { CartLineItem } from "./cart-line-item";
import { ShippingCountrySelect } from "./shipping-country-select";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { formatPrice } from "@/lib/utils/format";
import type { Locale } from "@/i18n/routing";

export function CartDrawer() {
  const locale = useLocale() as Locale;
  const t = useTranslations("cart");
  const overlay = useUIStore((s) => s.overlay);
  const close = useUIStore((s) => s.close);
  const open = overlay === "cart";
  const items = useCartStore((s) => s.items);
  const mounted = useMounted();
  const router = useRouter();

  const subtotal = mounted ? cartSubtotal(items) : 0;
  const displayItems = mounted ? items : [];
  const { country, setCountry, countries, quote, loading } = useShippingQuote(subtotal);
  const canCheckout = Boolean(quote?.ok);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/40 data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[92%] max-w-md flex-col bg-ivory shadow-xl focus:outline-none data-[state=open]:animate-slide-in">
          <div className="flex items-center justify-between border-b border-sand/70 px-5 py-4">
            <Dialog.Title className="font-serif-display text-xl text-charcoal">
              {displayItems.length > 0 ? t("yourBagWithCount", { count: displayItems.length }) : t("yourBag")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label={t("closeCart")} className="flex h-9 w-9 items-center justify-center text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{t("yourBag")}</Dialog.Description>

          {displayItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <ShoppingBag className="h-10 w-10 text-muted" />
              <p className="text-charcoal">{t("emptyBag")}</p>
              <ButtonLink href="/collections/all" onClick={close} variant="secondary" size="sm">
                {t("shopCollection")}
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="flex-1 divide-y divide-sand/60 overflow-y-auto px-5">
                {displayItems.map((item) => (
                  <CartLineItem key={item.variantId} item={item} onNavigate={close} />
                ))}
              </div>
              <div
                className="space-y-4 border-t border-sand/70 px-5 pt-5"
                style={{ paddingBottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 1rem))" }}
              >
                <ShippingCountrySelect
                  subtotal={subtotal}
                  country={country}
                  setCountry={setCountry}
                  countries={countries}
                  quote={quote}
                  loading={loading}
                />
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">{t("subtotal")}</span>
                    <span className="font-medium text-charcoal">{formatPrice(subtotal, "EUR", locale)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">{t("shipping")}</span>
                    <span className="text-charcoal/80">
                      {quote?.ok ? (quote.isFree ? t("free") : formatPrice(quote.shipping, "EUR", locale)) : t("selectDestination")}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    close();
                    router.push("/checkout");
                  }}
                  disabled={!canCheckout}
                  className="w-full"
                  size="lg"
                >
                  {t("checkout")}
                </Button>
                <ButtonLink href="/cart" onClick={close} variant="ghost" className="w-full">
                  {t("viewBag")}
                </ButtonLink>
                <div className="flex items-center justify-center gap-6 border-t border-sand/70 pt-4 text-center text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> {t("secureCheckout")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" /> {t("returns14Day")}
                  </span>
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
