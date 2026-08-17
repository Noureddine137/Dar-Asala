import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Heart, Package, UserCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: true } };

const LINKS = [
  { href: "/wishlist", label: "Wishlist", description: "Pieces you've saved for later.", icon: Heart },
  { href: "/account/orders", label: "Order History", description: "Track and review past orders.", icon: Package },
  { href: "/account/profile", label: "Profile & Addresses", description: "Manage your saved details.", icon: UserCircle },
];

export default function AccountPage() {
  return (
    <div>
      <PageHeader
        title="Account"
        description="Customer accounts are coming soon. In the meantime, your wishlist is saved automatically on this device."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Account" }]}
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
