import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = { title: "Admin | Dar Asala", robots: { index: false, follow: false } };

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/custom-requests", label: "Custom Requests" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory font-sans text-charcoal">
      <div className="border-b border-sand/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="font-serif-display text-xl">
            Dar Asala <span className="text-sm text-muted">Admin</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="text-charcoal/80 hover:text-charcoal">
                {item.label}
              </Link>
            ))}
            <Link href="/" className="text-muted hover:text-charcoal">
              View Store →
            </Link>
          </nav>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
