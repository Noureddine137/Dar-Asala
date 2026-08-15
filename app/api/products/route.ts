import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: NextRequest) {
  const slugsParam = request.nextUrl.searchParams.get("slugs") ?? "";
  const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
  if (slugs.length === 0) {
    return NextResponse.json({ results: [] });
  }

  const products = await prisma.product.findMany({
    where: { slug: { in: slugs }, status: "ACTIVE" },
    include: { images: { orderBy: { position: "asc" } }, variants: true },
  });

  const results = products.map((product) => ({
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
    primaryImage: product.images[0] ?? null,
    hoverImage: product.images[1] ?? product.images[0] ?? null,
    colors: Array.from(new Set(product.variants.map((v) => v.color))),
  }));

  return NextResponse.json({ results });
}
