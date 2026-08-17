import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedStoreSettings } from "@/lib/content/store-settings";
import type { ProductDetailDTO } from "@/lib/commerce/types";
import type { Locale } from "@/i18n/routing";

export async function ProductStory({ product }: { product: ProductDetailDTO }) {
  const locale = (await getLocale()) as Locale;
  const [settings, t] = await Promise.all([getLocalizedStoreSettings(locale), getTranslations("product")]);
  const image = product.images.find((img) => img.kind === "lifestyle") ?? product.images[3] ?? product.images[0];

  return (
    <section className="border-t border-sand/70 bg-cream py-14 md:py-20">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          {image && (
            <Image src={image.url} alt={image.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          )}
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">
            {t("madeByHandIn", { country: settings.brandOriginCountry })}
          </p>
          <h2 className="font-serif-display text-2xl leading-tight text-charcoal md:text-3xl">
            {product.story ?? t("productStoryFallback")}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal/80">
            {t("productStoryBody", {
              name: product.name,
              claim: settings.artisanProcessClaim,
              productionModel: settings.productionModelClaim,
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
