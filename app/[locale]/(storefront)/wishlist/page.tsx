import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { WishlistContent } from "@/components/account/wishlist-content";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: true } };

type Props = { params: Promise<{ locale: string }> };

export default async function WishlistPage({ params }: Props) {
  const { locale } = await params;
  const [tNav, t] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "account" }),
  ]);

  return (
    <div>
      <PageHeader title={t("wishlist")} breadcrumb={[{ label: tNav("home"), href: "/" }, { label: t("wishlist") }]} />
      <div className="container-page pb-16 md:pb-24">
        <WishlistContent />
      </div>
    </div>
  );
}
