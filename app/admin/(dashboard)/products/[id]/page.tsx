import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { prisma } from "@/lib/db/prisma";
import {
  updateProduct,
  deleteProduct,
  addVariant,
  updateVariant,
  deleteVariant,
  addProductImage,
  updateProductImageMeta,
  deleteProductImage,
  moveProductImage,
  setPrimaryProductImage,
} from "@/lib/admin/actions";
import {
  PRODUCT_IMAGE_KINDS,
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  LEATHER_COLORS,
  BAG_SIZES,
  HARDWARE_FINISHES,
  STRAP_TYPES,
} from "@/lib/admin/constants";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";
import { colorLabel, sizeLabel, hardwareLabel, strapLabel, formatPrice } from "@/lib/utils/format";

type Props = { params: Promise<{ id: string }> };

const CURRENCIES = ["EUR", "USD", "GBP"];

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, orderItemCount] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: { orderBy: { position: "asc" } } },
    }),
    prisma.orderItem.count({ where: { productId: id } }),
  ]);
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);
  const boundDelete = deleteProduct.bind(null, product.id);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-3xl">{product.name}</h1>
          <p className="mt-1 text-sm text-muted">/products/{product.slug}</p>
        </div>
        <Link href="/admin/products" className="text-sm text-muted hover:text-charcoal">
          ← All Products
        </Link>
      </div>

      <form action={boundUpdate} className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" defaultValue={product.name} className="input" />
          </Field>
          <Field label="Slug">
            <input name="slug" defaultValue={product.slug} className="input" />
          </Field>
          <Field label="Category">
            <select name="category" defaultValue={product.category} className="input">
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={product.status} className="input">
              {PRODUCT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price">
            <input name="price" type="number" step="0.01" defaultValue={Number(product.price)} className="input" />
          </Field>
          <Field label="Compare-at Price">
            <input
              name="compareAtPrice"
              type="number"
              step="0.01"
              defaultValue={product.compareAtPrice ? Number(product.compareAtPrice) : ""}
              className="input"
              placeholder="Leave blank for no sale badge"
            />
          </Field>
          <Field label="Currency">
            <select name="currency" defaultValue={product.currency} className="input">
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Production Time">
            <input name="productionTime" defaultValue={product.productionTime} className="input" />
          </Field>
        </div>

        <Field label="Short Description">
          <textarea name="shortDescription" defaultValue={product.shortDescription} rows={2} className="input" />
        </Field>
        <Field label="Full Description">
          <textarea name="description" defaultValue={product.description} rows={4} className="input" />
        </Field>
        <Field label="Story">
          <textarea name="story" defaultValue={product.story ?? ""} rows={3} className="input" />
        </Field>
        <Field label="Materials">
          <textarea name="materials" defaultValue={product.materials} rows={2} className="input" />
        </Field>
        <Field label="Care Instructions">
          <textarea name="careInstructions" defaultValue={product.careInstructions} rows={2} className="input" />
        </Field>

        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={product.featured} /> Featured
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isNew" defaultChecked={product.isNew} /> New Arrival
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isBestSeller" defaultChecked={product.isBestSeller} /> Best Seller
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="isMadeToOrder" defaultChecked={product.isMadeToOrder} /> Made to Order
          </label>
        </div>

        <button type="submit" className="rounded-sm bg-charcoal px-5 py-2.5 text-sm text-ivory">
          Save Changes
        </button>
      </form>

      <div className="mt-10 rounded-sm border border-sand p-5">
        <h2 className="font-serif-display text-lg">Danger Zone</h2>
        {orderItemCount > 0 ? (
          <p className="mt-2 text-sm text-muted">
            This product appears in {orderItemCount} order{orderItemCount === 1 ? "" : "s"}, so it can&rsquo;t
            be deleted. Set status to <strong>ARCHIVED</strong> above to hide it from the storefront instead.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Permanently deletes this product, its images and variants. There are no orders referencing it,
              so this is safe.
            </p>
            <form action={boundDelete} className="mt-3">
              <ConfirmSubmitButton
                confirmMessage={`Permanently delete "${product.name}"? This cannot be undone.`}
                className="rounded-sm border border-terracotta px-4 py-2 text-xs text-terracotta"
              >
                Delete Product
              </ConfirmSubmitButton>
            </form>
          </>
        )}
      </div>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Variants &amp; Stock</h2>
        <p className="mb-4 text-xs text-muted">
          Each row is one purchasable SKU. Combinations are created and removed here — no code changes needed.
        </p>

        <div className="space-y-3">
          {product.variants.map((v) => {
            const boundVariantUpdate = updateVariant.bind(null, v.id, product.id);
            const boundVariantDelete = deleteVariant.bind(null, v.id, product.id);
            return (
              <div key={v.id} className="rounded-sm border border-sand p-3">
              <form
                action={boundVariantUpdate}
                className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-9 lg:items-end"
              >
                <MiniField label="SKU">
                  <input name="sku" defaultValue={v.sku} className="input" />
                </MiniField>
                <MiniField label="Color">
                  <select name="color" defaultValue={v.color} className="input">
                    {LEATHER_COLORS.map((c) => (
                      <option key={c} value={c}>
                        {colorLabel(c)}
                      </option>
                    ))}
                  </select>
                </MiniField>
                <MiniField label="Size">
                  <select name="size" defaultValue={v.size} className="input">
                    {BAG_SIZES.map((s) => (
                      <option key={s} value={s}>
                        {sizeLabel(s)}
                      </option>
                    ))}
                  </select>
                </MiniField>
                <MiniField label="Strap">
                  <select name="strap" defaultValue={v.strap} className="input">
                    {STRAP_TYPES.map((s) => (
                      <option key={s} value={s}>
                        {strapLabel(s)}
                      </option>
                    ))}
                  </select>
                </MiniField>
                <MiniField label="Hardware">
                  <select name="hardware" defaultValue={v.hardware} className="input">
                    {HARDWARE_FINISHES.map((h) => (
                      <option key={h} value={h}>
                        {hardwareLabel(h)}
                      </option>
                    ))}
                  </select>
                </MiniField>
                <MiniField label="Price Override">
                  <input
                    name="priceOverride"
                    type="number"
                    step="0.01"
                    defaultValue={v.priceOverride ? Number(v.priceOverride) : ""}
                    placeholder={formatPrice(Number(product.price), product.currency)}
                    className="input"
                  />
                </MiniField>
                <MiniField label="Stock">
                  <input name="stock" type="number" min={0} defaultValue={v.stock} className="input" />
                </MiniField>
                <MiniField label="Image">
                  <select name="imageId" defaultValue={v.imageId ?? ""} className="input">
                    <option value="">Primary (default)</option>
                    {product.images.map((img) => (
                      <option key={img.id} value={img.id}>
                        {img.kind}
                      </option>
                    ))}
                  </select>
                </MiniField>
                <div className="col-span-2 flex items-end justify-between gap-2 sm:col-span-4 lg:col-span-1 lg:flex-col lg:items-stretch">
                  <label className="flex items-center gap-1.5 text-xs text-muted">
                    <input type="checkbox" name="isMadeToOrder" defaultChecked={v.isMadeToOrder} /> MTO
                  </label>
                  <div className="flex gap-3">
                    <button type="submit" className="text-xs underline">
                      Save
                    </button>
                  </div>
                </div>
              </form>
              <form action={boundVariantDelete} className="mt-2 border-t border-sand/60 pt-2">
                <ConfirmSubmitButton
                  confirmMessage={`Delete variant ${v.sku}?`}
                  className="text-xs text-terracotta underline"
                >
                  Delete Variant
                </ConfirmSubmitButton>
              </form>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-sm border border-dashed border-sand p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Add Variant</p>
          <form action={addVariant.bind(null, product.id)} className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            <MiniField label="SKU">
              <input name="sku" required placeholder="SKU-COLOR-SIZE" className="input" />
            </MiniField>
            <MiniField label="Color">
              <select name="color" defaultValue="COGNAC" className="input">
                {LEATHER_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {colorLabel(c)}
                  </option>
                ))}
              </select>
            </MiniField>
            <MiniField label="Size">
              <select name="size" defaultValue="MEDIUM" className="input">
                {BAG_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {sizeLabel(s)}
                  </option>
                ))}
              </select>
            </MiniField>
            <MiniField label="Strap">
              <select name="strap" defaultValue="STANDARD" className="input">
                {STRAP_TYPES.map((s) => (
                  <option key={s} value={s}>
                    {strapLabel(s)}
                  </option>
                ))}
              </select>
            </MiniField>
            <MiniField label="Hardware">
              <select name="hardware" defaultValue="BRASS" className="input">
                {HARDWARE_FINISHES.map((h) => (
                  <option key={h} value={h}>
                    {hardwareLabel(h)}
                  </option>
                ))}
              </select>
            </MiniField>
            <MiniField label="Stock">
              <input name="stock" type="number" min={0} defaultValue={0} className="input" />
            </MiniField>
            <div className="col-span-2 flex items-end sm:col-span-4 lg:col-span-2">
              <button type="submit" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory">
                Add Variant
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-1 font-serif-display text-xl">Images</h2>
        <p className="mb-4 text-xs text-muted">
          Order, alt text, kind and primary status are editable below — pointing <code>url</code> at a new
          file (uploaded to <code>/public/images</code> or an external host) replaces the photo with no code
          changes. No upload pipeline is wired up yet: connect an object storage provider (S3, Cloudinary,
          Vercel Blob) to upload directly from this screen.
        </p>

        <div className="space-y-4">
          {product.images.map((img, i) => {
            const boundMeta = updateProductImageMeta.bind(null, img.id, product.id);
            const boundDelete = deleteProductImage.bind(null, img.id, product.id);
            const boundMoveUp = moveProductImage.bind(null, img.id, product.id, "up");
            const boundMoveDown = moveProductImage.bind(null, img.id, product.id, "down");
            const boundSetPrimary = setPrimaryProductImage.bind(null, img.id, product.id);
            const isPrimary = i === 0;
            return (
              <div key={img.id} className="flex flex-col gap-4 rounded-sm border border-sand p-4 sm:flex-row">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin preview thumbnail, not a storefront asset */}
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                  {isPrimary && (
                    <span className="absolute left-1 top-1 rounded-sm bg-charcoal px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ivory">
                      Primary
                    </span>
                  )}
                </div>

                <form action={boundMeta} className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2">
                  <p className="truncate text-xs text-muted sm:col-span-2" title={img.url}>
                    {img.url}
                  </p>
                  <input name="alt" defaultValue={img.alt} placeholder="Alt text" className="input" />
                  <select name="kind" defaultValue={img.kind} className="input">
                    {PRODUCT_IMAGE_KINDS.map((k) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-3 sm:col-span-2">
                    <button type="submit" className="text-xs underline">
                      Save
                    </button>
                    <span className="text-xs text-muted">Position {i + 1}</span>
                  </div>
                </form>

                <div className="flex shrink-0 flex-row flex-wrap gap-3 text-xs sm:flex-col sm:gap-1.5">
                  {!isPrimary && (
                    <form action={boundSetPrimary}>
                      <button type="submit" className="font-medium underline">
                        Set as Primary
                      </button>
                    </form>
                  )}
                  <form action={boundMoveUp}>
                    <button type="submit" disabled={i === 0} className="underline disabled:opacity-30">
                      Move up
                    </button>
                  </form>
                  <form action={boundMoveDown}>
                    <button type="submit" disabled={i === product.images.length - 1} className="underline disabled:opacity-30">
                      Move down
                    </button>
                  </form>
                  <form action={boundDelete}>
                    <ConfirmSubmitButton confirmMessage="Delete this image?" className="text-terracotta underline">
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 rounded-sm border border-dashed border-sand p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Add Image</p>
          <form action={addProductImage.bind(null, product.id)} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input name="url" placeholder="/images/products/... or https://..." required className="input sm:col-span-2" />
            <input name="alt" placeholder="Alt text" required className="input" />
            <select name="kind" defaultValue="front" className="input">
              {PRODUCT_IMAGE_KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button type="submit" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory sm:col-span-4 sm:w-fit">
              Add Image
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

function MiniField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

