"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart-store";
import { ButtonLink } from "@/components/ui/button-link";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-page flex flex-col items-center gap-4 py-24 text-center">
      <CheckCircle2 className="h-12 w-12 text-olive" />
      <h1 className="font-serif-display text-3xl text-charcoal">{t("orderSuccessTitle")}</h1>
      <p className="max-w-md text-sm text-muted">{t("orderSuccessBody")}</p>
      <ButtonLink href="/collections/all" className="mt-2">
        {tCart("continueShopping")}
      </ButtonLink>
    </div>
  );
}
