import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { updateOrderStatus } from "@/lib/admin/actions";
import { formatPrice } from "@/lib/utils/format";

type Props = { params: Promise<{ id: string }> };

const STATUSES = ["PENDING", "PAID", "IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const boundUpdate = updateOrderStatus.bind(null, order.id);

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-display text-3xl">{order.orderNumber}</h1>
      <p className="mt-1 text-sm text-muted">{order.email}</p>

      <div className="mt-6 rounded-sm border border-sand p-5">
        <h2 className="mb-3 font-serif-display text-lg">Items</h2>
        <ul className="divide-y divide-sand/60">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span>
                {item.name} {item.variantLabel && <span className="text-muted">({item.variantLabel})</span>} ×{" "}
                {item.quantity}
              </span>
              <span>{formatPrice(Number(item.unitPrice) * item.quantity, order.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-sand/70 pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(Number(order.subtotal), order.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Shipping</span>
            <span>{formatPrice(Number(order.shipping), order.currency)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(Number(order.total), order.currency)}</span>
          </div>
        </div>
      </div>

      {order.shippingAddress != null && (
        <div className="mt-6 rounded-sm border border-sand p-5 text-sm">
          <h2 className="mb-2 font-serif-display text-lg">Shipping Address</h2>
          <pre className="whitespace-pre-wrap font-sans text-charcoal/80">
            {JSON.stringify(order.shippingAddress, null, 2)}
          </pre>
        </div>
      )}

      <form action={boundUpdate} className="mt-6 flex items-center gap-3">
        <select name="status" defaultValue={order.status} className="input w-auto">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory">
          Update Status
        </button>
      </form>
    </div>
  );
}
