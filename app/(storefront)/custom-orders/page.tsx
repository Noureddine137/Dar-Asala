import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CustomOrderForm } from "@/components/forms/custom-order-form";

export const metadata: Metadata = {
  title: "Custom Orders",
  description: "Commission a bespoke, hand-built Dar Asala bag — your leather, your details.",
};

export default function CustomOrdersPage() {
  return (
    <div>
      <PageHeader
        title="Made for You"
        image="/images/brand/custom-orders.webp"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Custom Orders" }]}
      />
      <div className="container-page py-14 md:py-20">
        <p className="mb-10 max-w-xl text-base leading-relaxed text-charcoal/80">
          Choose your leather, color, strap and selected finishing details, and our artisans will
          hand-build a piece around your choices. Submit the form below and an atelier specialist
          will follow up with options, timeline and pricing — typically 2–3 business days.
        </p>
        <CustomOrderForm />
      </div>
    </div>
  );
}
