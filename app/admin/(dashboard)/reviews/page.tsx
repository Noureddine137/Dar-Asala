import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import { setReviewPublished, deleteReview } from "@/lib/admin/reviews-actions";
import { ConfirmSubmitButton } from "@/components/admin/confirm-submit";
import { cn } from "@/lib/utils/cn";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif-display text-3xl">Reviews</h1>
      <p className="mt-1 text-sm text-muted">
        Hidden reviews are kept but no longer shown on the storefront. The verified-purchase badge
        is read-only — set only from real order data, never editable here.
      </p>

      {reviews.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No reviews yet.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {reviews.map((r) => {
            const boundPublish = setReviewPublished.bind(null, r.id, !r.published);
            const boundDelete = deleteReview.bind(null, r.id);
            return (
              <div key={r.id} className={cn("rounded-sm border p-4", r.published ? "border-sand" : "border-sand bg-sand/20")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-camel text-camel" : "text-sand")} />
                      ))}
                      {r.verifiedPurchase && (
                        <span className="ml-1.5 rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-forest">
                          Verified Purchase
                        </span>
                      )}
                      {!r.published && (
                        <span className="ml-1.5 rounded-full bg-terracotta/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-terracotta">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-medium text-charcoal">{r.title}</p>
                    <p className="mt-1 text-sm text-charcoal/80">{r.content}</p>
                    <p className="mt-2 text-xs text-muted">
                      {r.author} · {r.country} · {r.createdAt.toLocaleDateString("en-GB")} ·{" "}
                      <Link href={`/admin/products/${r.product.id}`} className="underline">
                        {r.product.name}
                      </Link>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-3 text-xs">
                    <form action={boundPublish}>
                      <button type="submit" className="underline">
                        {r.published ? "Hide" : "Publish"}
                      </button>
                    </form>
                    <form action={boundDelete}>
                      <ConfirmSubmitButton confirmMessage="Delete this review permanently?" className="admin-danger-link">
                        Delete
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
