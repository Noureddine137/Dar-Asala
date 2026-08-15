import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif-display text-3xl">Products</h1>
        <Link href="/admin/products/new" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory">
          + New Product
        </Link>
      </div>

      <table className="mt-8 w-full text-left text-sm">
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
                <td className="py-2.5">{stock}</td>
                <td className="py-2.5">{p.status}</td>
                <td className="py-2.5">{p.featured ? "Yes" : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
