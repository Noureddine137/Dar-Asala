import { colorLabel, sizeLabel, strapLabel } from "@/lib/utils/format";
import { BRAND_ORIGIN_COUNTRY } from "@/lib/content/business-claims";
import type { ProductDetailDTO } from "@/lib/commerce/types";

const DESIGN_BY_CATEGORY: Record<string, string> = {
  handbags: "Structured top-handle handbag",
  "shoulder-bags": "Softly structured shoulder bag",
  "crossbody-bags": "Compact crossbody bag",
  "tote-bags": "Spacious, unstructured tote",
  "mini-bags": "Miniature top-handle bag",
  "leather-accessories": "Small leather good",
};

const DIMENSIONS_BY_SIZE: Record<string, string> = {
  MINI: "18 × 14 × 7 cm",
  MEDIUM: "30 × 22 × 11 cm",
  LARGE: "38 × 28 × 14 cm",
};

export function productDimensionsText(product: ProductDetailDTO): string {
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  return sizes.map((s) => `${sizeLabel(s)}: ${DIMENSIONS_BY_SIZE[s] ?? "—"}`).join(" / ");
}

export function productDetailTiles(product: ProductDetailDTO) {
  const straps = Array.from(new Set(product.variants.map((v) => v.strap)));

  return [
    { label: "Design", value: DESIGN_BY_CATEGORY[product.category] ?? "Structured leather bag" },
    { label: "Leather", value: product.materials.split(".")[0] + "." },
    { label: "Colors", value: product.colors.map(colorLabel).join(" · ") },
    { label: "Dimensions", value: productDimensionsText(product) },
    { label: "Strap", value: straps.map(strapLabel).join(" · ") },
    { label: "Lining", value: "Cotton-twill lining" },
    { label: "Origin", value: `Handmade in ${BRAND_ORIGIN_COUNTRY}` },
    { label: "Use", value: "Everyday & occasion" },
  ];
}
