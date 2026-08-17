import Image from "next/image";
import { ARTISAN_PROCESS_CLAIM, BRAND_ORIGIN_COUNTRY, PRODUCTION_MODEL_CLAIM } from "@/lib/content/business-claims";
import type { ProductDetailDTO } from "@/lib/commerce/types";

export function ProductStory({ product }: { product: ProductDetailDTO }) {
  const image = product.images.find((img) => img.kind === "lifestyle") ?? product.images[3] ?? product.images[0];

  return (
    <section className="border-t border-sand/70 bg-cream py-14 md:py-20">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          {image && (
            <Image src={image.url} alt={image.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          )}
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            Made by Hand in {BRAND_ORIGIN_COUNTRY}
          </p>
          <h2 className="font-serif-display text-2xl leading-tight text-charcoal md:text-3xl">
            {product.story ?? "Cut, stitched and finished by hand, one piece at a time."}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/80">
            Every {product.name} begins as a single hide, hand-selected for grain and character. It is{" "}
            {ARTISAN_PROCESS_CLAIM}, produced {PRODUCTION_MODEL_CLAIM} rather than mass runs — so
            quality never gets diluted by volume.
          </p>
        </div>
      </div>
    </section>
  );
}
