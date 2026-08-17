import { getTranslations } from "next-intl/server";
import { colorLabel, sizeLabel, strapLabel } from "@/lib/utils/format";
import type { ProductDetailDTO } from "@/lib/commerce/types";
import type { Locale } from "@/i18n/routing";

const DIMENSIONS_BY_SIZE: Record<string, string> = {
  MINI: "18 × 14 × 7 cm",
  MEDIUM: "30 × 22 × 11 cm",
  LARGE: "38 × 28 × 14 cm",
};

export function productDimensionsText(product: ProductDetailDTO, locale: Locale): string {
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  return sizes.map((s) => `${sizeLabel(s, locale)}: ${DIMENSIONS_BY_SIZE[s] ?? "—"}`).join(" / ");
}

export async function productDetailTiles(product: ProductDetailDTO, originCountry: string, locale: Locale) {
  const straps = Array.from(new Set(product.variants.map((v) => v.strap)));
  const t = await getTranslations({ locale, namespace: "product" });
  const designByCategory = t.raw("designByCategory") as Record<string, string>;

  return [
    { label: t("detailDesign"), value: designByCategory[product.category] ?? t("detailDesignFallback") },
    { label: t("detailLeather"), value: product.materials.split(".")[0] + "." },
    { label: t("color"), value: product.colors.map((c) => colorLabel(c, locale)).join(" · ") },
    { label: t("dimensions"), value: productDimensionsText(product, locale) },
    { label: t("strap"), value: straps.map((s) => strapLabel(s, locale)).join(" · ") },
    { label: t("detailLining"), value: t("detailLiningValue") },
    { label: t("detailOrigin"), value: t("detailOriginValue", { country: originCountry }) },
    { label: t("detailUse"), value: t("detailUseValue") },
  ];
}
