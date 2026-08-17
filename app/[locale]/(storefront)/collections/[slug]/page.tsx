import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SortSelect } from "@/components/collection/sort-select";
import { CollectionFilterSidebar, CollectionFilterTrigger } from "@/components/collection/collection-filters";
import { ProductGrid } from "@/components/collection/product-grid";
import { getCollectionBySlug, type SortOption } from "@/lib/commerce/collections";
import { buildAlternates, OG_LOCALES, localizedUrl } from "@/lib/utils/seo";
import type { Locale } from "@/i18n/routing";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 60;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const safeLocale = locale as Locale;
  const data = await getCollectionBySlug(slug, safeLocale);
  if (!data) return {};
  return {
    title: data.collection.seoTitle,
    description: data.collection.seoDescription,
    alternates: buildAlternates(safeLocale, `/collections/${slug}`),
    openGraph: {
      title: data.collection.seoTitle,
      description: data.collection.seoDescription,
      url: localizedUrl(safeLocale, `/collections/${slug}`),
      locale: OG_LOCALES[safeLocale],
    },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug, locale } = await params;
  const sp = await searchParams;

  const sort = (typeof sp.sort === "string" ? sp.sort : "featured") as SortOption;
  const filters = {
    color: toArray(sp.color),
    size: toArray(sp.size),
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sort,
  };

  const data = await getCollectionBySlug(slug, locale as Locale, filters);
  if (!data) notFound();

  const { collection, products } = data;
  const t = await getTranslations({ locale, namespace: "general" });

  return (
    <div className="bg-cream">
      <div className="container-page pb-6 pt-8 md:pt-12">
        <h1 className="font-serif-display text-3xl text-charcoal md:text-4xl">{collection.title}</h1>
        <p className="mt-2 max-w-xl text-sm text-charcoal/75 md:text-base">{collection.description}</p>
        <p className="mt-3 text-xs text-muted md:text-sm">{t("productCount", { count: products.length })}</p>

        <div className="mt-5 flex items-center justify-between gap-3 border-y border-sand py-3">
          <CollectionFilterTrigger />
          <SortSelect current={sort} />
        </div>

        <div className="mt-6 flex gap-10 pb-16 md:mt-8 md:pb-24">
          <CollectionFilterSidebar />
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
