import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminCustomersPage() {
  // There are no real customer accounts yet (checkout is guest-only — see
  // /account, which says so explicitly). This view is derived from orders,
  // grouped by email, rather than fabricated.
  const grouped = await prisma.order.groupBy({
    by: ["email"],
    _count: { _all: true },
    _sum: { total: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
  });

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Customers</h1>
      <p className="mt-1 text-sm text-muted">
        Derived from order history (grouped by email) — there is no separate customer-account
        system yet, so this is the honest picture of who has ordered.
      </p>

      {grouped.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No customers yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">Email</th>
                <th className="py-2 font-medium">Orders</th>
                <th className="py-2 font-medium">Total Spend</th>
                <th className="py-2 font-medium">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {grouped.map((g) => (
                <tr key={g.email} className="border-b border-sand/60">
                  <td className="py-2.5">
                    <Link href={`/admin/customers/${encodeURIComponent(g.email)}`} className="underline">
                      {g.email}
                    </Link>
                  </td>
                  <td className="py-2.5">{g._count._all}</td>
                  <td className="py-2.5">{formatPrice(Number(g._sum.total ?? 0))}</td>
                  <td className="py-2.5">{g._max.createdAt?.toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
