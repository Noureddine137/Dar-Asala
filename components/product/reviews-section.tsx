"use client";

import { useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ReviewDTO } from "@/lib/commerce/types";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5", i < rating ? "fill-camel text-camel" : "text-sand")}
        />
      ))}
    </span>
  );
}

export function ReviewsSection({
  reviews,
  averageRating,
  reviewCount,
}: {
  reviews: ReviewDTO[];
  averageRating: number;
  reviewCount: number;
}) {
  const [visible, setVisible] = useState(4);
  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section id="reviews" className="border-t border-sand/70 py-14 md:py-20">
      <div className="container-page">
        <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">Reviews</h2>

        {reviewCount === 0 ? (
          <p className="mt-4 text-sm text-muted">No reviews yet for this piece — be the first to share yours.</p>
        ) : (
          <div className="mt-8 grid gap-10 md:grid-cols-[280px_1fr]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif-display text-5xl text-charcoal">{averageRating.toFixed(1)}</span>
                <div>
                  <Stars rating={Math.round(averageRating)} size="lg" />
                  <p className="mt-1 text-xs text-muted">
                    Based on {reviewCount} review{reviewCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-1.5">
                {histogram.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2 text-xs text-muted">
                    <span className="w-3">{star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand/60">
                      <div
                        className="h-full rounded-full bg-camel"
                        style={{ width: reviewCount ? `${(count / reviewCount) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="w-4 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="divide-y divide-sand/60">
              {reviews.slice(0, visible).map((review) => (
                <article key={review.id} className="py-5 first:pt-0">
                  <div className="flex items-center justify-between">
                    <Stars rating={review.rating} />
                    <time className="text-xs text-muted" dateTime={review.createdAt}>
                      {new Date(review.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                    </time>
                  </div>
                  <h3 className="mt-2 font-medium text-charcoal">{review.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal/80">{review.content}</p>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
                    <span className="font-medium text-charcoal">{review.author}</span>
                    <span>· {review.country}</span>
                    {review.verifiedPurchase && (
                      <span className="ml-1 inline-flex items-center gap-1 text-olive">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified purchase
                      </span>
                    )}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}

        {visible < reviews.length && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + 4)}
              className="text-sm font-medium text-charcoal underline underline-offset-4"
            >
              Load more reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
