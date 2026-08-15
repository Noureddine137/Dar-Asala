"use client";

import Link from "next/link";
import { useConsentStore } from "@/lib/store/consent-store";
import { useMounted } from "@/lib/hooks/use-mounted";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const choice = useConsentStore((s) => s.choice);
  const setChoice = useConsentStore((s) => s.setChoice);
  const mounted = useMounted();

  if (!mounted || choice !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-sand bg-ivory p-5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:flex md:items-center md:justify-between md:gap-6 md:p-6"
    >
      <p className="text-sm text-charcoal/85">
        We use essential cookies to run this site, and optional analytics cookies to understand how
        it&rsquo;s used. Non-essential cookies are only enabled with your consent. See our{" "}
        <Link href="/legal/cookies" className="underline">
          Cookie Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-3 md:mt-0 md:shrink-0">
        <Button variant="secondary" size="sm" onClick={() => setChoice("rejected")}>
          Reject Non-Essential
        </Button>
        <Button size="sm" onClick={() => setChoice("accepted")}>
          Accept All
        </Button>
      </div>
    </div>
  );
}
