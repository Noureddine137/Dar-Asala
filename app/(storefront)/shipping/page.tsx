import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { prisma } from "@/lib/db/prisma";
import { getStoreSettings } from "@/lib/content/store-settings";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Shipping" };

export default async function ShippingPage() {
  const [zones, settings] = await Promise.all([
    prisma.shippingZone.findMany({ where: { active: true }, orderBy: { position: "asc" } }),
    getStoreSettings(),
  ]);

  return (
    <div>
      <PageHeader title="Shipping" breadcrumb={[{ label: "Home", href: "/" }, { label: "Shipping" }]} />
      <div className="container-page max-w-2xl space-y-8 pb-16 text-sm leading-relaxed text-charcoal/80 md:pb-24">
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Processing Time</h2>
          <p>
            In-stock pieces ship within 1–3 business days. Made-to-order and custom pieces are
            handcrafted first — {settings.defaultProductionTime.toLowerCase()}. The exact estimate is
            shown on each product page.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Rates &amp; Destinations</h2>
          {zones.length === 0 ? (
            <p>Shipping rates are being finalized — check back soon, or contact us for a destination estimate.</p>
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
                        Free over {formatPrice(Number(z.freeThreshold))}
                        <br />
                        <span className="text-muted">{formatPrice(Number(z.price))} otherwise</span>
                      </>
                    ) : (
                      formatPrice(Number(z.price))
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Tracking</h2>
          <p>
            You&rsquo;ll receive a tracking link by email as soon as your order ships. Delivery time
            depends on destination — see the estimates above.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Customs &amp; Duties</h2>
          <p>
            Orders shipped outside the EU may be subject to local import duties and taxes, which are
            the responsibility of the recipient and are not included in our shipping charges.
          </p>
        </section>
        <p className="text-xs text-muted">
          Rates and regions above are managed in Store Admin → Shipping and should be reviewed
          against your business&rsquo;s actual shipping carriers before launch.
        </p>
      </div>
    </div>
  );
}
