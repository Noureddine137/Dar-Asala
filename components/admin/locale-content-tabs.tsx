"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { key: "en", label: "English" },
  { key: "de", label: "Deutsch" },
  { key: "fr", label: "Français" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 * Locale tabs for admin content editors (Product/Collection/Homepage CMS).
 * Each tab is a fully independent <form> with its own Server Action — DE/FR
 * tabs post to a *Translation upsert action, the English tab keeps posting
 * to the existing update action untouched. A tab whose translation is
 * missing/incomplete gets a small dot so gaps are obvious without opening it.
 */
export function LocaleContentTabs({
  en,
  de,
  fr,
  missing,
}: {
  en: ReactNode;
  de: ReactNode;
  fr: ReactNode;
  missing?: { de?: boolean; fr?: boolean };
}) {
  const [active, setActive] = useState<TabKey>("en");
  const panels: Record<TabKey, ReactNode> = { en, de, fr };

  return (
    <div>
      <div className="flex gap-1 border-b border-sand" role="tablist" aria-label="Content language">
        {TABS.map((tab) => {
          const isMissing = tab.key !== "en" && missing?.[tab.key as "de" | "fr"];
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active === tab.key}
              onClick={() => setActive(tab.key)}
              className={cn(
                "-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                active === tab.key ? "border-charcoal text-charcoal" : "border-transparent text-muted hover:text-charcoal"
              )}
            >
              {tab.label}
              {isMissing && (
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-terracotta"
                  title="Missing or incomplete translation"
                  aria-label="Missing or incomplete translation"
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="pt-5">{panels[active]}</div>
    </div>
  );
}
