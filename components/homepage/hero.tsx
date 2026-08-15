import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-forest md:min-h-[88vh] md:items-center">
      <Image
        src="/images/hero/hero-main.webp"
        alt="A handcrafted Dar Asala leather bag set against a warm Moroccan riad courtyard."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent md:bg-gradient-to-r md:from-charcoal/75 md:via-charcoal/25 md:to-transparent" />

      <div className="container-page relative z-10 pb-14 pt-24 md:py-0">
        <div className="max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-cream/90">
            Handmade in Morocco
          </p>
          <h1 className="font-serif-display text-4xl leading-[1.08] text-ivory sm:text-5xl md:text-6xl">
            Handcrafted in Morocco.
            <br />
            Made to travel with you.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ivory/85 md:text-lg">
            Timeless leather bags shaped by Moroccan craftsmanship and made by hand in small
            batches.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/collections/all" size="lg">
              Shop the Collection
            </ButtonLink>
            <ButtonLink href="/about/craftsmanship" variant="light" size="lg" className="bg-transparent text-ivory ring-1 ring-inset ring-ivory/60 hover:bg-ivory/10">
              Our Craftsmanship
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
