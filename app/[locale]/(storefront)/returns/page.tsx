import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div>
      <PageHeader title="Returns" breadcrumb={[{ label: "Home", href: "/" }, { label: "Returns" }]} />
      <div className="container-page max-w-2xl space-y-8 pb-16 text-sm leading-relaxed text-charcoal/80 md:pb-24">
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Return Window</h2>
          <p>
            Unused, unworn items in their original condition and packaging can be returned within 14
            days of delivery for a full refund to your original payment method.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Made-to-Order & Custom Pieces</h2>
          <p>
            Because made-to-order and custom pieces are cut specifically for your order, they are
            final sale unless a manufacturing defect is found. Please review dimensions and details
            carefully before ordering.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">How to Start a Return</h2>
          <p>
            Contact us at hello@darasala.example with your order number. We&rsquo;ll send return
            instructions and a shipping label where applicable.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-serif-display text-xl text-charcoal">Refunds</h2>
          <p>
            Once your return is received and inspected, refunds are issued within 5–10 business days
            to your original payment method.
          </p>
        </section>
        <p className="text-xs text-muted">
          This page is a general reference and should be reviewed against applicable consumer
          protection law in your target markets before launch.
        </p>
      </div>
    </div>
  );
}
