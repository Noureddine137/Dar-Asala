"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Star, Heart, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { colorLabel, colorSwatchHex, formatPrice, hardwareLabel, sizeLabel, strapLabel } from "@/lib/utils/format";
import { dimensionOptions, defaultSelection, findVariant, type VariantSelection } from "@/lib/commerce/variant-utils";
import { useCartStore } from "@/lib/store/cart-store";
import { useUIStore } from "@/lib/store/ui-store";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { StickyMobileCartBar } from "./sticky-cart-bar";
import type { ProductDetailDTO } from "@/lib/commerce/types";

export function PurchasePanel({ product }: { product: ProductDetailDTO }) {
  const options = useMemo(() => dimensionOptions(product.variants), [product.variants]);
  const [selection, setSelection] = useState<VariantSelection>(() => defaultSelection(product.variants));
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const isWishlisted = useWishlistStore((s) => s.has(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const [justAdded, setJustAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ctaRef.current;
    if (!target) return;
    // Only show the sticky bar once the CTA has been scrolled *above* the
    // viewport (top < 0) — not while it simply hasn't been reached yet on
    // initial load (top > 0, still below the fold).
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { rootMargin: "-72px 0px 0px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const variant = findVariant(product.variants, selection);
  const image = product.images.find((img) => img.id === variant.imageId) ?? product.primaryImage ?? product.images[0];
  const available = variant.stock > 0;
  const statusLabel =
    available && !variant.isMadeToOrder
      ? "In stock — ships in 1–3 business days"
      : "Made to order — handcrafted in 7–14 business days";

  const steps: string[] = [];
  if (options.colors.length > 1) steps.push("color");
  if (options.sizes.length > 1) steps.push("size");
  if (options.straps.length > 1) steps.push("strap");
  if (options.hardwares.length > 1) steps.push("hardware");
  const stepNumber = (key: string) => steps.indexOf(key) + 1;

  function handleAddToCart() {
    addItem(
      {
        variantId: variant.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: image?.url ?? "",
        imageAlt: image?.alt ?? product.name,
        color: variant.color,
        size: variant.size,
        strap: strapLabel(variant.strap),
        hardware: hardwareLabel(variant.hardware),
        price: variant.price,
        currency: product.currency,
        isMadeToOrder: variant.isMadeToOrder,
      },
      quantity
    );
    setJustAdded(true);
    openCart();
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div id="purchase-panel">
      <h1 className="font-serif-display text-3xl text-charcoal md:text-4xl">{product.name}</h1>

      <a href="#reviews" className="mt-2 inline-flex items-center gap-1.5 text-sm text-charcoal/80">
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn("h-3.5 w-3.5", i < Math.round(product.averageRating) ? "fill-camel text-camel" : "text-sand")}
            />
          ))}
        </span>
        {product.reviewCount > 0 ? (
          <span>
            {product.averageRating.toFixed(1)} ({product.reviewCount} Review{product.reviewCount === 1 ? "" : "s"})
          </span>
        ) : (
          <span>Be the first to review</span>
        )}
      </a>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-2xl font-medium text-charcoal">{formatPrice(variant.price, product.currency)}</span>
        {product.compareAtPrice && (
          <span className="text-base text-muted line-through">
            {formatPrice(product.compareAtPrice, product.currency)}
          </span>
        )}
      </div>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/80">{product.shortDescription}</p>

      <div className="mt-8 space-y-6">
        {options.colors.length > 1 && (
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {stepNumber("color")}. Color —{" "}
              <span className="normal-case tracking-normal text-charcoal">{colorLabel(selection.color)}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {options.colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelection((s) => ({ ...s, color: c }))}
                  aria-pressed={selection.color === c}
                  aria-label={colorLabel(c)}
                  className={cn(
                    "h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-ivory transition-all",
                    selection.color === c ? "ring-charcoal" : "ring-transparent hover:ring-sand"
                  )}
                  style={{ backgroundColor: colorSwatchHex(c) }}
                />
              ))}
            </div>
          </div>
        )}

        {options.sizes.length > 1 && (
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {stepNumber("size")}. Size
            </p>
            <div className="flex flex-wrap gap-2">
              {options.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelection((sel) => ({ ...sel, size: s }))}
                  aria-pressed={selection.size === s}
                  className={cn(
                    "rounded-sm border px-4 py-2 text-sm",
                    selection.size === s
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-sand text-charcoal hover:border-charcoal"
                  )}
                >
                  {sizeLabel(s)}
                </button>
              ))}
            </div>
          </div>
        )}

        {options.straps.length > 1 && (
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {stepNumber("strap")}. Strap
            </p>
            <div className="flex flex-wrap gap-2">
              {options.straps.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelection((sel) => ({ ...sel, strap: s }))}
                  aria-pressed={selection.strap === s}
                  className={cn(
                    "rounded-sm border px-4 py-2.5 text-sm",
                    selection.strap === s
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-sand text-charcoal hover:border-charcoal"
                  )}
                >
                  {strapLabel(s)}
                </button>
              ))}
            </div>
          </div>
        )}

        {options.hardwares.length > 1 && (
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              {stepNumber("hardware")}. Hardware
            </p>
            <div className="flex flex-wrap gap-2">
              {options.hardwares.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelection((sel) => ({ ...sel, hardware: h }))}
                  aria-pressed={selection.hardware === h}
                  className={cn(
                    "rounded-sm border px-4 py-2.5 text-sm",
                    selection.hardware === h
                      ? "border-charcoal bg-charcoal text-ivory"
                      : "border-sand text-charcoal hover:border-charcoal"
                  )}
                >
                  {hardwareLabel(h)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Quantity</span>
        <div className="flex items-center rounded-sm border border-sand">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="flex h-11 w-10 items-center justify-center text-charcoal"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="flex h-11 w-10 items-center justify-center text-charcoal"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div ref={ctaRef} className="mt-4 flex items-stretch gap-3">
        <Button size="lg" onClick={handleAddToCart} className="flex-1">
          {justAdded ? "Added to Cart" : `Add to Cart — ${formatPrice(variant.price * quantity, product.currency)}`}
        </Button>

        <button
          type="button"
          onClick={() => toggleWishlist(product.slug)}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border border-sand text-charcoal"
        >
          <Heart className={cn("h-5 w-5", isWishlisted && "fill-terracotta text-terracotta")} />
        </button>
      </div>

      <p className={cn("mt-4 text-sm", variant.isMadeToOrder ? "text-olive" : "text-charcoal/80")}>{statusLabel}</p>

      <StickyMobileCartBar
        show={showSticky}
        image={image?.url ?? ""}
        imageAlt={image?.alt ?? product.name}
        name={product.name}
        optionsLabel={[colorLabel(variant.color), sizeLabel(variant.size)].join(" / ")}
        price={variant.price * quantity}
        currency={product.currency}
        justAdded={justAdded}
        onAdd={handleAddToCart}
      />
    </div>
  );
}
