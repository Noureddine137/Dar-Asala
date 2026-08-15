import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          No orders yet. Orders appear here automatically once Stripe checkout is configured and a
          purchase completes.
        </p>
      ) : (
        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
              <th className="py-2 font-medium">Order</th>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Date</th>
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
                <td className="py-2.5">{o.createdAt.toLocaleDateString("en-GB")}</td>
                <td className="py-2.5">{o.status}</td>
                <td className="py-2.5">{formatPrice(Number(o.total), o.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
