"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ReviewDTO } from "@/lib/commerce/types";
import type { StoreReviewDTO } from "@/lib/commerce/products";

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

type SortOption = "recent" | "highest" | "lowest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "recent", label: "Most Recent" },
  { value: "highest", label: "Highest Rating" },
  { value: "lowest", label: "Lowest Rating" },
];

function sortReviews<T extends { rating: number; createdAt: string }>(reviews: T[], sort: SortOption): T[] {
  const copy = [...reviews];
  if (sort === "highest") return copy.sort((a, b) => b.rating - a.rating);
  if (sort === "lowest") return copy.sort((a, b) => a.rating - b.rating);
  return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function ReviewsSection({
  reviews,
  averageRating,
  reviewCount,
  storeReviews,
  storeAverageRating,
  storeReviewCount,
}: {
  reviews: ReviewDTO[];
  averageRating: number;
  reviewCount: number;
  storeReviews: StoreReviewDTO[];
  storeAverageRating: number;
  storeReviewCount: number;
}) {
  const [tab, setTab] = useState<"product" | "store">("product");
  const [sort, setSort] = useState<SortOption>("recent");
  const [visible, setVisible] = useState(4);

  const activeReviews = tab === "product" ? reviews : storeReviews;
  const activeAverage = tab === "product" ? averageRating : storeAverageRating;
  const activeCount = tab === "product" ? reviewCount : storeReviewCount;
  const sorted = useMemo(() => sortReviews(activeReviews, sort), [activeReviews, sort]);

  const histogram = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: activeReviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section id="reviews" className="border-t border-sand py-14 md:py-20">
      <div className="container-page">
        <h2 className="font-serif-display text-2xl text-charcoal md:text-3xl">Customer Reviews</h2>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setTab("product");
              setVisible(4);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium sm:text-sm",
              tab === "product" ? "border-charcoal bg-charcoal text-ivory" : "border-sand text-charcoal"
            )}
          >
            Product Reviews ({reviewCount})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("store");
              setVisible(4);
            }}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium sm:text-sm",
              tab === "store" ? "border-charcoal bg-charcoal text-ivory" : "border-sand text-charcoal"
            )}
          >
            Store Reviews ({storeReviewCount})
          </button>
        </div>

        {activeCount === 0 ? (
          <p className="mt-6 text-sm text-muted">No reviews yet — be the first to share yours.</p>
        ) : (
          <div className="mt-8 grid gap-10 md:grid-cols-[260px_1fr]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="font-serif-display text-5xl text-charcoal">{activeAverage.toFixed(1)}</span>
                <div>
                  <Stars rating={Math.round(activeAverage)} size="lg" />
                  <p className="mt-1 text-xs text-muted">
                    Based on {activeCount} review{activeCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-1.5">
                {histogram.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2 text-xs text-muted">
                    <span className="w-3">{star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                      <div
                        className="h-full rounded-full bg-camel"
                        style={{ width: activeCount ? `${(count / activeCount) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="w-6 text-right">
                      {activeCount ? Math.round((count / activeCount) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-4 flex justify-end">
                <label className="flex items-center gap-2 text-xs sm:text-sm">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="rounded-sm border border-sand bg-ivory px-3 py-1.5 text-charcoal focus:border-charcoal focus:outline-none"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="divide-y divide-sand">
                {sorted.slice(0, visible).map((review) => (
                  <article key={review.id} className="py-5 first:pt-0">
                    <div className="flex items-center justify-between">
                      <Stars rating={review.rating} />
                      <time className="text-xs text-muted" dateTime={review.createdAt}>
                        {new Date(review.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </time>
                    </div>
                    <h3 className="mt-2 font-medium text-charcoal">{review.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-charcoal/80">{review.content}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                      <span className="font-medium text-charcoal">{review.author}</span>
                      <span>· {review.country}</span>
                      {review.verifiedPurchase && (
                        <span className="ml-1 inline-flex items-center gap-1 text-olive">
                          <BadgeCheck className="h-3.5 w-3.5" /> Verified Purchase
                        </span>
                      )}
                      {tab === "store" && "productSlug" in review && (
                        <Link href={`/products/${(review as StoreReviewDTO).productSlug}`} className="ml-auto underline">
                          {(review as StoreReviewDTO).productName}
                        </Link>
                      )}
                    </p>
                  </article>
                ))}
              </div>

              {visible < sorted.length && (
                <div className="mt-6 flex justify-center">
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
          </div>
        )}
      </div>
    </section>
  );
}
