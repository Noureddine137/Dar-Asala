import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Your Bag",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartPageContent />;
}
