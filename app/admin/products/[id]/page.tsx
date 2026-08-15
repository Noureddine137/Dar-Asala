import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { prisma } from "@/lib/db/prisma";
import { updateProduct, updateVariantStock } from "@/lib/admin/actions";
import { colorLabel, sizeLabel, formatPrice } from "@/lib/utils/format";

type Props = { params: Promise<{ id: string }> };

const CATEGORIES = ["handbags", "shoulder-bags", "crossbody-bags", "tote-bags", "mini-bags", "leather-accessories"];
const STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"];

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true, images: { orderBy: { position: "asc" } } },
  });
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif-display text-3xl">{product.name}</h1>
      <p className="mt-1 text-sm text-muted">/products/{product.slug}</p>

      <form action={boundUpdate} className="mt-8 space-y-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name">
            <input name="name" defaultValue={product.name} className="input" />
          </Field>
          <Field label="Category">
            <select name="category" defaultValue={product.category} className="input">
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (EUR)">
            <input name="price" type="number" step="0.01" defaultValue={Number(product.price)} className="input" />
          </Field>
          <Field label="Compare-at Price (EUR)">
            <input
              name="compareAtPrice"
              type="number"
              step="0.01"
              defaultValue={product.compareAtPrice ? Number(product.compareAtPrice) : ""}
              className="input"
            />
          </Field>
          <Field label="Status">
            <select name="status" defaultValue={product.status} className="input">
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
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

      <div className="mt-12">
        <h2 className="mb-4 font-serif-display text-xl">Variants & Stock</h2>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
              <th className="py-2 font-medium">SKU</th>
              <th className="py-2 font-medium">Color</th>
              <th className="py-2 font-medium">Size</th>
              <th className="py-2 font-medium">Stock</th>
            </tr>
          </thead>
          <tbody>
            {product.variants.map((v) => (
              <tr key={v.id} className="border-b border-sand/60">
                <td className="py-2.5 text-xs text-muted">{v.sku}</td>
                <td className="py-2.5">{colorLabel(v.color)}</td>
                <td className="py-2.5">{sizeLabel(v.size)}</td>
                <td className="py-2.5">
                  <form action={async (formData: FormData) => {
                    "use server";
                    await updateVariantStock(v.id, Number(formData.get("stock")));
                  }} className="flex items-center gap-2">
                    <input name="stock" type="number" min={0} defaultValue={v.stock} className="input w-20" />
                    <button type="submit" className="text-xs underline">
                      Update
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12">
        <h2 className="mb-4 font-serif-display text-xl">Images</h2>
        <div className="grid grid-cols-4 gap-3">
          {product.images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview thumbnail, not a storefront asset
            <img key={img.id} src={img.url} alt={img.alt} className="aspect-[4/5] w-full rounded-sm object-cover" />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          Image upload isn&rsquo;t wired up yet — this build renders images from{" "}
          <code>/public/images</code>. Connect an object storage provider (e.g. S3, Cloudinary,
          Vercel Blob) to support uploads from this screen.
        </p>
      </div>

      <p className="mt-6 text-sm">
        Price: <strong>{formatPrice(Number(product.price), product.currency)}</strong>
      </p>
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
