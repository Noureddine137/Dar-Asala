import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Profile", robots: { index: false, follow: true } };

type Props = { params: Promise<{ locale: string }> };

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  const [tNav, t] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "account" }),
  ]);

  return (
    <div>
      <PageHeader
        title={t("profileAddresses")}
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: t("title"), href: "/account" }, { label: t("profileAddresses") }]}
      />
      <div className="container-page pb-16 md:pb-24">
        <p className="max-w-md text-sm text-muted">{t("profileBody")}</p>
      </div>
    </div>
  );
}
