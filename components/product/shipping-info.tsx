import { getLocale, getTranslations } from "next-intl/server";
import { getShippingZonesForDisplay } from "@/lib/commerce/shipping";
import { formatPrice } from "@/lib/utils/format";
import type { Locale } from "@/i18n/routing";

export async function ShippingInfo() {
  const locale = (await getLocale()) as Locale;
  const [zones, t] = await Promise.all([getShippingZonesForDisplay(locale), getTranslations("product")]);

  if (zones.length === 0) return null;

  return (
    <div>
      <p className="mb-4 font-serif-display text-xl text-charcoal md:text-2xl">{t("shippingTitle")}</p>
      <div className="divide-y divide-sand rounded-sm border border-sand bg-ivory">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-charcoal">{z.region}</p>
              <p className="text-xs text-muted">
                {z.estimate}
                {z.carrier ? ` · ${z.carrier}` : ""}
              </p>
            </div>
            <p className="shrink-0 text-right text-xs text-charcoal/80">
              {z.freeThreshold != null ? (
                <>
                  {t("freeOverThreshold", { threshold: formatPrice(z.freeThreshold, "EUR", locale) })}
                  <br />
                  <span className="text-muted">{t("otherwise", { price: formatPrice(z.price, "EUR", locale) })}</span>
                </>
              ) : (
                formatPrice(z.price, "EUR", locale)
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
