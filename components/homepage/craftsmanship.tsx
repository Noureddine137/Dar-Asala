import Image from "next/image";
import { CRAFTSMANSHIP_STEPS } from "@/lib/content/craftsmanship";

export function Craftsmanship() {
  return (
    <section className="bg-forest py-16 text-ivory md:py-24">
      <div className="container-page mb-12 max-w-xl md:mb-16">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brass">Craftsmanship</p>
        <h2 className="font-serif-display text-3xl leading-tight md:text-4xl">
          Five steps. One artisan. Zero shortcuts.
        </h2>
      </div>

      <div className="container-page flex flex-col gap-16 md:gap-24">
        {CRAFTSMANSHIP_STEPS.map((step, i) => (
          <div
            key={step.slug}
            className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
              <Image
                src={step.image}
                alt={step.title}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-serif-display text-5xl text-brass/60">{step.number}</span>
              <h3 className="mt-3 font-serif-display text-2xl text-ivory md:text-3xl">{step.title}</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-ivory/75">{step.copy}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
