"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

export function StickyMobileCartBar({
  show,
  image,
  imageAlt,
  name,
  optionsLabel,
  price,
  currency,
  justAdded,
  onAdd,
}: {
  show: boolean;
  image: string;
  imageAlt: string;
  name: string;
  optionsLabel: string;
  price: number;
  currency: string;
  justAdded: boolean;
  onAdd: () => void;
}) {
  if (!show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-sand bg-ivory/97 px-3 py-2.5 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-sand">
        <Image src={image} alt={imageAlt} fill sizes="48px" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-charcoal">{name}</p>
        <p className="truncate text-xs text-muted">{optionsLabel}</p>
      </div>
      <Button onClick={onAdd} size="md" className="shrink-0">
        {justAdded ? "Added" : formatPrice(price, currency)}
      </Button>
    </div>
  );
}
