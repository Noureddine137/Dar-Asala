import "server-only";
import { prisma } from "@/lib/db/prisma";
import { LeatherColor, BagSize, type Prisma } from "@prisma/client";
import type { CollectionDTO, ProductCardDTO } from "./types";

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

function toCardDTO(product: ProductWithRelations): ProductCardDTO {
  const images = product.images;
  const colors = Array.from(new Set(product.variants.map((v) => v.color)));
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
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

export async function getAllCollections(): Promise<CollectionDTO[]> {
  const collections = await prisma.collection.findMany({ where: { active: true }, orderBy: { position: "asc" } });
  return collections;
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

export async function getCollectionBySlug(
  slug: string,
  filters: CollectionFilters = {}
): Promise<{ collection: CollectionDTO; products: ProductCardDTO[] } | null> {
  let collection: CollectionDTO | null = null;
  let where: Prisma.ProductWhereInput = { status: "ACTIVE" };

  if (slug === "all") {
    collection = {
      id: "all",
      slug: "all",
      title: "All Bags",
      description: "The full Dar Asala catalogue — every handcrafted bag, in one place.",
      heroImage: "/images/categories/all-banner.webp",
    };
  } else if (slug === "new-arrivals") {
    collection = {
      id: "new-arrivals",
      slug: "new-arrivals",
      title: "New Arrivals",
      description: "The newest pieces from the atelier.",
      heroImage: "/images/categories/new-arrivals-banner.webp",
    };
    where = { ...where, isNew: true };
  } else if (slug === "best-sellers") {
    collection = {
      id: "best-sellers",
      slug: "best-sellers",
      title: "Best Sellers",
      description: "The pieces our customers reach for again and again.",
      heroImage: "/images/categories/best-sellers-banner.webp",
    };
    where = { ...where, isBestSeller: true };
  } else {
    const found = await prisma.collection.findUnique({ where: { slug } });
    if (!found || !found.active) return null;
    collection = found;
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

  return { collection, products: products.map(toCardDTO) };
}

export function isKnownCollectionSlug(slug: string) {
  return SPECIAL_SLUGS.has(slug);
}
