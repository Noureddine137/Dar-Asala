import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingRequests, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.customOrderRequest.count({ where: { status: "new" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const revenueAgg = await prisma.order.aggregate({
    where: { status: { in: ["PAID", "IN_PRODUCTION", "SHIPPED", "DELIVERED"] } },
    _sum: { total: true },
  });
  const revenue = Number(revenueAgg._sum.total ?? 0);

  const stats = [
    { label: "Products", value: productCount, href: "/admin/products" },
    { label: "Orders", value: orderCount, href: "/admin/orders" },
    { label: "Revenue (paid)", value: formatPrice(revenue), href: "/admin/orders" },
    { label: "New Custom Requests", value: pendingRequests, href: "/admin/custom-requests" },
  ];

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Dashboard</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-sm border border-sand p-5 hover:border-charcoal">
            <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
            <p className="mt-2 font-serif-display text-3xl">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="mb-4 font-serif-display text-xl">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted">No orders yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">Order</th>
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-sand/60">
                  <td className="py-2.5">
                    <Link href={`/admin/orders/${o.id}`} className="underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="py-2.5">{o.email}</td>
                  <td className="py-2.5">{o.status}</td>
                  <td className="py-2.5">{formatPrice(Number(o.total), o.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
