import { productDetailTiles } from "@/lib/content/product-details";
import { getStoreSettings } from "@/lib/content/store-settings";
import type { ProductDetailDTO } from "@/lib/commerce/types";

export async function DetailsTiles({ product }: { product: ProductDetailDTO }) {
  const settings = await getStoreSettings();
  const tiles = productDetailTiles(product, settings.brandOriginCountry);

  return (
    <div>
      <p className="mb-4 font-serif-display text-xl text-charcoal md:text-2xl">Product Details</p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-sm border border-sand bg-ivory p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted">{tile.label}</p>
            <p className="mt-1.5 text-sm leading-snug text-charcoal">{tile.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
