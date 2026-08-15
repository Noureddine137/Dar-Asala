import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";

export function BrandStory() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-sm md:order-1">
          <Image
            src="/images/brand/story.webp"
            alt="Warm, sunlit archway evoking a Moroccan riad workshop."
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 md:order-2">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">Our Story</p>
          <h2 className="font-serif-display text-3xl leading-tight text-charcoal md:text-4xl">
            Crafted slowly. Made to last.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/80">
            Each Dar Asala piece is shaped by artisans using techniques rooted in Moroccan
            leather craftsmanship — hand-cut, hand-stitched and finished one bag at a time in
            small workshops across Marrakech and Fez.
          </p>
          <p className="mt-4 text-base leading-relaxed text-charcoal/80">
            We work in small batches by choice, not necessity: it is the only way to keep the
            quality — and the people — behind every bag visible.
          </p>
          <ButtonLink href="/about" variant="secondary" className="mt-8">
            Discover Our Story
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
