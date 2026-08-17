import { prisma } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/format";

export async function ShippingInfo() {
  const zones = await prisma.shippingZone.findMany({ where: { active: true }, orderBy: { position: "asc" } });

  if (zones.length === 0) return null;

  return (
    <div>
      <p className="mb-4 font-serif-display text-xl text-charcoal md:text-2xl">Shipping</p>
      <div className="divide-y divide-sand rounded-sm border border-sand bg-ivory">
        {zones.map((z) => (
          <div key={z.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-charcoal">{z.region}</p>
              <p className="text-xs text-muted">
                {z.estimate}
                {z.carrier ? ` · ${z.carrier}` : ""}
              </p>
            </div>
            <p className="shrink-0 text-right text-xs text-charcoal/80">
              {z.freeThreshold != null ? (
                <>
                  Free over {formatPrice(Number(z.freeThreshold))}
                  <br />
                  <span className="text-muted">{formatPrice(Number(z.price))} otherwise</span>
                </>
              ) : (
                formatPrice(Number(z.price))
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
