import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import { getStoreSettings } from "@/lib/content/store-settings";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <PageHeader
        title="Contact Us"
        description="Questions about an order, a custom piece, or anything else — we're glad to help."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="container-page grid gap-12 pb-16 md:grid-cols-[1fr_320px] md:pb-24">
        <ContactForm />
        <div className="space-y-6 text-sm text-charcoal/80">
          <div>
            <h2 className="mb-1 font-medium text-charcoal">Email</h2>
            <p>{settings.contactEmail}</p>
          </div>
          {settings.contactPhone && (
            <div>
              <h2 className="mb-1 font-medium text-charcoal">Phone</h2>
              <p>{settings.contactPhone}</p>
            </div>
          )}
          {settings.businessAddress && (
            <div>
              <h2 className="mb-1 font-medium text-charcoal">Address</h2>
              <p>{settings.businessAddress}</p>
            </div>
          )}
          <div>
            <h2 className="mb-1 font-medium text-charcoal">Response Time</h2>
            <p>1–2 business days, Monday to Friday.</p>
          </div>
          <div>
            <h2 className="mb-1 font-medium text-charcoal">Custom Orders</h2>
            <p>
              For bespoke pieces, visit our{" "}
              <a href="/custom-orders" className="underline">
                Custom Orders
              </a>{" "}
              page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
