import "server-only";
import { prisma } from "@/lib/db/prisma";
import { toPrismaLocale, withTranslation, type Locale } from "@/lib/i18n/merge";

const TESTIMONIAL_TRANSLATION_KEYS = ["quote"] as const;

/**
 * Author name, country, rating, avatar and ordering stay shared — only the
 * quote text is translated (falls back to the English quote when missing).
 */
export async function getTestimonials(locale: Locale, limit = 3) {
  const testimonials = await prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { position: "asc" },
    take: limit,
  });

  const prismaLocale = toPrismaLocale(locale);
  const translations = prismaLocale
    ? await prisma.testimonialTranslation.findMany({
        where: { testimonialId: { in: testimonials.map((t) => t.id) }, locale: prismaLocale },
      })
    : [];
  const byId = new Map(translations.map((t) => [t.testimonialId, t]));

  return testimonials.map((testimonial) => withTranslation(testimonial, byId.get(testimonial.id), TESTIMONIAL_TRANSLATION_KEYS));
}
