"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { ProductImageDTO } from "@/lib/commerce/types";

export function ProductGallery({ images, productName }: { images: ProductImageDTO[]; productName: string }) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const current = images[active];
  const t = useTranslations("product");

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-sm bg-sand md:aspect-[4/5]">
        {current && (
          <Image
            src={current.url}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          aria-label={t("zoomProductImage")}
          className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-charcoal shadow-sm"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <div
        role="group"
        aria-label={t("thumbnailsFor", { name: productName })}
        className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto"
      >
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={t("viewImageOf", { index: i + 1, total: images.length })}
            aria-current={active === i}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-sm ring-2 ring-offset-1 ring-offset-cream transition-opacity md:h-[4.5rem] md:w-[4.5rem]",
              active === i ? "ring-charcoal opacity-100" : "ring-transparent opacity-70 hover:opacity-100"
            )}
          >
            <Image src={img.url} alt="" fill sizes="72px" className="object-cover" />
          </button>
        ))}
      </div>

      <Dialog.Root open={zoomOpen} onOpenChange={setZoomOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/80 data-[state=open]:animate-fade-in" />
          <Dialog.Content className="fixed inset-4 z-50 flex items-center justify-center focus:outline-none md:inset-10">
            <Dialog.Title className="sr-only">{t("enlargedImage", { name: productName })}</Dialog.Title>
            <Dialog.Description className="sr-only">{t("enlargedImageDescription")}</Dialog.Description>
            <div className="relative h-full w-full max-w-3xl overflow-hidden rounded-sm">
              {current && <Image src={current.url} alt={current.alt} fill sizes="100vw" className="object-contain" />}
            </div>
            <Dialog.Close asChild>
              <button
                aria-label={t("closeZoomedImage")}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-ivory text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
