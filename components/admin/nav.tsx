"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export type NavGroup = { label: string; items: { href: string; label: string }[] };

export const ADMIN_NAV: NavGroup[] = [
  {
    label: "Catalog",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/products", label: "Products" },
      { href: "/admin/collections", label: "Collections" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders" },
      { href: "/admin/customers", label: "Customers" },
      { href: "/admin/discounts", label: "Discounts" },
    ],
  },
  {
    label: "Engagement",
    items: [
      { href: "/admin/reviews", label: "Reviews" },
      { href: "/admin/custom-requests", label: "Custom Requests" },
      { href: "/admin/newsletter", label: "Newsletter" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/homepage", label: "Homepage" },
      { href: "/admin/settings", label: "Store Settings" },
      { href: "/admin/shipping", label: "Shipping" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-6">
      {ADMIN_NAV.map((group) => (
        <div key={group.label}>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-sm px-2.5 py-1.5 text-sm transition-colors",
                    isActive(pathname, item.href)
                      ? "bg-charcoal text-ivory"
                      : "text-charcoal/80 hover:bg-sand/50"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
      {ADMIN_NAV.flatMap((group) => group.items).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium",
            isActive(pathname, item.href)
              ? "border-charcoal bg-charcoal text-ivory"
              : "border-sand text-charcoal/80"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
