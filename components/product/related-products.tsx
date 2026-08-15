import { ProductCard } from "@/components/product/product-card";
import type { ProductCardDTO } from "@/lib/commerce/types";

export function RelatedProducts({ title, products }: { title: string; products: ProductCardDTO[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-sand/70 py-14 md:py-20">
      <div className="container-page mb-8">
        <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">{title}</h2>
      </div>
      <div className="container-page no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible">
        {products.map((product) => (
          <div key={product.id} className="w-[48vw] shrink-0 snap-start md:w-auto">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
