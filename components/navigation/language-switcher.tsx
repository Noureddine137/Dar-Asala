"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, LOCALE_LABELS, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils/cn";

type LanguageSwitcherProps = {
  className?: string;
  selectClassName?: string;
  id?: string;
};

// A native <select> keeps this keyboard/screen-reader accessible for free.
// router.replace(pathname, { locale }) re-resolves the *current* path under
// the new locale, so switching language never bounces the visitor back to
// the homepage. The query string (e.g. /search?q=...) is read from
// window.location only inside the click handler, not at render time — using
// next/navigation's useSearchParams() here would force every page that
// renders this component (i.e. every storefront page, via the header) to
// bail out of static rendering.
export function LanguageSwitcher({ className, selectClassName, id = "language-switcher" }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("languageSwitcher");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    const query = typeof window !== "undefined" ? window.location.search : "";
    const href = query ? `${pathname}${query}` : pathname;
    startTransition(() => {
      router.replace(href, { locale: nextLocale });
    });
  }

  return (
    <div className={cn("inline-flex items-center", className)}>
      <label className="sr-only" htmlFor={id}>
        {t("label")}
      </label>
      <select
        id={id}
        value={locale}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as Locale)}
        className={cn(
          "cursor-pointer appearance-none bg-transparent text-inherit disabled:opacity-60",
          selectClassName
        )}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l} className="text-charcoal">
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
