import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Profile", robots: { index: false, follow: true } };

export default function ProfilePage() {
  return (
    <div>
      <PageHeader
        title="Profile & Addresses"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }, { label: "Profile" }]}
      />
      <div className="container-page pb-16 md:pb-24">
        <p className="max-w-md text-sm text-muted">
          Saved profiles and addresses will be available once customer accounts launch. Shipping
          details are collected securely at checkout in the meantime.
        </p>
      </div>
    </div>
  );
}
