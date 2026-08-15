"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ProductImageDTO } from "@/lib/commerce/types";

export function ProductGallery({ images, productName }: { images: ProductImageDTO[]; productName: string }) {
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollTo(index: number) {
    setActive(index);
    const node = scrollerRef.current?.children[index] as HTMLElement | undefined;
    node?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const index = Math.round(scroller.scrollLeft / scroller.clientWidth);
    if (index !== active) setActive(index);
  }

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="hidden shrink-0 flex-col gap-3 md:flex">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1} of ${images.length}`}
            aria-current={active === i}
            className={cn(
              "relative h-20 w-16 shrink-0 overflow-hidden rounded-sm ring-1 transition-opacity",
              active === i ? "ring-charcoal opacity-100" : "ring-sand/70 opacity-70 hover:opacity-100"
            )}
          >
            <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-sm bg-cream md:block">
          {images[active] && (
            <Image
              src={images[active].url}
              alt={images[active].alt}
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          )}
        </div>

        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          role="group"
          aria-label={`${productName} gallery`}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:hidden"
        >
          {images.map((img) => (
            <div key={img.id} className="relative aspect-[4/5] w-full shrink-0 snap-center bg-cream">
              <Image src={img.url} alt={img.alt} fill sizes="100vw" className="object-cover" />
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center gap-1.5 md:hidden">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              className={cn("h-1.5 rounded-full transition-all", active === i ? "w-5 bg-charcoal" : "w-1.5 bg-sand")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
