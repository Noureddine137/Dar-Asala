import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { JOURNAL_ARTICLES } from "@/lib/content/journal";

export const metadata: Metadata = { title: "Journal" };

type Props = { params: Promise<{ locale: string }> };

export default async function JournalIndexPage({ params }: Props) {
  const { locale } = await params;
  const [tNav, tJournal] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "journal" }),
  ]);

  return (
    <div>
      <PageHeader
        title={tNav("journal")}
        description={tJournal("description")}
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: tNav("journal") }]}
      />
      <div className="container-page grid gap-10 pb-16 md:grid-cols-3 md:gap-8 md:pb-24">
        {JOURNAL_ARTICLES.map((a) => (
          <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={a.image}
                alt={a.title}
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <h2 className="mt-4 font-serif-display text-xl text-charcoal">{a.title}</h2>
            <p className="mt-1 text-sm text-muted">{a.dek}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
