import { ProductCard } from "@/components/product/product-card";
import type { ProductCardDTO } from "@/lib/commerce/types";

export function RelatedProducts({ title, products }: { title: string; products: ProductCardDTO[] }) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-sand/70 py-14 md:py-20">
      <div className="container-page mb-8">
        <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">{title}</h2>
      </div>
      {/* Mobile is a snap-scrolling peek carousel — cards are intentionally
          wider than the viewport so the next one hints at being scrollable.
          The fade mask keeps that peeking edge from reading as an abrupt
          clip through a swatch row; md+ drops it for the full static grid. */}
      <div
        className="no-scrollbar container-page flex snap-x gap-4 overflow-x-auto pb-2 [-webkit-mask-image:linear-gradient(to_right,black_calc(100%-1.75rem),transparent)] [mask-image:linear-gradient(to_right,black_calc(100%-1.75rem),transparent)] md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:[-webkit-mask-image:none] md:[mask-image:none]"
      >
        {products.map((product) => (
          <div key={product.id} className="w-[45vw] shrink-0 snap-start md:w-auto">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
