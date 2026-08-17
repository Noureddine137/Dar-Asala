"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore, type CartItem } from "@/lib/store/cart-store";
import { colorLabel, sizeLabel, formatPrice } from "@/lib/utils/format";

export function CartLineItem({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-4">
      <Link
        href={`/products/${item.slug}`}
        onClick={onNavigate}
        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-cream"
      >
        <Image src={item.image} alt={item.imageAlt} fill sizes="80px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              onClick={onNavigate}
              className="line-clamp-2 font-serif-display text-base leading-snug text-charcoal"
            >
              {item.name}
            </Link>
            <p className="mt-0.5 truncate text-xs text-muted">
              {colorLabel(item.color)} / {sizeLabel(item.size)}
            </p>
            {(item.strap || item.hardware) && (
              <p className="truncate text-xs text-muted">
                {[item.strap, item.hardware].filter(Boolean).join(" / ")}
              </p>
            )}
            {item.isMadeToOrder && <p className="mt-0.5 text-xs text-olive">Made to order</p>}
          </div>
          <button
            type="button"
            onClick={() => removeItem(item.variantId)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 text-muted hover:text-charcoal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-sm border border-sand">
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-charcoal"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-charcoal"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-medium text-charcoal">
            {formatPrice(item.price * item.quantity, item.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
