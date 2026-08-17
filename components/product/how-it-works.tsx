"use client";

import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations("product");
  const steps = t.raw("howItWorksSteps") as { title: string; copy: string }[];

  return (
    <div>
      <p className="mb-5 text-center font-serif-display text-xl text-charcoal md:text-2xl">{t("howItWorks")}</p>
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {steps.map((step, i) => (
          <div key={step.title} className="rounded-sm bg-sand/50 p-4 text-center md:p-6">
            <span className="font-serif-display text-2xl text-leather md:text-3xl">{i + 1}</span>
            <p className="mt-2 text-xs font-semibold text-charcoal md:text-sm">{step.title}</p>
            <p className="mt-1.5 hidden text-xs leading-relaxed text-charcoal/75 md:block">{step.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
