import { prisma } from "@/lib/db/prisma";
import { addShippingZone, updateShippingZone, deleteShippingZone } from "@/lib/admin/shipping-actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";

export default async function AdminShippingPage() {
  const zones = await prisma.shippingZone.findMany({ orderBy: { position: "asc" } });
  const activeCount = zones.filter((z) => z.active).length;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif-display text-3xl">Shipping</h1>
      <p className="mt-1 text-sm text-muted">
        These zones are live at checkout: each active zone becomes a shipping option in Stripe
        Checkout, priced here on the server (free once the cart reaches that zone&rsquo;s
        threshold), and the customer selects the one matching their address. Stripe allows at
        most 5 shipping options per checkout, so only the first 5 active zones (by position) are
        used{activeCount > 5 ? ` — you currently have ${activeCount} active, so ${activeCount - 5} won't appear at checkout` : ""}.
        Countries entered below also control which delivery addresses Stripe accepts.
      </p>

      <div className="mt-8 space-y-4">
        {zones.map((z) => {
          const boundUpdate = updateShippingZone.bind(null, z.id);
          const boundDelete = deleteShippingZone.bind(null, z.id);
          return (
            <div key={z.id} className="rounded-sm border border-sand p-4">
              <form action={boundUpdate} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Region</span>
                  <input name="region" defaultValue={z.region} className="input" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Countries</span>
                  <input name="countries" defaultValue={z.countries} className="input" placeholder="DE, FR, NL..." />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Price</span>
                  <input name="price" type="number" step="0.01" defaultValue={Number(z.price)} className="input" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Free Over</span>
                  <input
                    name="freeThreshold"
                    type="number"
                    step="0.01"
                    defaultValue={z.freeThreshold != null ? Number(z.freeThreshold) : ""}
                    className="input"
                    placeholder="Never"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Estimate</span>
                  <input name="estimate" defaultValue={z.estimate} className="input" placeholder="3-5 business days" />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-[10px] uppercase tracking-wide text-muted">Carrier</span>
                  <input name="carrier" defaultValue={z.carrier ?? ""} className="input" placeholder="Optional" />
                </label>
                <div className="flex items-center justify-between gap-3 sm:col-span-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" name="active" defaultChecked={z.active} /> Active
                  </label>
                  <button type="submit" className="text-xs underline">
                    Save
                  </button>
                </div>
              </form>
              <form action={boundDelete} className="mt-2 border-t border-sand/60 pt-2">
                <ConfirmSubmitButton confirmMessage={`Delete the "${z.region}" shipping zone?`} className="text-xs text-terracotta underline">
                  Delete Zone
                </ConfirmSubmitButton>
              </form>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-sm border border-dashed border-sand p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">Add Shipping Zone</p>
        <form action={addShippingZone} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input name="region" placeholder="Region" required className="input" />
          <input name="countries" placeholder="Countries (DE, FR, ...)" required className="input sm:col-span-2" />
          <input name="price" type="number" step="0.01" placeholder="Price" defaultValue={0} className="input" />
          <input name="freeThreshold" type="number" step="0.01" placeholder="Free over (optional)" className="input" />
          <input name="estimate" placeholder="Delivery estimate" required className="input" />
          <input name="carrier" placeholder="Carrier (optional)" className="input sm:col-span-3" />
          <button type="submit" className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory sm:col-span-3 sm:w-fit">
            Add Zone
          </button>
        </form>
      </div>
    </div>
  );
}
