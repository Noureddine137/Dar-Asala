import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex h-[80svh] min-h-[560px] items-end overflow-hidden bg-forest md:h-[84vh]">
      <Image
        src="/images/hero/hero-main.webp"
        alt="A handcrafted Dar Asala leather bag set against a warm Moroccan riad archway."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-transparent" />

      <div className="container-page relative z-10 pb-10 md:pb-16">
        <div className="max-w-lg">
          <h1 className="font-serif-display text-4xl leading-[1.1] text-ivory sm:text-5xl md:text-6xl">
            Handcrafted in Morocco.
            <br />
            Made to last.
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-ivory/90 md:text-lg">
            Timeless leather bags shaped by our artisans, carried by you.
          </p>
          <div className="mt-7">
            <ButtonLink href="/collections/all" variant="light" size="lg" className="font-semibold">
              Shop the Collection
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
