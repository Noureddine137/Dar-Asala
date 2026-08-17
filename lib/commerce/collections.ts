import "server-only";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db/prisma";
import { LeatherColor, BagSize, type Prisma } from "@prisma/client";
import type { CollectionDTO, ProductCardDTO } from "./types";
import { toPrismaLocale, withTranslation, type Locale } from "@/lib/i18n/merge";

function toLeatherColors(values: string[]): LeatherColor[] {
  return values.filter((v): v is LeatherColor => (Object.values(LeatherColor) as string[]).includes(v));
}

function toBagSizes(values: string[]): BagSize[] {
  return values.filter((v): v is BagSize => (Object.values(BagSize) as string[]).includes(v));
}

const cardInclude = {
  images: { orderBy: { position: "asc" as const } },
  variants: true,
} satisfies Prisma.ProductInclude;

type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

const PRODUCT_CARD_TRANSLATION_KEYS = ["name", "shortDescription"] as const;
const COLLECTION_TRANSLATION_KEYS = ["title", "description"] as const;

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
  const localized = withTranslation(product, translation, PRODUCT_CARD_TRANSLATION_KEYS);
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

function toCollectionDTO(
  collection: { id: string; slug: string; title: string; description: string; heroImage: string },
  translation: { title: string; description: string; seoTitle: string | null; seoDescription: string | null } | undefined
): CollectionDTO {
  const localized = withTranslation(collection, translation, COLLECTION_TRANSLATION_KEYS);
  return {
    id: collection.id,
    slug: collection.slug,
    title: localized.title,
    description: localized.description,
    heroImage: collection.heroImage,
    seoTitle: translation?.seoTitle || localized.title,
    seoDescription: translation?.seoDescription || localized.description,
  };
}

export async function getAllCollections(locale: Locale): Promise<CollectionDTO[]> {
  const collections = await prisma.collection.findMany({ where: { active: true }, orderBy: { position: "asc" } });
  const prismaLocale = toPrismaLocale(locale);
  const translations = prismaLocale
    ? await prisma.collectionTranslation.findMany({
        where: { collectionId: { in: collections.map((c) => c.id) }, locale: prismaLocale },
      })
    : [];
  const byId = new Map(translations.map((t) => [t.collectionId, t]));
  return collections.map((c) => toCollectionDTO(c, byId.get(c.id)));
}

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc";

export type CollectionFilters = {
  color?: string[];
  size?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
};

const SPECIAL_SLUGS = new Set(["all", "new-arrivals", "best-sellers"]);

/**
 * The three synthetic collections ("all", "new-arrivals", "best-sellers")
 * aren't DB rows, so their copy lives in messages/*.json (namespace
 * "virtualCollections") rather than a translation table.
 */
async function virtualCollection(slug: "all" | "newArrivals" | "bestSellers", realSlug: string): Promise<CollectionDTO> {
  const t = await getTranslations("virtualCollections");
  const title = t(`${slug}.title`);
  const description = t(`${slug}.description`);
  return {
    id: realSlug,
    slug: realSlug,
    title,
    description,
    heroImage: `/images/categories/${realSlug}-banner.webp`,
    seoTitle: title,
    seoDescription: description,
  };
}

export async function getCollectionBySlug(
  slug: string,
  locale: Locale,
  filters: CollectionFilters = {}
): Promise<{ collection: CollectionDTO; products: ProductCardDTO[] } | null> {
  let collection: CollectionDTO | null = null;
  let where: Prisma.ProductWhereInput = { status: "ACTIVE" };

  if (slug === "all") {
    collection = await virtualCollection("all", "all");
  } else if (slug === "new-arrivals") {
    collection = await virtualCollection("newArrivals", "new-arrivals");
    where = { ...where, isNew: true };
  } else if (slug === "best-sellers") {
    collection = await virtualCollection("bestSellers", "best-sellers");
    where = { ...where, isBestSeller: true };
  } else {
    const found = await prisma.collection.findUnique({ where: { slug } });
    if (!found || !found.active) return null;
    const prismaLocale = toPrismaLocale(locale);
    const translation = prismaLocale
      ? (await prisma.collectionTranslation.findUnique({ where: { collectionId_locale: { collectionId: found.id, locale: prismaLocale } } })) ?? undefined
      : undefined;
    collection = toCollectionDTO(found, translation);
    where = { ...where, collections: { some: { collection: { slug } } } };
  }

  const colorValues = toLeatherColors(filters.color ?? []);
  const sizeValues = toBagSizes(filters.size ?? []);
  if (colorValues.length || sizeValues.length) {
    where = {
      ...where,
      variants: {
        some: {
          ...(colorValues.length ? { color: { in: colorValues } } : {}),
          ...(sizeValues.length ? { size: { in: sizeValues } } : {}),
        },
      },
    };
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    where = {
      ...where,
      price: {
        ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
      },
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "newest"
      ? { createdAt: "desc" }
      : filters.sort === "price-asc"
        ? { price: "asc" }
        : filters.sort === "price-desc"
          ? { price: "desc" }
          : { featured: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: cardInclude,
    orderBy,
  });

  return { collection, products: await toCardDTOs(products, locale) };
}

export function isKnownCollectionSlug(slug: string) {
  return SPECIAL_SLUGS.has(slug);
}
