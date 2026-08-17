import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";
import { ORDER_STATUS_LABELS } from "@/lib/admin/constants";

type Props = { params: Promise<{ email: string }> };

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { email: encodedEmail } = await params;
  const email = decodeURIComponent(encodedEmail);

  const [orders, customer] = await Promise.all([
    prisma.order.findMany({ where: { email }, orderBy: { createdAt: "desc" } }),
    prisma.customer.findUnique({ where: { email }, include: { addresses: true } }),
  ]);

  if (orders.length === 0 && !customer) notFound();

  const totalSpend = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const addresses = orders.map((o) => o.shippingAddress).filter(Boolean);

  return (
    <div className="max-w-2xl">
      <Link href="/admin/customers" className="text-sm text-muted hover:text-charcoal">
        ← All Customers
      </Link>
      <h1 className="mt-2 font-serif-display text-3xl">{customer?.name ?? email}</h1>
      <p className="mt-1 text-sm text-muted">{email}</p>
      {customer?.addresses.find((a) => a.phone) && (
        <p className="text-sm text-muted">{customer.addresses.find((a) => a.phone)?.phone}</p>
      )}

      <div className="mt-6 flex gap-6 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Orders</p>
          <p className="mt-1 font-serif-display text-2xl">{orders.length}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">Total Spend</p>
          <p className="mt-1 font-serif-display text-2xl">{formatPrice(totalSpend)}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 font-serif-display text-xl">Order History</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-sand text-xs uppercase tracking-wide text-muted">
                <th className="py-2 font-medium">Order</th>
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
                  <td className="py-2.5">{o.createdAt.toLocaleDateString("en-GB")}</td>
                  <td className="py-2.5">{ORDER_STATUS_LABELS[o.status] ?? o.status}</td>
                  <td className="py-2.5">{formatPrice(Number(o.total), o.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {addresses.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-serif-display text-xl">Shipping Addresses Seen</h2>
          <div className="space-y-3">
            {addresses.map((addr, i) => (
              <pre key={i} className="whitespace-pre-wrap rounded-sm border border-sand p-3 text-xs text-charcoal/80">
                {JSON.stringify(addr, null, 2)}
              </pre>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
