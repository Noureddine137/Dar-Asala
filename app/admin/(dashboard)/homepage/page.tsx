import type { ReactNode } from "react";
import { getStoreSettings } from "@/lib/content/store-settings";
import { prisma } from "@/lib/db/prisma";
import {
  updateHomepageMedia,
  updateHomepageContentEn,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/admin/content-actions";
import { updateHomepageTranslation, updateTestimonialTranslation } from "@/lib/admin/translation-actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";
import { LocaleContentTabs } from "@/components/admin/locale-content-tabs";

export default async function AdminHomepagePage() {
  const [settings, testimonials, settingsTranslations, testimonialTranslations] = await Promise.all([
    getStoreSettings(),
    prisma.testimonial.findMany({ orderBy: { position: "asc" } }),
    prisma.storeSettingsTranslation.findMany({ where: { settingsId: "singleton" } }),
    prisma.testimonialTranslation.findMany(),
  ]);

  const deSettings = settingsTranslations.find((t) => t.locale === "DE");
  const frSettings = settingsTranslations.find((t) => t.locale === "FR");
  const boundContentDe = updateHomepageTranslation.bind(null, "de");
  const boundContentFr = updateHomepageTranslation.bind(null, "fr");

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif-display text-3xl">Homepage Content</h1>
      <p className="mt-1 text-sm text-muted">
        Edits here update the live homepage immediately — no code changes needed.
      </p>

      <div className="mt-8">
        <h2 className="mb-1 font-serif-display text-xl">Images &amp; Links</h2>
        <p className="mb-4 text-xs text-muted">Shared across every language — never duplicated per translation.</p>
        <form action={updateHomepageMedia} className="space-y-5 rounded-sm border border-sand p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Hero Image URL">
              <input name="heroImageUrl" defaultValue={settings.heroImageUrl} className="input" />
            </Field>
            <Field label="Hero CTA Link">
              <input name="heroCtaHref" defaultValue={settings.heroCtaHref} className="input" />
            </Field>
            <Field label="Brand Story Image URL">
              <input name="brandStoryImageUrl" defaultValue={settings.brandStoryImageUrl} className="input" />
            </Field>
            <Field label="Custom Order Image URL">
              <input name="customOrderImageUrl" defaultValue={settings.customOrderImageUrl} className="input" />
            </Field>
          </div>
          <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
            Save Images &amp; Links
          </button>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Content</h2>
        <p className="mb-4 text-xs text-muted">
          Headlines and body copy, translated per language. English is the fallback shown wherever a
          German or French translation is missing or incomplete.
        </p>
        <LocaleContentTabs
          missing={{
            de: !deSettings?.heroHeadline,
            fr: !frSettings?.heroHeadline,
          }}
          en={
            <form action={updateHomepageContentEn} className="space-y-8">
              <fieldset className="space-y-4 rounded-sm border border-sand p-5">
                <legend className="px-1 text-sm font-semibold">Hero</legend>
                <Field label="Headline">
                  <textarea name="heroHeadline" defaultValue={settings.heroHeadline} rows={2} className="input" />
                </Field>
                <Field label="Subtitle">
                  <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={2} className="input" />
                </Field>
                <Field label="CTA Label">
                  <input name="heroCtaLabel" defaultValue={settings.heroCtaLabel} className="input" />
                </Field>
              </fieldset>

              <fieldset className="space-y-4 rounded-sm border border-sand p-5">
                <legend className="px-1 text-sm font-semibold">Brand Story Section</legend>
                <Field label="Heading">
                  <input name="brandStoryHeading" defaultValue={settings.brandStoryHeading} className="input" />
                </Field>
                <Field label="Body (blank line separates paragraphs)">
                  <textarea name="brandStoryBody" defaultValue={settings.brandStoryBody} rows={5} className="input" />
                </Field>
              </fieldset>

              <fieldset className="space-y-4 rounded-sm border border-sand p-5">
                <legend className="px-1 text-sm font-semibold">Custom Order Section</legend>
                <Field label="Heading">
                  <input name="customOrderHeading" defaultValue={settings.customOrderHeading} className="input" />
                </Field>
                <Field label="Body">
                  <textarea name="customOrderBody" defaultValue={settings.customOrderBody} rows={3} className="input" />
                </Field>
              </fieldset>

              <fieldset className="space-y-4 rounded-sm border border-sand p-5">
                <legend className="px-1 text-sm font-semibold">Newsletter Section</legend>
                <Field label="Heading">
                  <input name="newsletterHeading" defaultValue={settings.newsletterHeading} className="input" />
                </Field>
                <Field label="Body">
                  <textarea name="newsletterBody" defaultValue={settings.newsletterBody} rows={2} className="input" />
                </Field>
              </fieldset>

              <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
                Save English Content
              </button>
            </form>
          }
          de={<HomepageTranslationForm action={boundContentDe} translation={deSettings} localeLabel="Deutsch" />}
          fr={<HomepageTranslationForm action={boundContentFr} translation={frSettings} localeLabel="Français" />}
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Testimonials</h2>
        <p className="mb-4 text-xs text-muted">
          The homepage &ldquo;What Customers Say&rdquo; section shows up to 3 active testimonials, in
          order. If none are active, the section is hidden rather than showing empty. Author, country,
          rating and avatar are shared across languages — only the quote itself is translated.
        </p>

        <div className="space-y-4">
          {testimonials.map((t) => {
            const boundUpdate = updateTestimonial.bind(null, t.id);
            const boundDelete = deleteTestimonial.bind(null, t.id);
            const deQuote = testimonialTranslations.find((tr) => tr.testimonialId === t.id && tr.locale === "DE");
            const frQuote = testimonialTranslations.find((tr) => tr.testimonialId === t.id && tr.locale === "FR");
            const boundQuoteDe = updateTestimonialTranslation.bind(null, t.id, "de");
            const boundQuoteFr = updateTestimonialTranslation.bind(null, t.id, "fr");
            return (
              <div key={t.id} className="rounded-sm border border-sand p-4">
                <form action={boundUpdate} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Quote (English)</span>
                    <textarea name="quote" defaultValue={t.quote} rows={2} className="input" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Author</span>
                    <input name="authorName" defaultValue={t.authorName} className="input" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Country</span>
                    <input name="country" defaultValue={t.country} className="input" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Rating (1-5)</span>
                    <input name="rating" type="number" min={1} max={5} defaultValue={t.rating} className="input" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Avatar URL</span>
                    <input name="avatarUrl" defaultValue={t.avatarUrl ?? ""} className="input" placeholder="Optional" />
                  </label>
                  <div className="flex items-center justify-between gap-3 sm:col-span-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" name="active" defaultChecked={t.active} /> Active
                    </label>
                    <button type="submit" className="text-xs underline">
                      Save
                    </button>
                  </div>
                </form>

                <div className="mt-3 grid grid-cols-1 gap-3 border-t border-sand/60 pt-3 sm:grid-cols-2">
                  <form action={boundQuoteDe}>
                    <span className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                      Quote (Deutsch)
                      {!deQuote?.quote && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-terracotta" title="Missing translation" />
                      )}
                    </span>
                    <textarea name="quote" defaultValue={deQuote?.quote ?? ""} rows={2} className="input" placeholder="Falls back to English" />
                    <button type="submit" className="mt-1.5 text-xs underline">
                      Save
                    </button>
                  </form>
                  <form action={boundQuoteFr}>
                    <span className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted">
                      Quote (Français)
                      {!frQuote?.quote && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-terracotta" title="Missing translation" />
                      )}
                    </span>
                    <textarea name="quote" defaultValue={frQuote?.quote ?? ""} rows={2} className="input" placeholder="Falls back to English" />
                    <button type="submit" className="mt-1.5 text-xs underline">
                      Save
                    </button>
                  </form>
                </div>

                <form action={boundDelete} className="mt-3 border-t border-sand/60 pt-2">
                  <ConfirmSubmitButton confirmMessage="Delete this testimonial?" className="text-xs text-terracotta underline">
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-sm border border-dashed border-sand p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Add Testimonial</p>
          <form action={addTestimonial} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <textarea name="quote" placeholder="Quote" required rows={2} className="input sm:col-span-2" />
            <input name="authorName" placeholder="Author name" required className="input" />
            <input name="country" placeholder="Country" required className="input" />
            <input name="rating" type="number" min={1} max={5} defaultValue={5} className="input" />
            <input name="avatarUrl" placeholder="Avatar URL (optional)" className="input" />
            <button type="submit" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory sm:col-span-2 sm:w-fit">
              Add Testimonial
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

type SettingsTranslationRow = {
  heroHeadline: string | null;
  heroSubtitle: string | null;
  heroCtaLabel: string | null;
  brandStoryHeading: string | null;
  brandStoryBody: string | null;
  customOrderHeading: string | null;
  customOrderBody: string | null;
  newsletterHeading: string | null;
  newsletterBody: string | null;
} | undefined;

function HomepageTranslationForm({
  action,
  translation,
  localeLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  translation: SettingsTranslationRow;
  localeLabel: string;
}) {
  return (
    <form action={action} className="space-y-8">
      {!translation?.heroHeadline && (
        <p className="rounded-sm border border-camel/40 bg-camel/10 px-3 py-2 text-xs text-charcoal/85">
          No {localeLabel} translation yet — these fields fall back to English on the storefront until filled in.
        </p>
      )}
      <fieldset className="space-y-4 rounded-sm border border-sand p-5">
        <legend className="px-1 text-sm font-semibold">Hero</legend>
        <Field label="Headline">
          <textarea name="heroHeadline" defaultValue={translation?.heroHeadline ?? ""} rows={2} className="input" />
        </Field>
        <Field label="Subtitle">
          <textarea name="heroSubtitle" defaultValue={translation?.heroSubtitle ?? ""} rows={2} className="input" />
        </Field>
        <Field label="CTA Label">
          <input name="heroCtaLabel" defaultValue={translation?.heroCtaLabel ?? ""} className="input" />
        </Field>
      </fieldset>

      <fieldset className="space-y-4 rounded-sm border border-sand p-5">
        <legend className="px-1 text-sm font-semibold">Brand Story Section</legend>
        <Field label="Heading">
          <input name="brandStoryHeading" defaultValue={translation?.brandStoryHeading ?? ""} className="input" />
        </Field>
        <Field label="Body">
          <textarea name="brandStoryBody" defaultValue={translation?.brandStoryBody ?? ""} rows={5} className="input" />
        </Field>
      </fieldset>

      <fieldset className="space-y-4 rounded-sm border border-sand p-5">
        <legend className="px-1 text-sm font-semibold">Custom Order Section</legend>
        <Field label="Heading">
          <input name="customOrderHeading" defaultValue={translation?.customOrderHeading ?? ""} className="input" />
        </Field>
        <Field label="Body">
          <textarea name="customOrderBody" defaultValue={translation?.customOrderBody ?? ""} rows={3} className="input" />
        </Field>
      </fieldset>

      <fieldset className="space-y-4 rounded-sm border border-sand p-5">
        <legend className="px-1 text-sm font-semibold">Newsletter Section</legend>
        <Field label="Heading">
          <input name="newsletterHeading" defaultValue={translation?.newsletterHeading ?? ""} className="input" />
        </Field>
        <Field label="Body">
          <textarea name="newsletterBody" defaultValue={translation?.newsletterBody ?? ""} rows={2} className="input" />
        </Field>
      </fieldset>

      <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
        Save {localeLabel} Content
      </button>
    </form>
  );
}
