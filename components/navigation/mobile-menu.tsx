"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { SHOP_LINKS, BRAND_LINKS, HELP_LINKS } from "@/lib/content/navigation";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-8.2h2.75l.41-3.2h-3.16V7.55c0-.93.26-1.56 1.59-1.56h1.7V3.14C15.98 3.1 15.03 3 13.92 3c-2.32 0-3.92 1.42-3.92 4.02v2.58H7.25v3.2H10V21h3.5z" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.63 7.86 6.35 9.33-.09-.79-.17-2.01.03-2.88.18-.78 1.18-4.97 1.18-4.97s-.3-.6-.3-1.49c0-1.4.81-2.44 1.82-2.44.86 0 1.27.64 1.27 1.41 0 .86-.55 2.15-.83 3.34-.24 1 .5 1.81 1.48 1.81 1.78 0 3.15-1.87 3.15-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.13-4.52 4.34 0 .86.33 1.78.75 2.28.08.1.09.18.07.28-.08.32-.25 1-.29 1.14-.05.19-.15.23-.35.14-1.32-.61-2.14-2.53-2.14-4.08 0-3.32 2.41-6.37 6.96-6.37 3.65 0 6.49 2.6 6.49 6.08 0 3.63-2.29 6.55-5.46 6.55-1.07 0-2.07-.55-2.42-1.21l-.66 2.5c-.24.92-.88 2.08-1.31 2.78.99.3 2.03.47 3.12.47 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

function Section({ title, links, onNavigate }: { title: string; links: { label: string; href: string }[]; onNavigate: () => void }) {
  return (
    <div className="border-b border-sand/70 py-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">{title}</h3>
      <ul className="flex flex-col">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              onClick={onNavigate}
              className="flex items-center justify-between py-2.5 text-base text-charcoal"
            >
              {link.label}
              <ChevronRight className="h-4 w-4 text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MobileMenu() {
  const overlay = useUIStore((s) => s.overlay);
  const close = useUIStore((s) => s.close);
  const open = overlay === "menu";

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && close()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-charcoal/40 data-[state=open]:animate-fade-in" />
        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex h-full w-[86%] max-w-sm flex-col bg-ivory shadow-xl focus:outline-none data-[state=open]:animate-slide-in-left">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Description className="sr-only">Site navigation</Dialog.Description>
          <div className="flex items-center justify-between border-b border-sand/70 px-5 py-4">
            <span className="font-serif-display text-xl text-charcoal">Dar Asala</span>
            <Dialog.Close asChild>
              <button aria-label="Close menu" className="flex h-9 w-9 items-center justify-center text-charcoal">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <Section title="Shop" links={SHOP_LINKS} onNavigate={close} />
            <Section title="The Brand" links={BRAND_LINKS} onNavigate={close} />
            <Section title="Help" links={HELP_LINKS} onNavigate={close} />
            <div
              className="py-6 text-sm text-muted"
              style={{ paddingBottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))" }}
            >
              <Link href="/account" onClick={close} className="block py-1.5 text-charcoal">
                Account
              </Link>
              <button type="button" className="mt-3 flex items-center gap-2 text-xs">
                <span>EN / EUR</span>
                <ChevronRight className="h-3 w-3 rotate-90" />
              </button>
              <div className="mt-6 flex items-center gap-5">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-charcoal">
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-charcoal">
                  <FacebookIcon className="h-5 w-5" />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest" className="text-charcoal">
                  <PinterestIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
