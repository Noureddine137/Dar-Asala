import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/page-header";
import { JOURNAL_ARTICLES } from "@/lib/content/journal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return JOURNAL_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return { title: article.title, description: article.dek };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  return (
    <div>
      <PageHeader
        title={article.title}
        description={article.dek}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: article.title }]}
      />
      <div className="container-page max-w-2xl pb-16 md:pb-24">
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-sm">
          <Image src={article.image} alt={article.title} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
        </div>
        <div className="space-y-5 text-base leading-relaxed text-charcoal/85">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
