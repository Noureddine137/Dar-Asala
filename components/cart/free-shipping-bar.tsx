import { FREE_SHIPPING_THRESHOLD } from "@/lib/config";
import { formatPrice } from "@/lib/utils/format";

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  return (
    <div>
      <p className="text-xs text-muted">
        {remaining > 0 ? (
          <>
            Add <span className="font-medium text-charcoal">{formatPrice(remaining)}</span> more for free
            shipping
          </>
        ) : (
          <span className="font-medium text-olive">You&rsquo;ve unlocked free shipping</span>
        )}
      </p>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-sand/60">
        <div className="h-full rounded-full bg-olive transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
