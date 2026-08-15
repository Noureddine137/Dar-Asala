import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  {
    slug: "marrakech-edit",
    title: "The Marrakech Edit",
    dek: "Warm tones and market-worn leather, styled for the city.",
    image: "/images/editorial/marrakech-edit.webp",
  },
  {
    slug: "medina-collection",
    title: "The Medina Collection",
    dek: "Structured shapes inspired by the alleyways of the old city.",
    image: "/images/editorial/medina-collection.webp",
  },
  {
    slug: "workshop-to-wardrobe",
    title: "From Workshop to Wardrobe",
    dek: "Following one bag from raw hide to finished piece.",
    image: "/images/editorial/workshop-to-wardrobe.webp",
  },
];

export function Editorial() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-page mb-8 md:mb-10">
        <h2 className="font-serif-display text-3xl text-charcoal md:text-4xl">From the Journal</h2>
      </div>
      <div className="container-page grid gap-6 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Link key={f.slug} href={`/journal/${f.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={f.image}
                alt={f.title}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 font-serif-display text-xl text-charcoal">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.dek}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export const EDITORIAL_FEATURES = FEATURES;
