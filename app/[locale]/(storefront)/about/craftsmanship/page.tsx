import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { CRAFTSMANSHIP_STEPS } from "@/lib/content/craftsmanship";

export const metadata: Metadata = {
  title: "Craftsmanship",
  description: "How Dar Asala bags are hand-cut, hand-stitched and finished in small Moroccan workshops.",
};

type Props = { params: Promise<{ locale: string }> };

export default async function CraftsmanshipPage({ params }: Props) {
  const { locale } = await params;
  const [tNav, tHome] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "home" }),
  ]);

  return (
    <div>
      <PageHeader
        title={tNav("craftsmanship")}
        description={tHome("craftsmanshipTagline2")}
        breadcrumb={[
          { label: tNav("home"), href: "/" },
          { label: tNav("ourStory"), href: "/about" },
          { label: tNav("craftsmanship") },
        ]}
      />

      <div className="container-page flex flex-col gap-16 pb-16 md:gap-24 md:pb-24">
        {CRAFTSMANSHIP_STEPS.map((step, i) => (
          <div
            key={step.slug}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image src={step.image} alt={step.title} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
            <div>
              <span className="font-serif-display text-5xl text-camel/60">{step.number}</span>
              <h2 className="mt-3 font-serif-display text-2xl text-charcoal md:text-3xl">{step.title}</h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-charcoal/80">{step.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
