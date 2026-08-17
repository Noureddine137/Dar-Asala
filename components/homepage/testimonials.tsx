import Image from "next/image";
import { Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { getTestimonials } from "@/lib/content/testimonials";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/i18n/routing";

export async function Testimonials() {
  const locale = (await getLocale()) as Locale;
  const [testimonials, t] = await Promise.all([getTestimonials(locale), getTranslations("home")]);

  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-sand py-16 md:py-24">
      <div className="container-page mb-8 md:mb-10">
        <h2 className="font-serif-display text-3xl text-charcoal md:text-4xl">{t("whatCustomersSay")}</h2>
      </div>

      <div className="container-page">
        <div className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="w-[82vw] shrink-0 snap-start rounded-sm bg-cream p-6 md:w-auto md:p-8"
            >
              <div className="flex items-center gap-0.5" aria-label={`${testimonial.rating} / 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3.5 w-3.5", i < testimonial.rating ? "fill-camel text-camel" : "text-sand")}
                  />
                ))}
              </div>
              <blockquote className="mt-4 font-serif-display text-lg leading-snug text-charcoal">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {testimonial.avatarUrl && (
                  <span className="relative h-9 w-9 overflow-hidden rounded-full">
                    <Image src={testimonial.avatarUrl} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                )}
                <span className="text-sm text-muted">
                  <span className="font-medium text-charcoal">{testimonial.authorName}</span> · {testimonial.country}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
