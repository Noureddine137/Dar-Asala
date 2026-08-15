"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { useUIStore } from "@/lib/store/ui-store";
import { SHOP_LINKS, BRAND_LINKS, HELP_LINKS } from "@/lib/content/navigation";

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
            <div className="py-5 text-sm text-muted">
              <Link href="/account" onClick={close} className="block py-1.5">
                Account
              </Link>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span>EUR €</span>
                <span aria-hidden="true">·</span>
                <span>English</span>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
