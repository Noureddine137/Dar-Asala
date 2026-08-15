import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { ProductAccordions } from "@/components/product/product-accordions";
import { ProductStory } from "@/components/product/product-story";
import { ReviewsSection } from "@/components/product/reviews-section";
import { RelatedProducts } from "@/components/product/related-products";
import { StickyMobileCartBar } from "@/components/product/sticky-cart-bar";
import { getProductBySlug, getRelatedProducts } from "@/lib/commerce/products";
import { jsonLdScript } from "@/lib/utils/json-ld";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.primaryImage ? [{ url: product.primaryImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: product.images.map((img) => `${siteUrl}${img.url}`),
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: "Dar Asala" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: product.variants.some((v) => v.stock > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "All Bags", item: `${siteUrl}/collections/all` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${siteUrl}/products/${product.slug}` },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd) }} />

      <div className="container-page py-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "All Bags", href: "/collections/all" },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container-page grid gap-10 pb-14 md:grid-cols-2 md:gap-16 md:pb-20">
        <ProductGallery images={product.images} productName={product.name} />
        <PurchasePanel product={product} />
      </div>

      <div className="container-page">
        <ProductAccordions product={product} />
      </div>

      <ProductStory product={product} />
      <ReviewsSection reviews={product.reviews} averageRating={product.averageRating} reviewCount={product.reviewCount} />
      <RelatedProducts title="You May Also Like" products={related} />

      <StickyMobileCartBar price={product.price} currency={product.currency} />
    </div>
  );
}
