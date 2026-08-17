import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import {
  updateCollection,
  deleteCollection,
  addProductToCollection,
  removeProductFromCollection,
  moveCollectionProduct,
} from "@/lib/admin/collections-actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";

type Props = { params: Promise<{ id: string }> };

export default async function EditCollectionPage({ params }: Props) {
  const { id } = await params;
  const collection = await prisma.collection.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { position: "asc" },
        include: { product: { select: { id: true, name: true, status: true } } },
      },
    },
  });
  if (!collection) notFound();

  const assignedIds = new Set(collection.products.map((p) => p.productId));
  const availableProducts = await prisma.product.findMany({
    where: { id: { notIn: Array.from(assignedIds) } },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const boundUpdate = updateCollection.bind(null, collection.id);
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

      <form action={boundUpdate} className="mt-8 space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Title</span>
            <input name="title" defaultValue={collection.title} className="input" />
          </label>
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
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Description</span>
          <textarea name="description" defaultValue={collection.description} rows={3} className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Hero Image URL</span>
          <input name="heroImage" defaultValue={collection.heroImage} className="input" />
        </label>
        <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
          Save Changes
        </button>
      </form>

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
                      <ConfirmSubmitButton confirmMessage="Remove this product from the collection?" className="text-terracotta underline">
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

      <div className="mt-10 rounded-sm border border-sand p-5">
        <h2 className="font-serif-display text-lg">Danger Zone</h2>
        <p className="mt-2 text-sm text-muted">
          Deletes the collection. Products stay in the catalog — only the collection grouping is removed.
        </p>
        <form action={boundDelete} className="mt-3">
          <ConfirmSubmitButton
            confirmMessage={`Delete the "${collection.title}" collection?`}
            className="rounded-sm border border-terracotta px-4 py-2 text-xs text-terracotta"
          >
            Delete Collection
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
