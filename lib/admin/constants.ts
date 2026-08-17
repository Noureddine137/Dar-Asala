export const PRODUCT_IMAGE_KINDS = [
  "front",
  "side",
  "back",
  "interior",
  "detail-stitching",
  "detail-hardware",
  "lifestyle",
  "artisan",
] as const;

export const PRODUCT_CATEGORIES = [
  "handbags",
  "shoulder-bags",
  "crossbody-bags",
  "tote-bags",
  "mini-bags",
  "leather-accessories",
] as const;

export const PRODUCT_STATUSES = ["DRAFT", "ACTIVE", "ARCHIVED"] as const;

export const LEATHER_COLORS = ["COGNAC", "DARK_BROWN", "BLACK", "OLIVE", "NATURAL"] as const;
export const BAG_SIZES = ["MINI", "MEDIUM", "LARGE"] as const;
export const HARDWARE_FINISHES = ["BRASS", "ANTIQUE_BRASS"] as const;
export const STRAP_TYPES = ["STANDARD", "LONG", "ADJUSTABLE"] as const;

// The manual dropdown intentionally excludes PENDING (the order's starting state)
// and PAID (set only by the Stripe webhook when a payment actually succeeds).
export const MANUAL_ORDER_STATUS_OPTIONS = [
  { value: "IN_PRODUCTION", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  PAID: "Paid",
  IN_PRODUCTION: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const CUSTOM_ORDER_STATUSES = [
  "new",
  "contacted",
  "quoted",
  "accepted",
  "in_production",
  "completed",
  "rejected",
] as const;

export const CUSTOM_ORDER_STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  accepted: "Accepted",
  in_production: "In Production",
  completed: "Completed",
  rejected: "Rejected",
};

/**
 * Payment status is never manually set — it's derived from fields Stripe
 * actually populated (a payment intent means Stripe confirmed a charge) plus
 * the two statuses that override it (REFUNDED / CANCELLED).
 */
export function derivePaymentStatus(order: { status: string; stripePaymentIntentId: string | null }) {
  if (order.status === "REFUNDED") return "Refunded";
  if (order.status === "CANCELLED") return order.stripePaymentIntentId ? "Cancelled (was paid)" : "Cancelled";
  if (order.stripePaymentIntentId) return "Paid";
  return "Pending";
}
