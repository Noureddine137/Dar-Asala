import { NewsletterForm } from "./newsletter-form";

export function Newsletter() {
  return (
    <section className="bg-charcoal py-16 text-ivory md:py-24">
      <div className="container-page max-w-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-brass">Newsletter</p>
        <h2 className="font-serif-display text-3xl leading-tight md:text-4xl">Letters from the Atelier</h2>
        <p className="mt-4 text-base text-ivory/75">
          New pieces, artisan stories and private releases — straight to your inbox, roughly once a
          month.
        </p>
        <div className="mt-7">
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
