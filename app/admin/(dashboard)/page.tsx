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
          <Link
            key={s.label}
            href={s.href}
            className="admin-card block p-5 transition-shadow hover:shadow-[0_1px_2px_rgba(44,42,38,0.06),0_10px_24px_rgba(44,42,38,0.09)]"
          >
            <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-2 font-serif-display text-3xl">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <h2 className="mb-4 font-serif-display text-lg">Best-Selling Products</h2>
          {bestSellingProducts.filter((b) => b.product).length === 0 ? (
            <p className="text-sm text-muted">No sales yet.</p>
          ) : (
            <ol className="space-y-1 text-sm">
              {bestSellingProducts
                .filter((b) => b.product)
                .map((b, i) => (
                  <li key={b.product!.id} className="flex items-center justify-between rounded-sm px-1.5 py-2 hover:bg-sand/30">
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

        <div className="admin-card p-5">
          <h2 className="mb-4 font-serif-display text-lg">Low Stock (≤ {LOW_STOCK_THRESHOLD})</h2>
          {lowStockVariants.length === 0 ? (
            <p className="text-sm text-muted">No variants at or below the low-stock threshold.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {lowStockVariants.map((v) => (
                <li key={v.id} className="flex items-center justify-between rounded-sm px-1.5 py-2 hover:bg-sand/30">
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

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif-display text-lg">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-muted underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="admin-card p-5 text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="admin-card overflow-x-auto">
            <table className="admin-table w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr>
                  <th className="pl-5 pr-3">Order</th>
                  <th className="px-3">Email</th>
                  <th className="px-3">Status</th>
                  <th className="pl-3 pr-5">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="pl-5 pr-3">
                      <Link href={`/admin/orders/${o.id}`} className="underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-3">{o.email}</td>
                    <td className="px-3">{ORDER_STATUS_LABELS[o.status] ?? o.status}</td>
                    <td className="pl-3 pr-5">{formatPrice(Number(o.total), o.currency)}</td>
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
