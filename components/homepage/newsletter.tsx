import { getLocale, getTranslations } from "next-intl/server";
import { NewsletterForm } from "./newsletter-form";
import { getLocalizedStoreSettings } from "@/lib/content/store-settings";
import type { Locale } from "@/i18n/routing";

export async function Newsletter() {
  const locale = (await getLocale()) as Locale;
  const [settings, t] = await Promise.all([getLocalizedStoreSettings(locale), getTranslations("home")]);

  return (
    <section className="bg-charcoal py-16 text-ivory md:py-24">
      <div className="container-page max-w-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brass">{t("newsletterLabel")}</p>
        <h2 className="font-serif-display text-3xl leading-tight md:text-4xl">{settings.newsletterHeading}</h2>
        <p className="mt-4 text-base text-ivory/75">{settings.newsletterBody}</p>
        <div className="mt-7">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
