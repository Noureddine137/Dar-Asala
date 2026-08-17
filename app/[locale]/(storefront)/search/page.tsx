import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ProductGrid } from "@/components/collection/product-grid";
import { searchProducts } from "@/lib/commerce/products";

type Props = { searchParams: Promise<{ q?: string }> };

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? await searchProducts(q) : [];

  return (
    <div>
      <PageHeader title="Search" breadcrumb={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className="container-page pb-16 md:pb-24">
        <form action="/search" method="GET" className="mb-10 flex max-w-lg items-center gap-3 border-b border-charcoal/30 pb-2">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search bags, colors, categories…"
            className="w-full bg-transparent text-base text-charcoal placeholder:text-muted focus:outline-none"
          />
        </form>

        {q.trim() && (
          <p className="mb-8 text-sm text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
        )}

        {q.trim() ? (
          <ProductGrid products={results} />
        ) : (
          <p className="text-sm text-muted">Try searching for a bag style, color or category.</p>
        )}
      </div>
    </div>
  );
}
