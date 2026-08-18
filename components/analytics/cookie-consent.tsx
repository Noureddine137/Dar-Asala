"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsentStore } from "@/lib/store/consent-store";
import { useUIStore } from "@/lib/store/ui-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { Button } from "@/components/ui/button";

// Mobile is a small, safe-area-aware floating card rather than a full-height
// bar — the old stacked layout (paragraph, then a separate button row) ran
// tall enough to sit over the hero CTA, filter/search overlays, and PDP
// content on short viewports. Desktop keeps its original full-width bar
// treatment, which was already compact relative to viewport height.
// Hidden while a drawer/dialog is open (menu, search, cart) so it never
// stacks on top of them; the sticky mobile Add to Cart bar suppresses
// itself independently (see purchase-panel.tsx) while consent is pending,
// so the two never overlap either.
export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const choice = useConsentStore((s) => s.choice);
  const setChoice = useConsentStore((s) => s.setChoice);
  const overlay = useUIStore((s) => s.overlay);
  const mounted = useMounted();

  if (!mounted || choice !== null || overlay !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={t("label")}
      className="fixed inset-x-3 bottom-[calc(0.6rem+env(safe-area-inset-bottom))] z-[60] rounded-md border border-sand bg-ivory p-3.5 shadow-[0_8px_28px_rgba(44,42,38,0.18)] md:inset-x-0 md:bottom-0 md:flex md:items-center md:justify-between md:gap-6 md:rounded-none md:border-x-0 md:border-b-0 md:p-6 md:shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
    >
      <p className="text-[11px] leading-snug text-charcoal/85 md:text-sm">
        {t.rich("body", {
          cookiePolicyLink: (chunks) => (
            <Link href="/legal/cookies" className="underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
      <div className="mt-2.5 flex gap-2 md:mt-0 md:shrink-0">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 flex-1 px-2.5 text-[11px] md:h-9 md:flex-initial md:px-4 md:text-xs"
          onClick={() => setChoice("rejected")}
        >
          {t("reject")}
        </Button>
        <Button
          size="sm"
          className="h-8 flex-1 px-2.5 text-[11px] md:h-9 md:flex-initial md:px-4 md:text-xs"
          onClick={() => setChoice("accepted")}
        >
          {t("accept")}
        </Button>
      </div>
    </div>
  );
}
