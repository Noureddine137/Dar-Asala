import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { getStoreSettings } from "@/lib/content/store-settings";

export async function BrandStory() {
  const settings = await getStoreSettings();
  const paragraphs = settings.brandStoryBody.split("\n").filter(Boolean);

  return (
    <section className="border-t border-sand py-16 md:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-sm md:order-1">
          <Image
            src={settings.brandStoryImageUrl}
            alt="Warm, sunlit archway evoking a Moroccan riad workshop."
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">Our Story</p>
          <h2 className="font-serif-display text-3xl leading-tight text-charcoal md:text-4xl">
            {settings.brandStoryHeading}
          </h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="mt-5 text-base leading-relaxed text-charcoal/80 first:mt-5">
              {p}
            </p>
          ))}
          <ButtonLink href="/about" variant="secondary" className="mt-8">
            Discover Our Story
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
