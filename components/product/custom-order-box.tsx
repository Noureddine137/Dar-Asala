import { MessageCircle, Mail } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getLocalizedStoreSettings } from "@/lib/content/store-settings";
import type { Locale } from "@/i18n/routing";

export async function CustomOrderBox({ productName }: { productName: string }) {
  const locale = (await getLocale()) as Locale;
  const [settings, t] = await Promise.all([getLocalizedStoreSettings(locale), getTranslations("customOrderBox")]);
  const whatsappHref = settings.whatsappNumber
    ? `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(t("whatsappMessage", { productName }))}`
    : null;
  const emailHref = `mailto:${settings.contactEmail}?subject=${encodeURIComponent(t("emailSubject", { productName }))}`;

  return (
    <div className="rounded-sm border border-tan bg-sand/50 p-6">
      <p className="font-serif-display text-xl text-charcoal">{t("title")}</p>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{t("body")}</p>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-charcoal px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
          >
            <MessageCircle className="h-4 w-4" />
            {t("whatsappUs")}
          </a>
        )}
        <a
          href={emailHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-charcoal px-4 py-3 text-sm font-medium text-ivory transition-colors hover:bg-leather"
        >
          <Mail className="h-4 w-4" />
          {t("emailAtelier")}
        </a>
      </div>
    </div>
  );
}
