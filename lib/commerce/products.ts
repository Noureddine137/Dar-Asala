import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductCardDTO, ProductDetailDTO, ReviewDTO } from "./types";
import { toPrismaLocale, withTranslation, type Locale } from "@/lib/i18n/merge";

const cardInclude = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

const CARD_TRANSLATION_KEYS = ["name", "shortDescription"] as const;
const DETAIL_TRANSLATION_KEYS = [
  "name",
  "shortDescription",
  "description",
  "story",
  "materials",
  "careInstructions",
] as const;

/** Batch-fetches translation rows for a set of products and returns a lookup keyed by productId. */
async function loadProductTranslations(productIds: string[], locale: Locale) {
  const prismaLocale = toPrismaLocale(locale);
  if (!prismaLocale || productIds.length === 0) return new Map<string, Prisma.ProductTranslationGetPayload<object>>();
  const rows = await prisma.productTranslation.findMany({
    where: { productId: { in: productIds }, locale: prismaLocale },
  });
  return new Map(rows.map((row) => [row.productId, row]));
}

function toCardDTO(
  product: ProductWithRelations,
  translation: Prisma.ProductTranslationGetPayload<object> | undefined
): ProductCardDTO {
  const images = product.images;
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const localized = withTranslation(product, translation, CARD_TRANSLATION_KEYS);
  return {
    id: product.id,
    slug: product.slug,
    name: localized.name,
    shortDescription: localized.shortDescription,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    currency: product.currency,
    category: product.category,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    isMadeToOrder: product.isMadeToOrder,
    primaryImage: images[0] ?? null,
    hoverImage: images[1] ?? images[0] ?? null,
    colors,
  };
}

async function toCardDTOs(products: ProductWithRelations[], locale: Locale): Promise<ProductCardDTO[]> {
  const translations = await loadProductTranslations(products.map((p) => p.id), locale);
  return products.map((product) => toCardDTO(product, translations.get(product.id)));
}

function toDetailDTO(
  product: Prisma.ProductGetPayload<{
    include: { images: true; variants: true; reviews: { where: { published: true } } };
  }>,
  translation: Prisma.ProductTranslationGetPayload<object> | undefined
): ProductDetailDTO {
  const images = [...product.images].sort((a, b) => a.position - b.position);
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  const reviews: ReviewDTO[] = product.reviews
    .map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      content: r.content,
      author: r.author,
      country: r.country,
      verifiedPurchase: r.verifiedPurchase,
      createdAt: r.createdAt.toISOString(),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const averageRating = reviews.length
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  const localized = withTranslation(product, translation, DETAIL_TRANSLATION_KEYS);

  return {
    id: product.id,
    slug: product.slug,
    name: localized.name,
    shortDescription: localized.shortDescription,
    description: localized.description,
    story: localized.story,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    currency: product.currency,
    category: product.category,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    isMadeToOrder: product.isMadeToOrder,
    materials: localized.materials,
    careInstructions: localized.careInstructions,
    productionTime: product.productionTime,
    primaryImage: images[0] ?? null,
    hoverImage: images[1] ?? images[0] ?? null,
    colors,
    images,
    variants: product.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      color: v.color,
      size: v.size,
      hardware: v.hardware,
      strap: v.strap,
      stock: v.stock,
      isMadeToOrder: v.isMadeToOrder,
      price: v.priceOverride ? Number(v.priceOverride) : Number(product.price),
      imageId: v.imageId,
    })),
    reviews,
    averageRating,
    reviewCount: reviews.length,
    seoTitle: translation?.seoTitle || localized.name,
    seoDescription: translation?.seoDescription || localized.shortDescription,
  };
}

export async function getFeaturedProducts(locale: Locale, limit = 6): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", featured: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return toCardDTOs(products, locale);
}

export async function getAllActiveProducts(locale: Locale): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  return toCardDTOs(products, locale);
}

export async function getNewArrivals(locale: Locale): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", isNew: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  return toCardDTOs(products, locale);
}

export async function getBestSellers(locale: Locale): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", isBestSeller: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  return toCardDTOs(products, locale);
}

export async function getProductBySlug(slug: string, locale: Locale): Promise<ProductDetailDTO | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true, reviews: { where: { published: true } } },
  });
  if (!product) return null;
  const prismaLocale = toPrismaLocale(locale);
  const translation = prismaLocale
    ? (await prisma.productTranslation.findUnique({ where: { productId_locale: { productId: product.id, locale: prismaLocale } } })) ?? undefined
    : undefined;
  return toDetailDTO(product, translation);
}

export async function getRelatedProducts(product: ProductCardDTO, locale: Locale, limit = 4): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", category: product.category, id: { not: product.id } },
    include: cardInclude,
    take: limit,
  });
  if (products.length < limit) {
    const fallback = await prisma.product.findMany({
      where: { status: "ACTIVE", id: { notIn: [product.id, ...products.map((p) => p.id)] } },
      include: cardInclude,
      take: limit - products.length,
    });
    return toCardDTOs([...products, ...fallback], locale);
  }
  return toCardDTOs(products, locale);
}

export async function searchProducts(query: string, locale: Locale): Promise<ProductCardDTO[]> {
  const q = query.trim();
  if (!q) return [];
  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { contains: q, mode: "insensitive" } },
        { materials: { contains: q, mode: "insensitive" } },
      ],
    },
    include: cardInclude,
    take: 24,
  });
  return toCardDTOs(products, locale);
}

export type StoreReviewDTO = ReviewDTO & { productName: string; productSlug: string };

export async function getStoreReviewSummary(locale: Locale): Promise<{
  averageRating: number;
  reviewCount: number;
  reviews: StoreReviewDTO[];
}> {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    include: { product: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  const reviewCount = reviews.length;
  const averageRating = reviewCount
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) * 10) / 10
    : 0;

  const translations = await loadProductTranslations(
    Array.from(new Set(reviews.map((r) => r.product.id))),
    locale
  );

  return {
    averageRating,
    reviewCount,
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      content: r.content,
      author: r.author,
      country: r.country,
      verifiedPurchase: r.verifiedPurchase,
      createdAt: r.createdAt.toISOString(),
      productName: translations.get(r.product.id)?.name || r.product.name,
      productSlug: r.product.slug,
    })),
  };
}
