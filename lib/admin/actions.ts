"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import type { ProductStatus } from "@prisma/client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required.");

  const slug = slugify(name);
  const product = await prisma.product.create({
    data: {
      name,
      slug,
      shortDescription: "New handcrafted piece — update this description.",
      description: "New handcrafted piece — update this description.",
      price: 0,
      category: "handbags",
      materials: "Full-grain, vegetable-tanned Moroccan leather.",
      careInstructions: "Wipe clean with a soft, dry cloth. Condition periodically with leather balm.",
      productionTime: "Made to order — handcrafted in 7–14 business days",
      status: "DRAFT",
    },
  });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price") ?? 0);
  const compareAtPriceRaw = formData.get("compareAtPrice");
  const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      shortDescription: String(formData.get("shortDescription") ?? ""),
      description: String(formData.get("description") ?? ""),
      story: String(formData.get("story") ?? "") || null,
      price,
      compareAtPrice,
      category: String(formData.get("category") ?? "handbags"),
      materials: String(formData.get("materials") ?? ""),
      careInstructions: String(formData.get("careInstructions") ?? ""),
      productionTime: String(formData.get("productionTime") ?? ""),
      status: String(formData.get("status") ?? "DRAFT") as ProductStatus,
      featured: formData.get("featured") === "on",
      isNew: formData.get("isNew") === "on",
      isBestSeller: formData.get("isBestSeller") === "on",
      isMadeToOrder: formData.get("isMadeToOrder") === "on",
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function updateVariantStock(variantId: string, stock: number) {
  await prisma.productVariant.update({ where: { id: variantId }, data: { stock } });
  revalidatePath("/admin/products");
}

// ---------------------------------------------------------------------------
// Product images — kept URL-based (no upload pipeline configured yet), but
// fully editable: add, reorder, re-tag, delete, and the lowest `position`
// is always treated as the primary/card image by the storefront.
// ---------------------------------------------------------------------------

export async function addProductImage(productId: string, formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  const alt = String(formData.get("alt") ?? "").trim();
  const kind = String(formData.get("kind") ?? "front");
  if (!url || !alt) throw new Error("Image URL and alt text are required.");

  const maxPosition = await prisma.productImage.aggregate({
    where: { productId },
    _max: { position: true },
  });

  await prisma.productImage.create({
    data: {
      productId,
      url,
      alt,
      kind,
      position: (maxPosition._max.position ?? -1) + 1,
    },
  });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function updateProductImageMeta(imageId: string, productId: string, formData: FormData) {
  const alt = String(formData.get("alt") ?? "").trim();
  const kind = String(formData.get("kind") ?? "front");
  if (!alt) throw new Error("Alt text is required.");

  await prisma.productImage.update({ where: { id: imageId }, data: { alt, kind } });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function deleteProductImage(imageId: string, productId: string) {
  await prisma.$transaction([
    // Variants pointing at this image fall back to the product's default (primary) image.
    prisma.productVariant.updateMany({ where: { imageId }, data: { imageId: null } }),
    prisma.productImage.delete({ where: { id: imageId } }),
  ]);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function moveProductImage(imageId: string, productId: string, direction: "up" | "down") {
  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { position: "asc" },
  });
  const index = images.findIndex((img) => img.id === imageId);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= images.length) return;

  const a = images[index];
  const b = images[swapWith];

  await prisma.$transaction([
    prisma.productImage.update({ where: { id: a.id }, data: { position: b.position } }),
    prisma.productImage.update({ where: { id: b.id }, data: { position: a.position } }),
  ]);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function updateOrderStatus(orderId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "PENDING");
  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as Parameters<typeof prisma.order.update>[0]["data"]["status"] },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function updateCustomOrderStatus(requestId: string, formData: FormData) {
  const status = String(formData.get("status") ?? "new");
  await prisma.customOrderRequest.update({ where: { id: requestId }, data: { status } });
  revalidatePath("/admin/custom-requests");
}
