import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { WishlistContent } from "@/components/account/wishlist-content";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: true } };

export default function WishlistPage() {
  return (
    <div>
      <PageHeader title="Wishlist" breadcrumb={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <div className="container-page pb-16 md:pb-24">
        <WishlistContent />
      </div>
    </div>
  );
}
