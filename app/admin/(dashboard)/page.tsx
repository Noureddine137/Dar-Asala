import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice, colorLabel, sizeLabel } from "@/lib/utils/format";
import { ORDER_STATUS_LABELS } from "@/lib/admin/constants";

const PAID_STATUSES = ["PAID", "IN_PRODUCTION", "SHIPPED", "DELIVERED"] as const;
const LOW_STOCK_THRESHOLD = 5;

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingRequests, recentOrders, revenueAgg, paidOrderCount, distinctCustomerEmails, lowStockVariants, bestSellingRaw] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.customOrderRequest.count({ where: { status: "new" } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
      prisma.order.aggregate({ where: { status: { in: [...PAID_STATUSES] } }, _sum: { total: true } }),
      prisma.order.count({ where: { status: { in: [...PAID_STATUSES] } } }),
      prisma.order.findMany({ where: { status: { in: [...PAID_STATUSES] } }, select: { email: true }, distinct: ["email"] }),
      prisma.productVariant.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        include: { product: { select: { name: true, id: true } } },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 5,
      }),
    ]);

  const revenue = Number(revenueAgg._sum.total ?? 0);
  const aov = paidOrderCount > 0 ? revenue / paidOrderCount : 0;

  const bestSellingProducts = await Promise.all(
    bestSellingRaw.map(async (row) => {
      const product = await prisma.product.findUnique({ where: { id: row.productId }, select: { name: true, id: true } });
      return { product, quantity: row._sum.quantity ?? 0 };
    })
  );

  const stats = [
    { label: "Revenue (paid orders)", value: formatPrice(revenue), href: "/admin/orders" },
    { label: "Orders", value: orderCount, href: "/admin/orders" },
    { label: "Average Order Value", value: paidOrderCount > 0 ? formatPrice(aov) : "—", href: "/admin/orders" },
    { label: "Customers", value: distinctCustomerEmails.length, href: "/admin/customers" },
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "New Custom Requests", value: pendingRequests, href: "/admin/custom-requests" },
  ];

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        Live figures from the store database. There is no historical data window yet, so
        period-over-period comparisons aren&rsquo;t shown rather than invented.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-sm border border-sand p-5 hover:border-charcoal">
            <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-2 font-serif-display text-3xl">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-serif-display text-xl">Best-Selling Products</h2>
          {bestSellingProducts.filter((b) => b.product).length === 0 ? (
            <p className="text-sm text-muted">No sales yet.</p>
          ) : (
            <ol className="space-y-2 text-sm">
              {bestSellingProducts
                .filter((b) => b.product)
                .map((b, i) => (
                  <li key={b.product!.id} className="flex items-center justify-between border-b border-sand/60 py-2">
                    <span>
                      <span className="text-muted">{i + 1}.</span>{" "}
                      <Link href={`/admin/products/${b.product!.id}`} className="underline">
                        {b.product!.name}
                      </Link>
                    </span>
                    <span className="text-muted">{b.quantity} sold</span>
                  </li>
                ))}
            </ol>
          )}
        </div>

        <div>
          <h2 className="mb-4 font-serif-display text-xl">Low Stock (≤ {LOW_STOCK_THRESHOLD})</h2>
          {lowStockVariants.length === 0 ? (
            <p className="text-sm text-muted">No variants at or below the low-stock threshold.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {lowStockVariants.map((v) => (
                <li key={v.id} className="flex items-center justify-between border-b border-sand/60 py-2">
                  <Link href={`/admin/products/${v.product.id}`} className="underline">
                    {v.product.name} — {colorLabel(v.color)} / {sizeLabel(v.size)}
                  </Link>
                  <span className={v.stock === 0 ? "font-medium text-terracotta" : "text-muted"}>
                    {v.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-display text-xl">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
                  <th className="py-2 font-medium">Order</th>
                  <th className="py-2 font-medium">Email</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-sand/60">
                    <td className="py-2.5">
                      <Link href={`/admin/orders/${o.id}`} className="underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2.5">{o.email}</td>
                    <td className="py-2.5">{ORDER_STATUS_LABELS[o.status] ?? o.status}</td>
                    <td className="py-2.5">{formatPrice(Number(o.total), o.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
