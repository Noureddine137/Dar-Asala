import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink } from "@/components/ui/button";
import { getStoreSettings } from "@/lib/content/store-settings";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Dar Asala crafts small-batch, handmade leather bags shaped by Moroccan artisanship.",
};

export default async function AboutPage() {
  const settings = await getStoreSettings();
  return (
    <div>
      <PageHeader
        title="Our Story"
        image="/images/brand/about-hero.webp"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Our Story" }]}
      />

      <div className="container-page grid gap-10 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image src="/images/brand/story.webp" alt="" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
        <div>
          <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">
            A house built on Moroccan leather craft
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/80">
            Dar Asala — &ldquo;house of authenticity&rdquo; — began as an attempt to bring the leather
            craft of {settings.brandWorkshopLocations} to a wider audience without losing what makes it
            worth preserving: real hides, real hands, and real time.
          </p>
          <p className="mt-4 text-base leading-relaxed text-charcoal/80">
            Every bag we make passes through a small number of artisans, each responsible for a
            specific stage — cutting, stitching, edge finishing — the way leather workshops in the
            medina have operated for generations.
          </p>
          <p className="mt-4 text-base leading-relaxed text-charcoal/80">
            We chose to stay small. Production runs are limited by how many bags our artisans can
            make well in a given month, not by how many a factory line could produce.
          </p>
        </div>
      </div>

      <div className="border-t border-sand/70 bg-cream py-14 md:py-20">
        <div className="container-page flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">See how it&rsquo;s made</h2>
            <p className="mt-2 max-w-md text-sm text-charcoal/80">
              Go behind the workshop doors and follow a bag from raw hide to finished piece.
            </p>
          </div>
          <ButtonLink href="/about/craftsmanship">Our Craftsmanship</ButtonLink>
        </div>
      </div>
    </div>
  );
}
