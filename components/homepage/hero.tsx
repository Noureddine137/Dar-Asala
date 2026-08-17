import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { getStoreSettings } from "@/lib/content/store-settings";

export async function Hero() {
  const settings = await getStoreSettings();

  return (
    <section className="relative flex h-[80svh] min-h-[560px] items-end overflow-hidden bg-forest md:h-[84vh]">
      <Image
        src={settings.heroImageUrl}
        alt="A handcrafted Dar Asala leather bag set against a warm Moroccan riad archway."
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/*
        Two-layer scrim so the headline stays readable regardless of what
        the real hero photo eventually looks like: a soft gradient for the
        overall mood, plus a stronger, tighter gradient right behind the
        text block. Text also carries its own drop-shadow as a second,
        image-independent safety net.
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-charcoal/80 to-transparent" />

      <div
        className="container-page relative z-10 pb-10 md:pb-16"
        style={{ paddingBottom: "max(2.5rem, calc(env(safe-area-inset-bottom) + 2rem))" }}
      >
        <div className="max-w-lg">
          <h1 className="whitespace-pre-line font-serif-display text-4xl leading-[1.1] text-ivory drop-shadow-sm sm:text-5xl md:text-6xl">
            {settings.heroHeadline}
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-ivory/90 drop-shadow-sm md:text-lg">
            {settings.heroSubtitle}
          </p>
          <div className="mt-7">
            <ButtonLink href={settings.heroCtaHref} variant="light" size="lg" className="font-semibold shadow-sm">
              {settings.heroCtaLabel}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
