import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import type { ProductCardDTO } from "@/lib/commerce/types";

export function FeaturedProducts({ products }: { products: ProductCardDTO[] }) {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-page mb-8 flex items-end justify-between md:mb-10">
        <div>
          <h2 className="font-serif-display text-3xl text-charcoal md:text-4xl">The Atelier Selection</h2>
          <p className="mt-2 max-w-md text-sm text-muted md:text-base">Featured pieces, chosen for the season.</p>
        </div>
        <ButtonLink href="/collections/all" variant="ghost" size="sm" className="hidden md:inline-flex">
          View All
        </ButtonLink>
      </div>

      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 2} />
        ))}
      </div>

      <div className="container-page mt-10 md:hidden">
        <ButtonLink href="/collections/all" variant="secondary" className="w-full">
          View All
        </ButtonLink>
      </div>
    </section>
  );
}
