import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/collection/product-grid";
import { searchProducts } from "@/lib/commerce/products";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchProducts(q, locale as Locale) : [];
  const [t, tNav, tGeneral] = await Promise.all([
    getTranslations({ locale, namespace: "search" }),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "general" }),
  ]);

  return (
    <div>
      <PageHeader title={tNav("search")} breadcrumb={[{ label: tNav("home"), href: "/" }, { label: tNav("search") }]} />
      <div className="container-page pb-16 md:pb-24">
        <form action="/search" method="GET" className="mb-10 flex max-w-lg items-center gap-3 border-b border-charcoal/30 pb-2">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-base text-charcoal placeholder:text-muted focus:outline-none"
          />
        </form>

        {q.trim() && (
          <p className="mb-8 text-sm text-muted">
            {tGeneral("results", { count: results.length })} — &ldquo;{q}&rdquo;
          </p>
        )}

        {q.trim() ? <ProductGrid products={results} /> : <p className="text-sm text-muted">{t("searchHint")}</p>}
      </div>
    </div>
  );
}
