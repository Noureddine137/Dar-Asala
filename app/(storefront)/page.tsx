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

export const revalidate = 60;

export default async function HomePage() {
  const [featured, collections] = await Promise.all([getFeaturedProducts(8), getAllCollections()]);

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
