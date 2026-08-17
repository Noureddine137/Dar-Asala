import "server-only";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/db/prisma";

/**
 * Product photo storage on Vercel Blob. Chosen over S3-compatible storage or
 * Cloudinary because it needs the least setup for this app: a single
 * BLOB_READ_WRITE_TOKEN env var, a put() call that takes a File directly
 * from a Server Action's FormData and returns a stable public HTTPS URL, no
 * bucket/CORS/IAM policy configuration, and no client-exposed credentials —
 * the token is only ever read server-side, inside Server Actions. It works
 * from any Next.js deployment (not only Vercel hosting) as long as the
 * token is set.
 */

export const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB — generous for real product photography
const HEIC_MIME_TYPES = ["image/heic", "image/heif"];

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Server-side validation — the client-side accept/size hints are UX only, never trusted. */
export function validateImageFile(file: File): string | null {
  if (!file || file.size === 0) {
    return "No file was received. Please choose an image and try again.";
  }
  if (HEIC_MIME_TYPES.includes(file.type)) {
    return "HEIC/HEIF photos aren't supported. On iPhone: Settings → Camera → Formats → Most Compatible (or use \"Export as JPEG\" when sharing the photo), then upload again.";
  }
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return `Unsupported file type "${file.type || "unknown"}". Please upload a JPEG, PNG or WebP image.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`;
  }
  return null;
}

function isBlobStorageUrl(url: string) {
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/**
 * Uploads a validated file to Blob storage under a safe, unique key — never
 * the original filename — and returns the public URL to store on the
 * ProductImage row.
 */
export async function uploadProductImageFile(productId: string, file: File): Promise<string> {
  if (!isBlobConfigured()) {
    throw new Error(
      "Image uploads aren't configured on this server (missing BLOB_READ_WRITE_TOKEN). Add the image by URL below instead, or set the token to enable uploads."
    );
  }

  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const ext = EXT_BY_MIME[file.type] ?? "jpg";
  const key = `products/${productId}/${crypto.randomUUID()}.${ext}`;

  const blob = await put(key, file, {
    access: "public",
    contentType: file.type,
    addRandomSuffix: false,
  });

  return blob.url;
}

/**
 * Deletes the underlying Blob object only if the URL is actually one of
 * ours (not a static /images/... asset or an admin-pasted external URL,
 * which we can't and shouldn't try to delete) and only if no other
 * ProductImage row still references the same URL — protects against
 * breaking a shared reference. Best-effort: a storage-delete failure never
 * blocks the ProductImage row delete itself.
 */
export async function deleteBlobIfUnreferenced(url: string, excludeImageId?: string) {
  if (!isBlobStorageUrl(url) || !isBlobConfigured()) return;

  const stillReferenced = await prisma.productImage.findFirst({
    where: { url, ...(excludeImageId ? { id: { not: excludeImageId } } : {}) },
  });
  if (stillReferenced) return;

  try {
    await del(url);
  } catch (err) {
    console.error("[image-storage] failed to delete blob (non-fatal):", err);
  }
}
