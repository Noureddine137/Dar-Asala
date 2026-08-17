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

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82c-.83-.9-1.29-2.07-1.29-3.32h-3.02v13.6a2.6 2.6 0 1 1-1.85-2.49V10.5a5.6 5.6 0 1 0 4.87 5.55V9.1a6.9 6.9 0 0 0 4.02 1.28V7.36c-1-.05-1.94-.6-2.73-1.54z" />
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

type MobileMenuProps = {
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
};

export function MobileMenu({ instagramUrl, facebookUrl, tiktokUrl }: MobileMenuProps) {
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
              {(instagramUrl || facebookUrl || tiktokUrl) && (
                <div className="mt-6 flex items-center gap-5">
                  {instagramUrl && (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-charcoal">
                      <InstagramIcon className="h-5 w-5" />
                    </a>
                  )}
                  {facebookUrl && (
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-charcoal">
                      <FacebookIcon className="h-5 w-5" />
                    </a>
                  )}
                  {tiktokUrl && (
                    <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-charcoal">
                      <TikTokIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
