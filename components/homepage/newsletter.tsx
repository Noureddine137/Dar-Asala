import { NewsletterForm } from "./newsletter-form";
import { getStoreSettings } from "@/lib/content/store-settings";

export async function Newsletter() {
  const settings = await getStoreSettings();

  return (
    <section className="bg-charcoal py-16 text-ivory md:py-24">
      <div className="container-page max-w-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brass">Newsletter</p>
        <h2 className="font-serif-display text-3xl leading-tight md:text-4xl">{settings.newsletterHeading}</h2>
        <p className="mt-4 text-base text-ivory/75">{settings.newsletterBody}</p>
        <div className="mt-7">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
