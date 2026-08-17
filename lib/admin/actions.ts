"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";
import { CUSTOM_ORDER_STATUSES } from "@/lib/admin/constants";
import type { ProductStatus, OrderStatus, LeatherColor, BagSize, HardwareFinish, StrapType } from "@prisma/client";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(formData: FormData) {
  await requireAdminSession();
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
      currency: "EUR",
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
  await requireAdminSession();
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = slugify(String(formData.get("slug") ?? ""));
  const price = Number(formData.get("price") ?? 0);
  const compareAtPriceRaw = formData.get("compareAtPrice");
  const compareAtPrice = compareAtPriceRaw ? Number(compareAtPriceRaw) : null;
  if (!name) throw new Error("Name is required.");
  if (!slugInput) throw new Error("Slug is required.");

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        slug: slugInput,
        shortDescription: String(formData.get("shortDescription") ?? ""),
        description: String(formData.get("description") ?? ""),
        story: String(formData.get("story") ?? "") || null,
        price,
        compareAtPrice,
        currency: String(formData.get("currency") ?? "EUR"),
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
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error(`Slug "${slugInput}" is already used by another product.`);
    }
    throw err;
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function deleteProduct(productId: string) {
  await requireAdminSession();
  const orderItemCount = await prisma.orderItem.count({ where: { productId } });
  if (orderItemCount > 0) {
    throw new Error(
      `This product appears in ${orderItemCount} order${orderItemCount === 1 ? "" : "s"} and can't be deleted. Archive it instead.`
    );
  }

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export async function addVariant(productId: string, formData: FormData) {
  await requireAdminSession();
  const sku = String(formData.get("sku") ?? "").trim();
  if (!sku) throw new Error("SKU is required.");

  const priceOverrideRaw = formData.get("priceOverride");

  try {
    await prisma.productVariant.create({
      data: {
        productId,
        sku,
        color: String(formData.get("color") ?? "COGNAC") as LeatherColor,
        size: String(formData.get("size") ?? "MEDIUM") as BagSize,
        hardware: String(formData.get("hardware") ?? "BRASS") as HardwareFinish,
        strap: String(formData.get("strap") ?? "STANDARD") as StrapType,
        priceOverride: priceOverrideRaw ? Number(priceOverrideRaw) : null,
        stock: Number(formData.get("stock") ?? 0),
        isMadeToOrder: formData.get("isMadeToOrder") === "on",
        imageId: String(formData.get("imageId") ?? "") || null,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error(`SKU "${sku}" is already in use.`);
    }
    throw err;
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function updateVariant(variantId: string, productId: string, formData: FormData) {
  await requireAdminSession();
  const sku = String(formData.get("sku") ?? "").trim();
  if (!sku) throw new Error("SKU is required.");

  const priceOverrideRaw = formData.get("priceOverride");

  try {
    await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        sku,
        color: String(formData.get("color") ?? "COGNAC") as LeatherColor,
        size: String(formData.get("size") ?? "MEDIUM") as BagSize,
        hardware: String(formData.get("hardware") ?? "BRASS") as HardwareFinish,
        strap: String(formData.get("strap") ?? "STANDARD") as StrapType,
        priceOverride: priceOverrideRaw ? Number(priceOverrideRaw) : null,
        stock: Number(formData.get("stock") ?? 0),
        isMadeToOrder: formData.get("isMadeToOrder") === "on",
        imageId: String(formData.get("imageId") ?? "") || null,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error(`SKU "${sku}" is already in use.`);
    }
    throw err;
  }

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function updateVariantStock(variantId: string, stock: number) {
  await requireAdminSession();
  await prisma.productVariant.update({ where: { id: variantId }, data: { stock } });
  revalidatePath("/admin/products");
}

export async function deleteVariant(variantId: string, productId: string) {
  await requireAdminSession();
  const orderItemCount = await prisma.orderItem.count({ where: { variantId } });
  if (orderItemCount > 0) {
    throw new Error("This variant has existing orders and can't be deleted.");
  }
  await prisma.productVariant.delete({ where: { id: variantId } });
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Product images — kept URL-based (no upload pipeline configured yet), but
// fully editable: add, reorder, re-tag, delete, and set a specific image as
// primary. The lowest `position` is always the primary/card image.
// ---------------------------------------------------------------------------

export async function addProductImage(productId: string, formData: FormData) {
  await requireAdminSession();
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
  await requireAdminSession();
  const alt = String(formData.get("alt") ?? "").trim();
  const kind = String(formData.get("kind") ?? "front");
  if (!alt) throw new Error("Alt text is required.");

  await prisma.productImage.update({ where: { id: imageId }, data: { alt, kind } });

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function deleteProductImage(imageId: string, productId: string) {
  await requireAdminSession();
  await prisma.$transaction([
    // Variants pointing at this image fall back to the product's default (primary) image.
    prisma.productVariant.updateMany({ where: { imageId }, data: { imageId: null } }),
    prisma.productImage.delete({ where: { id: imageId } }),
  ]);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

export async function moveProductImage(imageId: string, productId: string, direction: "up" | "down") {
  await requireAdminSession();
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

export async function setPrimaryProductImage(imageId: string, productId: string) {
  await requireAdminSession();
  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { position: "asc" },
  });
  const target = images.find((img) => img.id === imageId);
  if (!target || images[0]?.id === imageId) return;

  // Shift every image before the target down by one position, then place the
  // target at position 0 — keeps every position value unique and stable.
  const before = images.filter((img) => img.id !== imageId);
  await prisma.$transaction([
    prisma.productImage.update({ where: { id: target.id }, data: { position: 0 } }),
    ...before.map((img, i) => prisma.productImage.update({ where: { id: img.id }, data: { position: i + 1 } })),
  ]);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Orders — the fulfillment status is admin-editable, but "Paid" is set only
// by the Stripe webhook and is intentionally excluded from the manual
// dropdown so an order can never be marked paid without Stripe confirming it.
// ---------------------------------------------------------------------------

const MANUAL_ORDER_STATUSES: OrderStatus[] = ["IN_PRODUCTION", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export async function updateOrderStatus(orderId: string, formData: FormData) {
  await requireAdminSession();
  const status = String(formData.get("status") ?? "");
  if (!MANUAL_ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new Error("Invalid status.");
  }
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus, trackingNumber: trackingNumber || null },
  });
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

// ---------------------------------------------------------------------------
// Custom order requests
// ---------------------------------------------------------------------------

export async function updateCustomOrderStatus(requestId: string, formData: FormData) {
  await requireAdminSession();
  const status = String(formData.get("status") ?? "new");
  if (!CUSTOM_ORDER_STATUSES.includes(status as (typeof CUSTOM_ORDER_STATUSES)[number])) {
    throw new Error("Invalid status.");
  }
  await prisma.customOrderRequest.update({ where: { id: requestId }, data: { status } });
  revalidatePath("/admin/custom-requests");
}
