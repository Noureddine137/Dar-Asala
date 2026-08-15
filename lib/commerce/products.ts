import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductCardDTO, ProductDetailDTO, ReviewDTO } from "./types";

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

function toDetailDTO(
  product: Prisma.ProductGetPayload<{
    include: { images: true; variants: true; reviews: true };
  }>
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

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    story: product.story,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    currency: product.currency,
    category: product.category,
    isNew: product.isNew,
    isBestSeller: product.isBestSeller,
    isMadeToOrder: product.isMadeToOrder,
    materials: product.materials,
    careInstructions: product.careInstructions,
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
  };
}

export async function getFeaturedProducts(limit = 6): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", featured: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return products.map(toCardDTO);
}

export async function getAllActiveProducts(): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardDTO);
}

export async function getNewArrivals(): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", isNew: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardDTO);
}

export async function getBestSellers(): Promise<ProductCardDTO[]> {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE", isBestSeller: true },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardDTO);
}

export async function getProductBySlug(slug: string): Promise<ProductDetailDTO | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { images: true, variants: true, reviews: true },
  });
  if (!product) return null;
  return toDetailDTO(product);
}

export async function getRelatedProducts(product: ProductCardDTO, limit = 4): Promise<ProductCardDTO[]> {
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
    return [...products, ...fallback].map(toCardDTO);
  }
  return products.map(toCardDTO);
}

export async function searchProducts(query: string): Promise<ProductCardDTO[]> {
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
  return products.map(toCardDTO);
}
