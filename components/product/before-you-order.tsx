"use client";

import { useTranslations } from "next-intl";

export function BeforeYouOrder() {
  const t = useTranslations("product");
  const notes = t.raw("beforeYouOrderNotes") as { title: string; copy: string }[];

  return (
    <div>
      <p className="mb-4 font-serif-display text-xl text-charcoal md:text-2xl">{t("beforeYouOrder")}</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {notes.map((note) => (
          <div key={note.title} className="rounded-sm bg-sand/50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-leather">{note.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{note.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
