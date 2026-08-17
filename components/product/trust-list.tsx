import { Hammer, ShieldCheck, PackageCheck, Lock, Truck } from "lucide-react";
import type { ProductDetailDTO } from "@/lib/commerce/types";

export function TrustList({ product }: { product: ProductDetailDTO }) {
  const items = [
    {
      icon: Hammer,
      title: product.isMadeToOrder ? "Made to order" : "In stock, ready to ship",
      copy: product.productionTime,
    },
    {
      icon: PackageCheck,
      title: "Individually inspected",
      copy: "Every piece checked by hand before dispatch",
    },
    {
      icon: ShieldCheck,
      title: "Arrives damaged?",
      copy: "We replace it, no questions asked",
    },
    {
      icon: Lock,
      title: "Secure checkout",
      copy: "SSL encrypted, processed by Stripe",
    },
    {
      icon: Truck,
      title: "Worldwide shipping",
      copy: "With tracking on every order",
    },
  ];

  return (
    <div className="space-y-5">
      {items.map(({ icon: Icon, title, copy }) => (
        <div key={title} className="flex items-start gap-3.5">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-leather" strokeWidth={1.5} />
          <p className="text-sm leading-snug text-charcoal">
            <span className="font-medium">{title}</span>
            <br />
            <span className="text-charcoal/65">{copy}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
