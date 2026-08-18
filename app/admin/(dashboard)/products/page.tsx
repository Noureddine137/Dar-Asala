import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";
import { PRODUCT_STATUSES } from "@/lib/admin/constants";
import { cn } from "@/lib/utils/cn";
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

      <form className="admin-card mt-6 flex flex-wrap items-center gap-3 p-4" method="get">
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
        <button type="submit" className="rounded-sm border border-sand px-4 py-2 text-sm hover:border-charcoal">
          Filter
        </button>
        {(q || status) && (
          <Link href="/admin/products" className="flex items-center text-sm text-muted underline">
            Clear
          </Link>
        )}
      </form>

      <div className="admin-card mt-6 overflow-x-auto">
        <table className="admin-table w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr>
              <th className="pl-5 pr-3">Name</th>
              <th className="px-3">Category</th>
              <th className="px-3">Price</th>
              <th className="px-3">Stock</th>
              <th className="px-3">Status</th>
              <th className="pl-3 pr-5">Featured</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const stock = p.variants.reduce((sum, v) => sum + v.stock, 0);
              return (
                <tr key={p.id}>
                  <td className="pl-5 pr-3">
                    <Link href={`/admin/products/${p.id}`} className="underline">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-3">{p.category}</td>
                  <td className="px-3">{formatPrice(Number(p.price), p.currency)}</td>
                  <td className="px-3">
                    <span className={stock === 0 ? "font-medium text-terracotta" : undefined}>{stock}</span>
                  </td>
                  <td className="px-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        p.status === "ACTIVE" && "bg-olive/10 text-olive",
                        p.status === "DRAFT" && "bg-sand/70 text-charcoal/70",
                        p.status === "ARCHIVED" && "bg-charcoal/5 text-muted"
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="pl-3 pr-5">{p.featured ? "Yes" : "—"}</td>
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
