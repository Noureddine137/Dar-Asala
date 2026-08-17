import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { updateOrderStatus } from "@/lib/admin/actions";
import { formatPrice } from "@/lib/utils/format";
import { MANUAL_ORDER_STATUS_OPTIONS, ORDER_STATUS_LABELS, derivePaymentStatus } from "@/lib/admin/constants";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";

type Props = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: { select: { id: true, name: true, email: true } } },
  });
  if (!order) notFound();

  const boundUpdate = updateOrderStatus.bind(null, order.id);
  const paymentStatus = derivePaymentStatus(order);

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-3xl">{order.orderNumber}</h1>
          <p className="mt-1 text-sm text-muted">
            {order.customer ? (
              <Link href={`/admin/customers/${encodeURIComponent(order.email)}`} className="underline">
                {order.customer.name ?? order.email}
              </Link>
            ) : (
              order.email
            )}
          </p>
          <p className="text-xs text-muted">{order.createdAt.toLocaleString("en-GB")}</p>
        </div>
        <Link href="/admin/orders" className="text-sm text-muted hover:text-charcoal">
          ← All Orders
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-sand px-3 py-1 text-xs">
          Payment: <strong>{paymentStatus}</strong>
        </span>
        <span className="rounded-full border border-sand px-3 py-1 text-xs">
          Fulfillment: <strong>{ORDER_STATUS_LABELS[order.status] ?? order.status}</strong>
        </span>
      </div>

      {order.shippingCountryMismatch && (
        <div className="mt-6 rounded-sm border border-terracotta/40 bg-terracotta/10 p-4 text-sm">
          <p className="font-medium text-terracotta">⚠ Shipping destination mismatch — needs manual review</p>
          <p className="mt-1 text-charcoal/80">
            The customer selected <strong>{order.selectedShippingCountry ?? "—"}</strong> before checkout, but
            Stripe collected a shipping address in <strong>{order.shippingCountry ?? "—"}</strong>. Payment has
            already succeeded and this order was recorded normally — verify the destination is correct
            before shipping.
          </p>
        </div>
      )}

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

      <div className="mt-6 rounded-sm border border-sand p-5">
        <h2 className="mb-3 font-serif-display text-lg">Fulfillment</h2>
        <p className="mb-4 text-xs text-muted">
          Payment status above is set automatically by Stripe and can&rsquo;t be changed here — only the
          fulfillment steps below are editable.
        </p>
        <form action={boundUpdate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Fulfillment Status</span>
              <select
                name="status"
                defaultValue={MANUAL_ORDER_STATUS_OPTIONS.some((o) => o.value === order.status) ? order.status : "IN_PRODUCTION"}
                className="input"
              >
                {MANUAL_ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs uppercase tracking-wide text-muted">Tracking Number</span>
              <input name="trackingNumber" defaultValue={order.trackingNumber ?? ""} className="input" placeholder="Optional" />
            </label>
          </div>
          <ConfirmSubmitButton
            confirmMessage="Update this order's fulfillment status and tracking number? The customer is not automatically notified."
            className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory"
          >
            Update Fulfillment
          </ConfirmSubmitButton>
        </form>
      </div>
    </div>
  );
}
