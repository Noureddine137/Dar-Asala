import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = { title: "Order History", robots: { index: false, follow: true } };

type Props = { params: Promise<{ locale: string }> };

export default async function OrdersPage({ params }: Props) {
  const { locale } = await params;
  const [tNav, t] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "account" }),
  ]);

  return (
    <div>
      <PageHeader
        title={t("orderHistory")}
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: t("title"), href: "/account" }, { label: t("orderHistory") }]}
      />
      <div className="container-page pb-16 md:pb-24">
        <p className="max-w-md text-sm text-muted">
          {t.rich("ordersBody", {
            contactLink: (chunks) => (
              <Link href="/contact" className="text-charcoal underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
    </div>
  );
}
