import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { TranslationNotice } from "@/components/layout/translation-notice";
import { FaqAccordion } from "@/components/faq/faq-accordion";

export const metadata: Metadata = { title: "FAQ" };

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div>
      <PageHeader title="Frequently Asked Questions" breadcrumb={[{ label: tNav("home"), href: "/" }, { label: tNav("faq") }]} />
      <div className="container-page max-w-2xl pb-16 md:pb-24">
        <TranslationNotice variant="legal" />
        <FaqAccordion />
      </div>
    </div>
  );
}
