"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { colorSwatchHex, formatPrice } from "@/lib/utils/format";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import type { ProductCardDTO } from "@/lib/commerce/types";

export function ProductCard({
  product,
  priority = false,
}: {
  product: ProductCardDTO;
  priority?: boolean;
}) {
  const isWishlisted = useWishlistStore((s) => s.has(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-sm bg-cream"
      >
        {product.primaryImage && (
          <Image
            src={product.primaryImage.url}
            alt={product.primaryImage.alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
            className={cn(
              "object-cover transition-opacity duration-500",
              product.hoverImage && "md:group-hover:opacity-0"
            )}
          />
        )}
        {product.hoverImage && (
          <Image
            src={product.hoverImage.url}
            alt={product.hoverImage.alt}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
            className="hidden object-cover opacity-0 transition-opacity duration-500 md:block md:group-hover:opacity-100"
          />
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-sm bg-ivory/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-charcoal">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="rounded-sm bg-terracotta/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-ivory">
              Best Seller
            </span>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          toggleWishlist(product.slug);
        }}
        aria-pressed={isWishlisted}
        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-charcoal transition-transform hover:scale-105"
      >
        <Heart
          className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-terracotta text-terracotta")}
        />
      </button>

      <Link href={`/products/${product.slug}`} className="mt-3 flex flex-1 flex-col">
        <h3 className="font-serif-display text-lg leading-snug text-charcoal">{product.name}</h3>
        <p className="mt-0.5 line-clamp-1 text-sm text-muted">{product.shortDescription}</p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-charcoal">{formatPrice(product.price, product.currency)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
          </div>
          {product.colors.length > 0 && (
            <div className="flex items-center gap-1" aria-hidden="true">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c}
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-sand"
                  style={{ backgroundColor: colorSwatchHex(c) }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
