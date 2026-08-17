"use client";

import { Hammer, ShieldCheck, PackageCheck, Lock, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ProductDetailDTO } from "@/lib/commerce/types";

const ICONS = [Hammer, Hammer, PackageCheck, ShieldCheck, Lock, Truck];

export function TrustList({ product }: { product: ProductDetailDTO }) {
  const t = useTranslations("product");
  const raw = t.raw("trustListItems") as { title: string; copy: string }[];

  const items = [
    { icon: ICONS[product.isMadeToOrder ? 0 : 1], title: raw[product.isMadeToOrder ? 0 : 1].title, copy: product.productionTime },
    ...raw.slice(2).map((item, i) => ({ icon: ICONS[i + 2], title: item.title, copy: item.copy })),
  ];

  return (
    <div className="space-y-5">
      {items.map(({ icon: Icon, title, copy }) => (
        <div key={title} className="flex items-start gap-3.5">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-leather" strokeWidth={1.5} />
          <p className="text-sm leading-snug text-charcoal">
            <span className="font-medium">{title}</span>
            <br />
            <span className="text-charcoal/75">{copy}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
