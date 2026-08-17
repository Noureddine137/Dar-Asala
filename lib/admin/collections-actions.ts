"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createCollection(formData: FormData) {
  await requireAdminSession();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required.");

  const count = await prisma.collection.count();

  try {
    const collection = await prisma.collection.create({
      data: {
        title,
        slug: slugify(title),
        description: "New collection — update this description.",
        heroImage: "/images/categories/all-banner.webp",
        position: count,
      },
    });
    revalidatePath("/admin/collections");
    redirect(`/admin/collections/${collection.id}`);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("A collection with this slug already exists.");
    }
    throw err;
  }
}

export async function updateCollection(collectionId: string, formData: FormData) {
  await requireAdminSession();
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? ""));
  if (!title) throw new Error("Title is required.");
  if (!slug) throw new Error("Slug is required.");

  try {
    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        title,
        slug,
        description: String(formData.get("description") ?? ""),
        heroImage: String(formData.get("heroImage") ?? ""),
        position: Number(formData.get("position") ?? 0),
        active: formData.get("active") === "on",
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error(`Slug "${slug}" is already used by another collection.`);
    }
    throw err;
  }

  revalidatePath("/admin/collections");
  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/");
}

export async function deleteCollection(collectionId: string) {
  await requireAdminSession();
  await prisma.collection.delete({ where: { id: collectionId } });
  revalidatePath("/admin/collections");
  revalidatePath("/");
  redirect("/admin/collections");
}

export async function addProductToCollection(collectionId: string, formData: FormData) {
  await requireAdminSession();
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Choose a product.");

  const maxPosition = await prisma.collectionProduct.aggregate({
    where: { collectionId },
    _max: { position: true },
  });

  try {
    await prisma.collectionProduct.create({
      data: { collectionId, productId, position: (maxPosition._max.position ?? -1) + 1 },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new Error("That product is already in this collection.");
    }
    throw err;
  }

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/");
}

export async function removeProductFromCollection(collectionProductId: string, collectionId: string) {
  await requireAdminSession();
  await prisma.collectionProduct.delete({ where: { id: collectionProductId } });
  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/");
}

export async function moveCollectionProduct(
  collectionProductId: string,
  collectionId: string,
  direction: "up" | "down"
) {
  await requireAdminSession();
  const rows = await prisma.collectionProduct.findMany({
    where: { collectionId },
    orderBy: { position: "asc" },
  });
  const index = rows.findIndex((r) => r.id === collectionProductId);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= rows.length) return;

  const a = rows[index];
  const b = rows[swapWith];

  await prisma.$transaction([
    prisma.collectionProduct.update({ where: { id: a.id }, data: { position: b.position } }),
    prisma.collectionProduct.update({ where: { id: b.id }, data: { position: a.position } }),
  ]);

  revalidatePath(`/admin/collections/${collectionId}`);
  revalidatePath("/");
}
