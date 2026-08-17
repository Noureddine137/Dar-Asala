import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/layout/page-header";
import { getShippingZonesForDisplay } from "@/lib/commerce/shipping";
import { getStoreSettings } from "@/lib/content/store-settings";
import { formatPrice } from "@/lib/utils/format";
import type { Locale } from "@/i18n/routing";

export const metadata: Metadata = { title: "Shipping" };

type Props = { params: Promise<{ locale: string }> };

export default async function ShippingPage({ params }: Props) {
  const { locale } = await params;
  const [zones, settings, t, tProduct, tNav] = await Promise.all([
    getShippingZonesForDisplay(locale as Locale),
    getStoreSettings(),
    getTranslations({ locale, namespace: "shippingPage" }),
    getTranslations({ locale, namespace: "product" }),
    getTranslations({ locale, namespace: "nav" }),
  ]);

  return (
    <div>
      <PageHeader title={t("title")} breadcrumb={[{ label: tNav("home"), href: "/" }, { label: t("title") }]} />
      <div className="container-page max-w-2xl space-y-8 pb-16 text-sm leading-relaxed text-charcoal/80 md:pb-24">
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">{t("processingTime")}</h2>
          <p>{t("processingTimeBody", { productionTime: settings.defaultProductionTime.toLowerCase() })}</p>
        </section>

        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">{t("ratesDestinations")}</h2>
          {zones.length === 0 ? (
            <p>{t("ratesFinalizing")}</p>
          ) : (
            <div className="mt-4 divide-y divide-sand rounded-sm border border-sand bg-ivory">
              {zones.map((z) => (
                <div key={z.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-charcoal">{z.region}</p>
                    <p className="text-xs text-muted">
                      {z.countries} · {z.estimate}
                      {z.carrier ? ` · ${z.carrier}` : ""}
                    </p>
                  </div>
                  <p className="text-right text-xs text-charcoal/80">
                    {z.freeThreshold != null ? (
                      <>
                        {tProduct("freeOverThreshold", { threshold: formatPrice(z.freeThreshold, "EUR", locale as Locale) })}
                        <br />
                        <span className="text-muted">
                          {tProduct("otherwise", { price: formatPrice(z.price, "EUR", locale as Locale) })}
                        </span>
                      </>
                    ) : (
                      formatPrice(z.price, "EUR", locale as Locale)
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">{t("tracking")}</h2>
          <p>{t("trackingBody")}</p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">{t("customsDuties")}</h2>
          <p>{t("customsDutiesBody")}</p>
        </section>
        <p className="text-xs text-muted">{t("adminNote")}</p>
      </div>
    </div>
  );
}
