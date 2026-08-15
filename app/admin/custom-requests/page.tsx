import { prisma } from "@/lib/db/prisma";
import { updateCustomOrderStatus } from "@/lib/admin/actions";

export default async function AdminCustomRequestsPage() {
  const requests = await prisma.customOrderRequest.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Custom Order Requests</h1>

      {requests.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No custom order requests yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {requests.map((r) => {
            const boundUpdate = updateCustomOrderStatus.bind(null, r.id);
            return (
              <div key={r.id} className="rounded-sm border border-sand p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-sm text-muted">{r.email}</p>
                  </div>
                  <form action={boundUpdate} className="flex items-center gap-2">
                    <select name="status" defaultValue={r.status} className="input w-auto">
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button type="submit" className="text-xs underline">
                      Update
                    </button>
                  </form>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-charcoal/80 sm:grid-cols-3">
                  {r.leatherColor && (
                    <div>
                      <dt className="text-xs text-muted">Leather Color</dt>
                      <dd>{r.leatherColor}</dd>
                    </div>
                  )}
                  {r.dimensions && (
                    <div>
                      <dt className="text-xs text-muted">Dimensions</dt>
                      <dd>{r.dimensions}</dd>
                    </div>
                  )}
                  {r.strapLength && (
                    <div>
                      <dt className="text-xs text-muted">Strap Length</dt>
                      <dd>{r.strapLength}</dd>
                    </div>
                  )}
                  {r.initials && (
                    <div>
                      <dt className="text-xs text-muted">Initials</dt>
                      <dd>{r.initials}</dd>
                    </div>
                  )}
                  {r.lining && (
                    <div>
                      <dt className="text-xs text-muted">Lining</dt>
                      <dd>{r.lining}</dd>
                    </div>
                  )}
                  {r.hardware && (
                    <div>
                      <dt className="text-xs text-muted">Hardware</dt>
                      <dd>{r.hardware}</dd>
                    </div>
                  )}
                </dl>
                {r.message && <p className="mt-3 text-sm text-charcoal/80">&ldquo;{r.message}&rdquo;</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
