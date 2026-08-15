"use client";

import Link from "next/link";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useUIStore } from "@/lib/store/ui-store";
import { useCartStore, cartCount } from "@/lib/store/cart-store";
import { HEADER_PRIMARY_LINKS } from "@/lib/content/navigation";
import { cn } from "@/lib/utils/cn";
import { useMounted } from "@/lib/hooks/use-mounted";

export function Header() {
  const openMenu = useUIStore((s) => s.openMenu);
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const items = useCartStore((s) => s.items);
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = mounted ? cartCount(items) : 0;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur transition-colors",
        scrolled ? "border-sand" : "border-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center text-charcoal"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center text-charcoal"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {HEADER_PRIMARY_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wide text-charcoal/80 transition-colors hover:text-charcoal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif-display text-2xl tracking-wide text-charcoal md:static md:translate-x-0 md:translate-y-0"
        >
          Dar Asala
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="hidden h-10 w-10 items-center justify-center text-charcoal md:flex"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-10 w-10 items-center justify-center text-charcoal md:flex"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative flex h-10 w-10 items-center justify-center text-charcoal"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-semibold text-ivory">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
