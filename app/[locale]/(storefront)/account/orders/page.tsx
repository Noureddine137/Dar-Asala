import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Order History", robots: { index: false, follow: true } };

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        title="Order History"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }, { label: "Orders" }]}
      />
      <div className="container-page pb-16 md:pb-24">
        <p className="max-w-md text-sm text-muted">
          Order history will appear here once customer accounts launch. If you need details on an
          existing order, please{" "}
          <a href="/contact" className="text-charcoal underline">
            contact us
          </a>{" "}
          with your order confirmation email.
        </p>
      </div>
    </div>
  );
}
