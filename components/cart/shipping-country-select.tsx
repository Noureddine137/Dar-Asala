"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FreeShippingBar } from "./free-shipping-bar";
import { formatPrice } from "@/lib/utils/format";
import { INTL_LOCALE_TAGS, type Locale } from "@/i18n/routing";
import type { ShippingCountryOption, ShippingQuoteResult } from "@/lib/hooks/use-shipping-quote";

const regionNamesCache = new Map<string, Intl.DisplayNames>();
function countryName(code: string, locale: Locale) {
  if (typeof Intl === "undefined" || typeof Intl.DisplayNames === "undefined") return code;
  const tag = INTL_LOCALE_TAGS[locale];
  let regionNames = regionNamesCache.get(tag);
  if (!regionNames) {
    regionNames = new Intl.DisplayNames([tag], { type: "region" });
    regionNamesCache.set(tag, regionNames);
  }
  return regionNames.of(code) ?? code;
}

type Props = {
  subtotal: number;
  country: string | null;
  setCountry: (code: string | null) => void;
  countries: ShippingCountryOption[] | null;
  quote: ShippingQuoteResult | null;
  loading: boolean;
};

export function ShippingCountrySelect({ subtotal, country, setCountry, countries, quote, loading }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("cart");
  const grouped = useMemo(() => {
    const byRegion = new Map<string, ShippingCountryOption[]>();
    for (const c of countries ?? []) {
      const list = byRegion.get(c.region) ?? [];
      list.push(c);
      byRegion.set(c.region, list);
    }
    return Array.from(byRegion.entries());
  }, [countries]);

  const errorMessage = (error: string) => (error === "no_zone" ? t("shippingUnavailable") : t("unableToCalculateShipping"));

  return (
    <div>
      <label htmlFor="shipping-country" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        {t("shippingTo")}
      </label>
      <select
        id="shipping-country"
        className="input"
        value={country ?? ""}
        onChange={(e) => setCountry(e.target.value || null)}
        disabled={!countries}
      >
        <option value="" disabled>
          {countries ? t("selectYourCountry") : t("loadingCountries")}
        </option>
        {grouped.map(([region, opts]) => (
          <optgroup key={region} label={region}>
            {opts.map((c) => (
              <option key={c.code} value={c.code}>
                {countryName(c.code, locale)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {country && (
        <div className="mt-3">
          {loading || !quote ? (
            <p className="text-xs text-muted">{t("calculatingShipping")}</p>
          ) : quote.ok ? (
            quote.isFree ? (
              <p className="text-xs font-medium text-olive">{t("freeShippingToDestination")}</p>
            ) : (
              <>
                <p className="text-xs text-charcoal/80">
                  {t("shipping")}: <span className="font-medium text-charcoal">{formatPrice(quote.shipping, "EUR", locale)}</span> ·{" "}
                  {quote.estimate}
                </p>
                {quote.freeThreshold != null && (
                  <div className="mt-2">
                    <FreeShippingBar subtotal={subtotal} threshold={quote.freeThreshold} />
                  </div>
                )}
              </>
            )
          ) : (
            <p className="text-xs text-terracotta">{errorMessage(quote.error)}</p>
          )}
        </div>
      )}
    </div>
  );
}
