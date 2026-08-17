import type { Metadata } from "next";
import { Hero } from "@/components/homepage/hero";
import { TrustStrip } from "@/components/homepage/trust-strip";
import { CategoryRail } from "@/components/homepage/category-rail";
import { FeaturedProducts } from "@/components/homepage/featured-products";
import { BrandStory } from "@/components/homepage/brand-story";
import { Craftsmanship } from "@/components/homepage/craftsmanship";
import { CustomOrders } from "@/components/homepage/custom-orders";
import { Editorial } from "@/components/homepage/editorial";
import { Testimonials } from "@/components/homepage/testimonials";
import { Newsletter } from "@/components/homepage/newsletter";
import { getFeaturedProducts } from "@/lib/commerce/products";
import { getAllCollections } from "@/lib/commerce/collections";
import { buildAlternates } from "@/lib/utils/seo";
import type { Locale } from "@/i18n/routing";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildAlternates(locale as Locale, "") };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const [featured, collections] = await Promise.all([
    getFeaturedProducts(locale as Locale, 8),
    getAllCollections(locale as Locale),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryRail collections={collections} />
      <FeaturedProducts products={featured} />
      <BrandStory />
      <Craftsmanship />
      <CustomOrders />
      <Editorial />
      <Testimonials />
      <Newsletter />
    </>
  );
}
