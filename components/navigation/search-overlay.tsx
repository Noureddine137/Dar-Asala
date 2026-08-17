"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useUIStore } from "@/lib/store/ui-store";
import { formatPrice } from "@/lib/utils/format";
import type { ProductCardDTO } from "@/lib/commerce/types";

export function SearchOverlay() {
  const overlay = useUIStore((s) => s.overlay);
  const close = useUIStore((s) => s.close);
  const open = overlay === "search";
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductCardDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const locale = useLocale();
  const t = useTranslations("search");

  useEffect(() => {
    if (!query.trim()) return;
    const handle = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}&locale=${locale}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(handle);
  }, [query, locale]);

  function handleQueryChange(value: string) {
    setQuery(value);
    setLoading(Boolean(value.trim()));
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      close();
      setQuery("");
      setResults([]);
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/40 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className="fixed inset-x-0 top-0 z-50 max-h-[85vh] overflow-y-auto bg-ivory shadow-xl focus:outline-none data-[state=open]:animate-fade-in"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <Dialog.Title className="sr-only">{t("search")}</Dialog.Title>
          <Dialog.Description className="sr-only">{t("searchProducts")}</Dialog.Description>
          <div className="container-page flex items-center gap-3 border-b border-sand/70 py-5">
            <Search className="h-5 w-5 shrink-0 text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              type="search"
              placeholder={t("searchPlaceholder")}
              className="w-full bg-transparent font-serif-display text-xl text-charcoal placeholder:text-muted focus:outline-none md:text-2xl"
            />
            <Dialog.Close asChild>
              <button aria-label={t("closeSearch")} className="flex h-9 w-9 shrink-0 items-center justify-center text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="container-page py-6">
            {loading && <p className="text-sm text-muted">{t("searching")}</p>}
            {!loading && query.trim() && results.length === 0 && (
              <p className="text-sm text-muted">{t("noProductsFound", { query })}</p>
            )}
            {query.trim() && results.length > 0 && (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link href={`/products/${product.slug}`} onClick={close} className="block">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-cream">
                        {product.primaryImage && (
                          <Image
                            src={product.primaryImage.url}
                            alt={product.primaryImage.alt}
                            fill
                            sizes="25vw"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <p className="mt-2 font-serif-display text-base text-charcoal">{product.name}</p>
                      <p className="text-sm text-muted">{formatPrice(product.price, product.currency)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
