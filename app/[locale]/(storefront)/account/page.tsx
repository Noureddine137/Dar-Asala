import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Heart, Package, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: true } };

type Props = { params: Promise<{ locale: string }> };

export default async function AccountPage({ params }: Props) {
  const { locale } = await params;
  const [tNav, t] = await Promise.all([
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "account" }),
  ]);

  const LINKS = [
    { href: "/wishlist", label: t("wishlist"), description: t("wishlistDescription"), icon: Heart },
    { href: "/account/orders", label: t("orderHistory"), description: t("orderHistoryDescription"), icon: Package },
    { href: "/account/profile", label: t("profileAddresses"), description: t("profileAddressesDescription"), icon: UserCircle },
  ];

  return (
    <div>
      <PageHeader
        title={t("title")}
        description={t("description")}
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: t("title") }]}
      />
      <div className="container-page grid gap-4 pb-16 sm:grid-cols-3 md:pb-24">
        {LINKS.map(({ href, label, description, icon: Icon }) => (
          <Link key={href} href={href} className="rounded-sm border border-sand p-6 transition-colors hover:border-charcoal">
            <Icon className="h-5 w-5 text-camel" />
            <p className="mt-3 font-serif-display text-lg text-charcoal">{label}</p>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
