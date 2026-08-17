"use client";

import { useMemo } from "react";
import { FreeShippingBar } from "./free-shipping-bar";
import { formatPrice } from "@/lib/utils/format";
import type { ShippingCountryOption, ShippingQuoteResult } from "@/lib/hooks/use-shipping-quote";

let regionNames: Intl.DisplayNames | null = null;
function countryName(code: string) {
  if (typeof Intl === "undefined" || typeof Intl.DisplayNames === "undefined") return code;
  regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
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
  const grouped = useMemo(() => {
    const byRegion = new Map<string, ShippingCountryOption[]>();
    for (const c of countries ?? []) {
      const list = byRegion.get(c.region) ?? [];
      list.push(c);
      byRegion.set(c.region, list);
    }
    return Array.from(byRegion.entries());
  }, [countries]);

  return (
    <div>
      <label htmlFor="shipping-country" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted">
        Shipping To
      </label>
      <select
        id="shipping-country"
        className="input"
        value={country ?? ""}
        onChange={(e) => setCountry(e.target.value || null)}
        disabled={!countries}
      >
        <option value="" disabled>
          {countries ? "Select your country" : "Loading countries…"}
        </option>
        {grouped.map(([region, opts]) => (
          <optgroup key={region} label={region}>
            {opts.map((c) => (
              <option key={c.code} value={c.code}>
                {countryName(c.code)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {country && (
        <div className="mt-3">
          {loading || !quote ? (
            <p className="text-xs text-muted">Calculating shipping…</p>
          ) : quote.ok ? (
            quote.isFree ? (
              <p className="text-xs font-medium text-olive">Free shipping to this destination</p>
            ) : (
              <>
                <p className="text-xs text-charcoal/80">
                  Shipping: <span className="font-medium text-charcoal">{formatPrice(quote.shipping)}</span> ·{" "}
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
            <p className="text-xs text-terracotta">{quote.error}</p>
          )}
        </div>
      )}
    </div>
  );
}
