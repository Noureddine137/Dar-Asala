import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import {
  updateCollectionDetails,
  updateCollectionContent,
  deleteCollection,
  addProductToCollection,
  removeProductFromCollection,
  moveCollectionProduct,
} from "@/lib/admin/collections-actions";
import { updateCollectionTranslation } from "@/lib/admin/translation-actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";
import { LocaleContentTabs } from "@/components/admin/locale-content-tabs";

type Props = { params: Promise<{ id: string }> };

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  const [collection, translations] = await Promise.all([
    prisma.collection.findUnique({
      where: { id },
      include: {
        products: {
          orderBy: { position: "asc" },
          include: { product: { select: { id: true, name: true, status: true } } },
        },
      },
    }),
    prisma.collectionTranslation.findMany({ where: { collectionId: id } }),
  ]);
  if (!collection) notFound();

  const deTranslation = translations.find((t) => t.locale === "DE");
  const frTranslation = translations.find((t) => t.locale === "FR");
  const assignedIds = new Set(collection.products.map((p) => p.productId));
  const availableProducts = await prisma.product.findMany({
    where: { id: { notIn: Array.from(assignedIds) } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const boundDetails = updateCollectionDetails.bind(null, collection.id);
  const boundContentEn = updateCollectionContent.bind(null, collection.id);
  const boundContentDe = updateCollectionTranslation.bind(null, collection.id, "de");
  const boundContentFr = updateCollectionTranslation.bind(null, collection.id, "fr");
  const boundDelete = deleteCollection.bind(null, collection.id);
  const boundAddProduct = addProductToCollection.bind(null, collection.id);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-3xl">{collection.title}</h1>
          <p className="mt-1 text-sm text-muted">/collections/{collection.slug}</p>
        </div>
        <Link href="/admin/collections" className="text-sm text-muted hover:text-charcoal">
          ← All Collections
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="mb-1 font-serif-display text-xl">Details</h2>
        <p className="mb-4 text-xs text-muted">
          Shared data — slug, hero image, position and active state stay the same across every language.
        </p>
        <form action={boundDetails} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Slug</span>
              <input name="slug" defaultValue={collection.slug} className="input" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Display Position</span>
              <input name="position" type="number" defaultValue={collection.position} className="input" />
            </label>
            <label className="flex items-center gap-2 pt-6 text-sm">
              <input type="checkbox" name="active" defaultChecked={collection.active} /> Active (visible on storefront)
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Hero Image URL</span>
            <input name="heroImage" defaultValue={collection.heroImage} className="input" />
          </label>
          <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
            Save Details
          </button>
        </form>
      </div>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Content</h2>
        <p className="mb-4 text-xs text-muted">
          Customer-visible copy, translated per language. English is the fallback shown wherever a
          German or French translation is missing.
        </p>
        <LocaleContentTabs
          missing={{ de: !deTranslation?.title, fr: !frTranslation?.title }}
          en={
            <form action={boundContentEn} className="space-y-5">
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Title</span>
                <input name="title" defaultValue={collection.title} className="input" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Description</span>
                <textarea name="description" defaultValue={collection.description} rows={3} className="input" />
              </label>
              <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
                Save English Content
              </button>
            </form>
          }
          de={<CollectionTranslationForm action={boundContentDe} translation={deTranslation} localeLabel="Deutsch" />}
          fr={<CollectionTranslationForm action={boundContentFr} translation={frTranslation} localeLabel="Français" />}
        />
      </div>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Products in this Collection</h2>
        <p className="mb-4 text-xs text-muted">Order here controls display order on the storefront collection page.</p>

        {collection.products.length === 0 ? (
          <p className="text-sm text-muted">No products assigned yet.</p>
        ) : (
          <ul className="space-y-2">
            {collection.products.map((cp, i) => {
              const boundRemove = removeProductFromCollection.bind(null, cp.id, collection.id);
              const boundUp = moveCollectionProduct.bind(null, cp.id, collection.id, "up");
              const boundDown = moveCollectionProduct.bind(null, cp.id, collection.id, "down");
              return (
                <li key={cp.id} className="flex items-center justify-between gap-3 rounded-sm border border-sand p-3 text-sm">
                  <Link href={`/admin/products/${cp.product.id}`} className="underline">
                    {cp.product.name}
                  </Link>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted">{cp.product.status}</span>
                    <form action={boundUp}>
                      <button type="submit" disabled={i === 0} className="underline disabled:opacity-30">
                        Up
                      </button>
                    </form>
                    <form action={boundDown}>
                      <button type="submit" disabled={i === collection.products.length - 1} className="underline disabled:opacity-30">
                        Down
                      </button>
                    </form>
                    <form action={boundRemove}>
                      <ConfirmSubmitButton confirmMessage="Remove this product from the collection?" className="admin-danger-link">
                        Remove
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {availableProducts.length > 0 && (
          <form action={boundAddProduct} className="mt-4 flex flex-wrap gap-3 rounded-sm border border-dashed border-sand p-4">
            <select name="productId" required className="input max-w-xs" defaultValue="">
              <option value="" disabled>
                Choose a product…
              </option>
              {availableProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory">
              Add to Collection
            </button>
          </form>
        )}
      </div>

      <div className="mt-10 rounded-sm border border-terracotta/30 bg-terracotta/[0.03] p-6">
        <h2 className="font-serif-display text-lg text-terracotta">Danger Zone</h2>
        <p className="mt-2 text-sm text-muted">
          Deletes the collection. Products stay in the catalog — only the collection grouping is removed.
        </p>
        <form action={boundDelete} className="mt-3">
          <ConfirmSubmitButton
            confirmMessage={`Delete the "${collection.title}" collection?`}
            className="rounded-sm border border-terracotta bg-terracotta/5 px-4 py-2 text-xs font-medium text-terracotta hover:bg-terracotta hover:text-ivory"
          >
            Delete Collection
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}

type CollectionTranslationRow = {
  title: string;
  description: string;
  seoTitle: string | null;
  seoDescription: string | null;
} | undefined;

function CollectionTranslationForm({
  action,
  translation,
  localeLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  translation: CollectionTranslationRow;
  localeLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      {!translation?.title && (
        <p className="rounded-sm border border-camel/40 bg-camel/10 px-3 py-2 text-xs text-charcoal/85">
          No {localeLabel} translation yet — these fields fall back to English on the storefront until filled in.
        </p>
      )}
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Title</span>
        <input name="title" defaultValue={translation?.title ?? ""} placeholder="Falls back to English title" className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Description</span>
        <textarea name="description" defaultValue={translation?.description ?? ""} rows={3} className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">SEO Title (optional override)</span>
        <input name="seoTitle" defaultValue={translation?.seoTitle ?? ""} placeholder="Falls back to Title" className="input" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">SEO Description (optional override)</span>
        <textarea
          name="seoDescription"
          defaultValue={translation?.seoDescription ?? ""}
          placeholder="Falls back to Description"
          rows={2}
          className="input"
        />
      </label>
      <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
        Save {localeLabel} Content
      </button>
    </form>
  );
}
