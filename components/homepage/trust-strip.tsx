import { Hand, Leaf, Package, Truck } from "lucide-react";

const ITEMS = [
  { icon: Hand, label: "Handmade in Morocco" },
  { icon: Leaf, label: "Genuine Full-Grain Leather" },
  { icon: Package, label: "Small-Batch Production" },
  { icon: Truck, label: "European Shipping" },
];

export function TrustStrip() {
  return (
    <section className="border-b border-sand/70 bg-ivory py-8 md:py-10">
      <div className="container-page grid grid-cols-2 gap-y-6 md:grid-cols-4 md:gap-6">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
            <Icon className="h-5 w-5 shrink-0 text-camel" strokeWidth={1.5} />
            <span className="text-xs font-medium uppercase tracking-wide text-charcoal/85 md:text-sm md:normal-case md:tracking-normal">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
