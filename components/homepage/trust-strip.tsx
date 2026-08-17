import { Heart, Award, Package, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function TrustStrip() {
  const t = await getTranslations("home");

  const ITEMS = [
    { icon: Heart, label: t("handmadeInMorocco") },
    { icon: Award, label: t("genuineLeather") },
    { icon: Package, label: t("smallBatchProduction") },
    { icon: ShieldCheck, label: t("securePayments") },
  ];

  return (
    <section className="border-b border-sand bg-cream py-6 md:py-8">
      <div className="container-page grid grid-cols-4 gap-2 md:gap-6">
        {ITEMS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 text-center">
            <Icon className="h-5 w-5 shrink-0 text-leather" strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-tight text-charcoal/80 sm:text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
