"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import type { ProductCardDTO } from "@/lib/commerce/types";

export function ProductGrid({ products }: { products: ProductCardDTO[] }) {
  const t = useTranslations("general");

  if (products.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="font-serif-display text-2xl text-charcoal">{t("noProductsMatch")}</p>
        <p className="max-w-xs text-sm text-muted">{t("noProductsMatchBody")}</p>
        <Link href="?">
          <Button variant="secondary" size="sm">
            {t("clearFilters")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < 2} />
      ))}
    </div>
  );
}
