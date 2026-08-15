import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SortSelect } from "@/components/collection/sort-select";
import { CollectionFilterSidebar, CollectionFilterTrigger } from "@/components/collection/collection-filters";
import { ProductGrid } from "@/components/collection/product-grid";
import { getCollectionBySlug, type SortOption } from "@/lib/commerce/collections";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const revalidate = 60;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCollectionBySlug(slug);
  if (!data) return {};
  return {
    title: data.collection.title,
    description: data.collection.description,
    alternates: { canonical: `/collections/${slug}` },
    openGraph: { title: data.collection.title, description: data.collection.description },
  };
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const sort = (typeof sp.sort === "string" ? sp.sort : "featured") as SortOption;
  const filters = {
    color: toArray(sp.color),
    size: toArray(sp.size),
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sort,
  };

  const data = await getCollectionBySlug(slug, filters);
  if (!data) notFound();

  const { collection, products } = data;

  return (
    <div>
      <div className="relative flex h-48 items-end overflow-hidden bg-charcoal md:h-64">
        <Image
          src={collection.heroImage}
          alt={collection.title}
          fill
          sizes="100vw"
          className="object-cover opacity-70"
          priority
        />
        <div className="container-page relative z-10 pb-6 md:pb-8">
          <h1 className="font-serif-display text-3xl text-ivory md:text-4xl">{collection.title}</h1>
        </div>
      </div>

      <div className="container-page py-8 md:py-12">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/collections/all" },
            { label: collection.title },
          ]}
        />

        <p className="mt-4 max-w-2xl text-sm text-charcoal/80 md:text-base">{collection.description}</p>

        <div className="mt-6 flex items-center justify-between border-y border-sand/70 py-4">
          <p className="text-sm text-muted">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
          <div className="flex items-center gap-3">
            <CollectionFilterTrigger />
            <SortSelect current={sort} />
          </div>
        </div>

        <div className="mt-8 flex gap-10">
          <CollectionFilterSidebar />
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
