import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div>
      <PageHeader title="Shipping" breadcrumb={[{ label: "Home", href: "/" }, { label: "Shipping" }]} />
      <div className="container-page max-w-2xl space-y-8 pb-16 text-sm leading-relaxed text-charcoal/80 md:pb-24">
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Processing Time</h2>
          <p>
            In-stock pieces ship within 1–3 business days. Made-to-order and custom pieces are
            handcrafted first and typically ship within 7–14 business days — the exact estimate is
            shown on each product page.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Rates & Destinations</h2>
          <p>
            We currently ship to the EU, the UK, Switzerland and the United States. Shipping is free
            on orders over €250; a flat rate applies below that threshold, calculated at checkout
            based on your delivery address.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Tracking</h2>
          <p>
            You&rsquo;ll receive a tracking link by email as soon as your order ships. Delivery
            typically takes 3–7 business days after dispatch, depending on destination.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Customs & Duties</h2>
          <p>
            Orders shipped outside the EU may be subject to local import duties and taxes, which are
            the responsibility of the recipient and are not included in our shipping charges.
          </p>
        </section>
        <p className="text-xs text-muted">
          This page is a general reference and should be reviewed against your business&rsquo;s actual
          shipping carriers and rates before launch.
        </p>
      </div>
    </div>
  );
}
