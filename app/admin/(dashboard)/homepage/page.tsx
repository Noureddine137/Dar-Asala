import type { ReactNode } from "react";
import { getStoreSettings } from "@/lib/content/store-settings";
import { prisma } from "@/lib/db/prisma";
import { updateHomepageContent, addTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/admin/content-actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";

export default async function AdminHomepagePage() {
  const [settings, testimonials] = await Promise.all([
    getStoreSettings(),
    prisma.testimonial.findMany({ orderBy: { position: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif-display text-3xl">Homepage Content</h1>
      <p className="mt-1 text-sm text-muted">
        Edits here update the live homepage immediately — no code changes needed.
      </p>

      <form action={updateHomepageContent} className="mt-8 space-y-8">
        <fieldset className="space-y-4 rounded-sm border border-sand p-5">
          <legend className="px-1 text-sm font-semibold">Hero</legend>
          <Field label="Headline">
            <textarea name="heroHeadline" defaultValue={settings.heroHeadline} rows={2} className="input" />
          </Field>
          <Field label="Subtitle">
            <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={2} className="input" />
          </Field>
          <Field label="Image URL">
            <input name="heroImageUrl" defaultValue={settings.heroImageUrl} className="input" />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CTA Label">
              <input name="heroCtaLabel" defaultValue={settings.heroCtaLabel} className="input" />
            </Field>
            <Field label="CTA Link">
              <input name="heroCtaHref" defaultValue={settings.heroCtaHref} className="input" />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-sm border border-sand p-5">
          <legend className="px-1 text-sm font-semibold">Brand Story Section</legend>
          <Field label="Heading">
            <input name="brandStoryHeading" defaultValue={settings.brandStoryHeading} className="input" />
          </Field>
          <Field label="Body (blank line separates paragraphs)">
            <textarea name="brandStoryBody" defaultValue={settings.brandStoryBody} rows={5} className="input" />
          </Field>
          <Field label="Image URL">
            <input name="brandStoryImageUrl" defaultValue={settings.brandStoryImageUrl} className="input" />
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
          <Field label="Image URL">
            <input name="customOrderImageUrl" defaultValue={settings.customOrderImageUrl} className="input" />
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
          Save Homepage Content
        </button>
      </form>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Testimonials</h2>
        <p className="mb-4 text-xs text-muted">
          The homepage &ldquo;What Customers Say&rdquo; section shows up to 3 active testimonials, in
          order. If none are active, the section is hidden rather than showing empty.
        </p>

        <div className="space-y-4">
          {testimonials.map((t) => {
            const boundUpdate = updateTestimonial.bind(null, t.id);
            const boundDelete = deleteTestimonial.bind(null, t.id);
            return (
              <div key={t.id} className="rounded-sm border border-sand p-4">
                <form action={boundUpdate} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Quote</span>
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
                <form action={boundDelete} className="mt-2 border-t border-sand/60 pt-2">
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
