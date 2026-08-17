import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductGallery } from "@/components/product/gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { TrustList } from "@/components/product/trust-list";
import { CustomOrderBox } from "@/components/product/custom-order-box";
import { ProductStory } from "@/components/product/product-story";
import { HowItWorks } from "@/components/product/how-it-works";
import { DetailsTiles } from "@/components/product/details-tiles";
import { ProductAccordions } from "@/components/product/product-accordions";
import { BeforeYouOrder } from "@/components/product/before-you-order";
import { ShippingInfo } from "@/components/product/shipping-info";
import { ReviewsSection } from "@/components/product/reviews-section";
import { RelatedProducts } from "@/components/product/related-products";
import { getTranslations } from "next-intl/server";
import { getProductBySlug, getRelatedProducts, getStoreReviewSummary } from "@/lib/commerce/products";
import { getLocalizedStoreSettings } from "@/lib/content/store-settings";
import { jsonLdScript } from "@/lib/utils/json-ld";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ slug: string; locale: string }> };

export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale as Locale);
  if (!product) return {};
  return {
    title: product.seoTitle,
    description: product.seoDescription,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: product.seoTitle,
      description: product.seoDescription,
      images: product.primaryImage ? [{ url: product.primaryImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug, locale } = await params;
  const product = await getProductBySlug(slug, locale as Locale);
  if (!product) notFound();

  const [related, storeReviews, settings, t, tNav] = await Promise.all([
    getRelatedProducts(product, locale as Locale),
    getStoreReviewSummary(locale as Locale),
    getLocalizedStoreSettings(locale as Locale),
    getTranslations({ locale, namespace: "product" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

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
      { "@type": "ListItem", position: 1, name: tNav("home"), item: siteUrl },
      { "@type": "ListItem", position: 2, name: tNav("allBags"), item: `${siteUrl}/collections/all` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${siteUrl}/products/${product.slug}` },
    ],
  };

  return (
    <div className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbLd) }} />

      <div className="container-page pt-5">
        <Breadcrumb
          items={[
            { label: tNav("home"), href: "/" },
            { label: tNav("allBags"), href: "/collections/all" },
            { label: product.name },
          ]}
        />
      </div>

      {/* Gallery + purchase panel */}
      <div className="container-page grid grid-cols-1 gap-8 pb-10 pt-4 md:grid-cols-2 md:gap-14 md:pb-16">
        <ProductGallery images={product.images} productName={product.name} />
        <PurchasePanel product={product} />
      </div>

      {/* Trust / reassurance list */}
      <div className="container-page border-t border-sand py-10 md:py-14">
        <TrustList product={product} />
      </div>

      {/* Custom order box */}
      <div className="container-page pb-10 md:pb-14">
        <CustomOrderBox productName={product.name} />
      </div>

      {/* Lifestyle / craft imagery */}
      <ProductStory product={product} />

      {/* How it works */}
      <div className="container-page py-10 md:py-14">
        <HowItWorks />
      </div>

      {/* Product details tiles */}
      <div className="container-page pb-10 md:pb-14">
        <DetailsTiles product={product} />
      </div>

      {/* Accordions: description, craftsmanship, materials, dimensions, care, shipping & returns */}
      <div className="container-page border-t border-sand pt-2">
        <ProductAccordions
          product={product}
          originCountry={settings.brandOriginCountry}
          artisanProcessClaim={settings.artisanProcessClaim}
          freeShippingThreshold={Number(settings.freeShippingThreshold)}
        />
      </div>

      {/* Before you order */}
      <div className="container-page py-10 md:py-14">
        <BeforeYouOrder />
      </div>

      {/* Shipping */}
      <div className="container-page pb-12 md:pb-16">
        <ShippingInfo />
      </div>

      <ReviewsSection
        reviews={product.reviews}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
        storeReviews={storeReviews.reviews}
        storeAverageRating={storeReviews.averageRating}
        storeReviewCount={storeReviews.reviewCount}
      />

      <RelatedProducts title={t("youMayAlsoLike")} products={related} />
    </div>
  );
}
