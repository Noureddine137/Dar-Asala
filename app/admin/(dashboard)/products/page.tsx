import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";
import { PRODUCT_STATUSES } from "@/lib/admin/constants";
import type { Prisma, ProductStatus } from "@prisma/client";

type Props = { searchParams: Promise<{ q?: string; status?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  const { q, status } = await searchParams;

  const where: Prisma.ProductWhereInput = {};
  if (q) {
    where.OR = [{ name: { contains: q, mode: "insensitive" } }, { slug: { contains: q, mode: "insensitive" } }];
  }
  if (status && PRODUCT_STATUSES.includes(status as ProductStatus)) {
    where.status = status as ProductStatus;
  }

  const products = await prisma.product.findMany({
    where,
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory">
          + New Product
        </Link>
      </div>

      <form className="mt-6 flex flex-wrap gap-3" method="get">
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name or slug…"
          className="input max-w-xs"
        />
        <select name="status" defaultValue={status ?? ""} className="input w-auto">
          <option value="">All statuses</option>
          {PRODUCT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-sm border border-sand px-4 py-2 text-sm">
          Filter
        </button>
        {(q || status) && (
          <Link href="/admin/products" className="flex items-center text-sm text-muted underline">
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Category</th>
              <th className="py-2 font-medium">Price</th>
              <th className="py-2 font-medium">Stock</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={p.id} className="border-b border-sand/60">
                  <td className="py-2.5">
                    <Link href={`/admin/products/${p.id}`} className="underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-2.5">{p.category}</td>
                  <td className="py-2.5">{formatPrice(Number(p.price), p.currency)}</td>
                  <td className="py-2.5">
                    <span className={stock === 0 ? "text-terracotta" : undefined}>{stock}</span>
                  </td>
                  <td className="py-2.5">{p.status}</td>
                  <td className="py-2.5">{p.featured ? "Yes" : "—"}</td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-muted">
                  No products match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
