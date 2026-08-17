"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/admin/guard";

export async function setReviewPublished(reviewId: string, published: boolean) {
  await requireAdminSession();
  await prisma.review.update({ where: { id: reviewId }, data: { published } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}

export async function deleteReview(reviewId: string) {
  await requireAdminSession();
  await prisma.review.delete({ where: { id: reviewId } });
  revalidatePath("/admin/reviews");
  revalidatePath("/");
}
