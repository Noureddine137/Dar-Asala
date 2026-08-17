import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import { Link } from "@/i18n/navigation";
import { getStoreSettings } from "@/lib/content/store-settings";

export const metadata: Metadata = { title: "Contact" };

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const [settings, tNav, t] = await Promise.all([
    getStoreSettings(),
    getTranslations({ locale, namespace: "nav" }),
    getTranslations({ locale, namespace: "contact" }),
  ]);

  return (
    <div>
      <PageHeader
        title={tNav("contact")}
        description={t("description")}
        breadcrumb={[{ label: tNav("home"), href: "/" }, { label: tNav("contact") }]}
      />
      <div className="container-page grid gap-12 pb-16 md:grid-cols-[1fr_320px] md:pb-24">
        <ContactForm />
        <div className="space-y-6 text-sm text-charcoal/80">
          <div>
            <h2 className="mb-1 font-medium text-charcoal">{t("email")}</h2>
            <p>{settings.contactEmail}</p>
          </div>
          {settings.contactPhone && (
            <div>
              <h2 className="mb-1 font-medium text-charcoal">{t("phone")}</h2>
              <p>{settings.contactPhone}</p>
            </div>
          )}
          {settings.businessAddress && (
            <div>
              <h2 className="mb-1 font-medium text-charcoal">{t("address")}</h2>
              <p>{settings.businessAddress}</p>
            </div>
          )}
          <div>
            <h2 className="mb-1 font-medium text-charcoal">{t("responseTime")}</h2>
            <p>{t("responseTimeValue")}</p>
          </div>
          <div>
            <h2 className="mb-1 font-medium text-charcoal">{t("customOrders")}</h2>
            <p>
              {t.rich("customOrdersBody", {
                customOrdersLink: (chunks) => (
                  <Link href="/custom-orders" className="underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
