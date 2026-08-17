import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { FaqAccordion } from "@/components/faq/faq-accordion";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div>
      <PageHeader title="Frequently Asked Questions" breadcrumb={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <div className="container-page max-w-2xl pb-16 md:pb-24">
        <FaqAccordion />
      </div>
    </div>
  );
}
