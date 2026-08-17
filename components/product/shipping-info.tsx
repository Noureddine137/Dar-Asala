import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_RATE } from "@/lib/config";
import { formatPrice } from "@/lib/utils/format";

const REGIONS = [
  { region: "European Union", note: "3–5 business days · DHL / national post" },
  { region: "United Kingdom", note: "4–7 business days · DHL Express" },
  { region: "Switzerland", note: "4–7 business days · DHL Express" },
  { region: "Norway", note: "5–8 business days · DHL Express" },
  { region: "Worldwide", note: "6–12 business days · DHL Express" },
];

export function ShippingInfo() {
  return (
    <div>
      <p className="mb-4 font-serif-display text-xl text-charcoal md:text-2xl">Shipping</p>
      <div className="divide-y divide-sand rounded-sm border border-sand bg-ivory">
        {REGIONS.map((r, i) => (
          <div key={r.region} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-charcoal">{r.region}</p>
              <p className="text-xs text-muted">{r.note}</p>
            </div>
            <p className="shrink-0 text-right text-xs text-charcoal/80">
              {i === 0 ? (
                <>
                  Free over {formatPrice(FREE_SHIPPING_THRESHOLD)}
                  <br />
                  <span className="text-muted">{formatPrice(STANDARD_SHIPPING_RATE)} otherwise</span>
                </>
              ) : (
                "Calculated at checkout"
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
