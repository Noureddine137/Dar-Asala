"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function SortSelect({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("general");

  const OPTIONS = [
    { value: "featured", label: t("featured") },
    { value: "newest", label: t("newest") },
    { value: "price-asc", label: t("priceLowToHigh") },
    { value: "price-desc", label: t("priceHighToLow") },
  ];

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <label className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="hidden font-semibold uppercase tracking-wide text-muted sm:inline">{t("sortBy")}</span>
      <select
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-sm border border-sand bg-ivory px-3 py-2 text-charcoal focus:border-charcoal focus:outline-none"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
