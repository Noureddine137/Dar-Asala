import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { TranslationNotice } from "@/components/layout/translation-notice";
import { LEGAL_PAGES } from "@/lib/content/legal";

type Props = { params: Promise<{ slug: string; locale: string }> };

export function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = LEGAL_PAGES[slug];
  if (!page) return {};
  return { title: page.title, robots: { index: false, follow: true } };
}

export default async function LegalPage({ params }: Props) {
  const { slug, locale } = await params;
  const page = LEGAL_PAGES[slug];
  if (!page) notFound();
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div>
      <PageHeader
        title={page.title}
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: page.title }]}
      />
      <div className="container-page max-w-2xl space-y-8 pb-16 text-sm leading-relaxed text-charcoal/80 md:pb-24">
        <TranslationNotice variant="legal" />
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="mb-2 font-serif-display text-xl text-charcoal">{section.heading}</h2>
            {section.body.map((p, i) => (
              <p key={i} className={section.heading === "Legal Review Notice" ? "italic text-terracotta" : ""}>
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
