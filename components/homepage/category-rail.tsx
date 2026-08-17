import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { CollectionDTO } from "@/lib/commerce/types";

export async function CategoryRail({ collections }: { collections: CollectionDTO[] }) {
  const t = await getTranslations("home");

  return (
    <section className="bg-cream py-10 md:py-16">
      <div className="container-page mb-5 flex items-end justify-between md:mb-8">
        <h2 className="font-serif-display text-2xl text-charcoal md:text-4xl">{t("shopByCategory")}</h2>
        <Link href="/collections/all" className="text-xs font-semibold uppercase tracking-wide text-leather md:text-sm">
          {t("viewAll")}
        </Link>
      </div>

      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-6 md:gap-6">
        {collections.map((c) => (
          <Link key={c.slug} href={`/collections/${c.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden rounded-sm bg-sand">
              <Image
                src={c.heroImage}
                alt={c.title}
                fill
                sizes="(min-width: 768px) 16vw, 44vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-2.5 text-center font-serif-display text-sm text-charcoal md:text-base">{c.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
