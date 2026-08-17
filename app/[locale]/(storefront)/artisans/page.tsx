import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { getLocalizedStoreSettings } from "@/lib/content/store-settings";
import type { Locale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Artisans",
  description: "The small workshops and artisans behind every Dar Asala bag.",
};

const WORKSHOPS = [
  {
    image: "/images/artisans/workshop-1.webp",
    title: "The Cutting Table",
    copy: "Pattern pieces are cut by hand from full hides, one at a time, with the leather's natural grain guiding every placement.",
  },
  {
    image: "/images/artisans/workshop-2.webp",
    title: "The Stitching Bench",
    copy: "Saddle stitching is done by hand, two needles and one waxed thread, in the same technique used across Marrakech's leather quarter for generations.",
  },
  {
    image: "/images/artisans/workshop-3.webp",
    title: "The Finishing Corner",
    copy: "Edges are burnished, hardware is set, and every bag is inspected by hand before it leaves the workshop.",
  },
];

type Props = { params: Promise<{ locale: string }> };

export default async function ArtisansPage({ params }: Props) {
  const { locale } = await params;
  const settings = await getLocalizedStoreSettings(locale as Locale);
  return (
    <div>
      <PageHeader
        title="Our Artisans"
        description={`Dar Asala works with a small number of independent leather workshops across ${settings.brandWorkshopLocations} — we don't publish invented biographies, but every bag is made by real hands, in small batches, start to finish.`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Artisans" }]}
      />

      <div className="container-page grid gap-10 pb-16 md:grid-cols-3 md:gap-8 md:pb-24">
        {WORKSHOPS.map((w) => (
          <div key={w.title}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image src={w.image} alt={w.title} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
            </div>
            <h2 className="mt-4 font-serif-display text-xl text-charcoal">{w.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{w.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
