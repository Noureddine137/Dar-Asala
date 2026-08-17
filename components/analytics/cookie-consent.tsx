"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useConsentStore } from "@/lib/store/consent-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const t = useTranslations("cookieConsent");
  const choice = useConsentStore((s) => s.choice);
  const setChoice = useConsentStore((s) => s.setChoice);
  const mounted = useMounted();

  if (!mounted || choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-sand bg-ivory p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:flex md:items-center md:justify-between md:gap-6 md:p-6"
    >
      <p className="text-sm text-charcoal/85">
        {t.rich("body", {
          cookiePolicyLink: (chunks) => (
            <Link href="/legal/cookies" className="underline">
              {chunks}
            </Link>
          ),
        })}
      </p>
      <div className="mt-4 flex gap-3 md:mt-0 md:shrink-0">
        <Button variant="secondary" size="sm" onClick={() => setChoice("rejected")}>
          {t("reject")}
        </Button>
        <Button size="sm" onClick={() => setChoice("accepted")}>
          {t("accept")}
        </Button>
      </div>
    </div>
  );
}
