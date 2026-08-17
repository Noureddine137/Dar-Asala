import Image from "next/image";
import { ButtonLink } from "@/components/ui/button-link";
import { getStoreSettings } from "@/lib/content/store-settings";

export async function CustomOrders() {
  const settings = await getStoreSettings();

  return (
    <section className="py-16 md:py-24">
      <div className="container-page grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src={settings.customOrderImageUrl}
            alt="A leather bag alongside a selection of leather color swatches."
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted">Bespoke</p>
          <h2 className="font-serif-display text-3xl leading-tight text-charcoal md:text-4xl">
            {settings.customOrderHeading}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-charcoal/80">{settings.customOrderBody}</p>
          <ul className="mt-6 grid grid-cols-2 gap-2 text-sm text-charcoal/80">
            <li>— Leather color</li>
            <li>— Dimensions</li>
            <li>— Strap length</li>
            <li>— Monogram initials</li>
            <li>— Interior lining</li>
            <li>— Hardware finish</li>
          </ul>
          <ButtonLink href="/custom-orders" className="mt-8">
            Create Your Bag
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
