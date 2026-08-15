import type { ProductVariantDTO } from "./types";

export type VariantSelection = {
  color: string;
  size: string;
  hardware: string;
  strap: string;
};

export function dimensionOptions(variants: ProductVariantDTO[]) {
  return {
    colors: Array.from(new Set(variants.map((v) => v.color))),
    sizes: Array.from(new Set(variants.map((v) => v.size))),
    hardwares: Array.from(new Set(variants.map((v) => v.hardware))),
    straps: Array.from(new Set(variants.map((v) => v.strap))),
  };
}

export function defaultSelection(variants: ProductVariantDTO[]): VariantSelection {
  const first = variants[0];
  return {
    color: first?.color ?? "",
    size: first?.size ?? "",
    hardware: first?.hardware ?? "",
    strap: first?.strap ?? "",
  };
}

export function findVariant(variants: ProductVariantDTO[], selection: VariantSelection) {
  return (
    variants.find(
      (v) =>
        v.color === selection.color &&
        v.size === selection.size &&
        v.hardware === selection.hardware &&
        v.strap === selection.strap
    ) ??
    variants.find((v) => v.color === selection.color && v.size === selection.size) ??
    variants[0]
  );
}

export function isColorAvailable(variants: ProductVariantDTO[], color: string, selection: VariantSelection) {
  return variants.some((v) => v.color === color && v.size === selection.size);
}

export function isSizeAvailable(variants: ProductVariantDTO[], size: string, selection: VariantSelection) {
  return variants.some((v) => v.size === size && v.color === selection.color);
}
