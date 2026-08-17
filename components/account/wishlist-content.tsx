"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { ProductGrid } from "@/components/collection/product-grid";
import { ButtonLink } from "@/components/ui/button-link";
import type { ProductCardDTO } from "@/lib/commerce/types";

export function WishlistContent() {
  const slugs = useWishlistStore((s) => s.slugs);
  const [products, setProducts] = useState<ProductCardDTO[]>([]);
  const mounted = useMounted();

  useEffect(() => {
    if (!mounted || slugs.length === 0) return;
    fetch(`/api/products?slugs=${encodeURIComponent(slugs.join(","))}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.results ?? []));
  }, [mounted, slugs]);

  if (mounted && slugs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Heart className="h-10 w-10 text-muted" />
        <p className="text-charcoal">Your wishlist is empty.</p>
        <ButtonLink href="/collections/all" variant="secondary" size="sm">
          Discover the Collection
        </ButtonLink>
      </div>
    );
  }

  return <ProductGrid products={products} />;
}
