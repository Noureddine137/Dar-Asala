import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CollectionDTO } from "@/lib/commerce/types";

export function CategoryRail({ collections }: { collections: CollectionDTO[] }) {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page mb-8 flex items-end justify-between md:mb-10">
        <h2 className="font-serif-display text-3xl text-charcoal md:text-4xl">Shop by Category</h2>
      </div>

      <div className="container-page">
        <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible lg:grid-cols-6">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group relative w-[62vw] shrink-0 snap-start overflow-hidden rounded-sm bg-cream sm:w-[42vw] md:w-auto"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={c.heroImage}
                  alt={c.title}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 30vw, 60vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="font-serif-display text-lg text-ivory">{c.title}</span>
                <ArrowUpRight className="h-4 w-4 text-ivory transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
