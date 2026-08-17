import { prisma } from "@/lib/db/prisma";
import { createDiscountCode, toggleDiscountCode, deleteDiscountCode } from "@/lib/admin/discounts-actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";
import { formatPrice } from "@/lib/utils/format";

export default async function AdminDiscountsPage() {
  const codes = await prisma.discountCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif-display text-3xl">Discounts</h1>
      <p className="mt-1 rounded-sm border border-terracotta/40 bg-terracotta/10 p-3 text-sm text-charcoal">
        <strong>Not yet applied at checkout.</strong> Codes created here are stored, but Stripe
        Checkout doesn&rsquo;t look them up or apply a discount yet — that integration is a
        follow-up. This screen exists so codes can be prepared in advance and to make the current
        state honest rather than pretending discounts are live.
      </p>

      <div className="mt-8 space-y-3">
        {codes.map((c) => {
          const boundToggle = toggleDiscountCode.bind(null, c.id, !c.active);
          const boundDelete = deleteDiscountCode.bind(null, c.id);
          const expired = c.expiresAt ? c.expiresAt < new Date() : false;
          return (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-sand p-4 text-sm">
              <div>
                <p className="font-mono font-medium">{c.code}</p>
                <p className="text-xs text-muted">
                  {c.percentOff ? `${c.percentOff}% off` : c.amountOff ? `${formatPrice(Number(c.amountOff))} off` : "No discount set"}
                  {c.expiresAt && ` · expires ${c.expiresAt.toLocaleDateString("en-GB")}`}
                  {expired && " (expired)"}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={c.active && !expired ? "text-forest" : "text-muted"}>
                  {c.active && !expired ? "Active" : c.active ? "Expired" : "Inactive"}
                </span>
                <form action={boundToggle}>
                  <button type="submit" className="underline">
                    {c.active ? "Deactivate" : "Activate"}
                  </button>
                </form>
                <form action={boundDelete}>
                  <ConfirmSubmitButton confirmMessage={`Delete code ${c.code}?`} className="text-terracotta underline">
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          );
        })}
        {codes.length === 0 && <p className="text-sm text-muted">No discount codes yet.</p>}
      </div>

      <div className="mt-6 rounded-sm border border-dashed border-sand p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Add Discount Code</p>
        <form action={createDiscountCode} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input name="code" placeholder="CODE20" required className="input" />
          <input name="percentOff" type="number" min={1} max={100} placeholder="% off" className="input" />
          <input name="amountOff" type="number" step="0.01" placeholder="Amount off" className="input" />
          <input name="expiresAt" type="date" className="input" />
          <button type="submit" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory sm:col-span-4 sm:w-fit">
            Add Code
          </button>
        </form>
      </div>
    </div>
  );
}
