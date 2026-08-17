"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";

export type ShippingCountryOption = { code: string; region: string };

export type ShippingQuoteResult =
  | {
      ok: true;
      region: string;
      estimate: string;
      carrier: string | null;
      shipping: number;
      freeThreshold: number | null;
      isFree: boolean;
    }
  | { ok: false; error: string };

/**
 * Backs the cart's destination selector and shipping estimate. `subtotal` is
 * only used to render a display estimate — the actual charge is always
 * recomputed server-side (from server-verified cart contents) when Checkout
 * is created, using the same getShippingQuoteForCountry() the /api/shipping/
 * quote endpoint calls, so the two can never disagree.
 */
export function useShippingQuote(subtotal: number) {
  const country = useCartStore((s) => s.shippingCountry);
  const setCountryRaw = useCartStore((s) => s.setShippingCountry);
  const [countries, setCountries] = useState<ShippingCountryOption[] | null>(null);
  const [quote, setQuote] = useState<ShippingQuoteResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/shipping/countries")
      .then((r) => r.json())
      .then((d) => setCountries(d.countries ?? []))
      .catch(() => setCountries([]));
  }, []);

  useEffect(() => {
    if (!country) return;
    let cancelled = false;
    fetch(`/api/shipping/quote?country=${encodeURIComponent(country)}&subtotal=${subtotal}`)
      .then((r) => r.json())
      .then((d: ShippingQuoteResult) => {
        if (!cancelled) setQuote(d);
      })
      .catch(() => {
        if (!cancelled) setQuote({ ok: false, error: "Unable to calculate shipping right now." });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [country, subtotal]);

  // Loading is flipped on here (a plain event-handler call, not inside the
  // effect above) so selecting a country shows an immediate "calculating"
  // state; the effect's fetch turns it back off when the quote resolves.
  function setCountry(code: string | null) {
    setCountryRaw(code);
    setLoading(Boolean(code));
  }

  return {
    country,
    setCountry,
    countries,
    quote: country ? quote : null,
    loading: country ? loading : false,
  };
}
