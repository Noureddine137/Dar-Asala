"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils/format";
import type { Locale } from "@/i18n/routing";

export function FreeShippingBar({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("cart");
  const remaining = Math.max(threshold - subtotal, 0);
  const progress = Math.min((subtotal / threshold) * 100, 100);

  return (
    <div>
      <p className="text-xs text-muted">
        {remaining > 0 ? (
          t.rich("addMoreForFreeShipping", {
            amount: formatPrice(remaining, "EUR", locale),
            strong: (chunks) => <span className="font-medium text-charcoal">{chunks}</span>,
          })
        ) : (
          <span className="font-medium text-olive">{t("freeShippingUnlocked")}</span>
        )}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand/60">
        <div className="h-full rounded-full bg-olive transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
