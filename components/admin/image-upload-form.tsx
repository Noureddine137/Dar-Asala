"use client";

import { useEffect, useRef, useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { PRODUCT_IMAGE_KINDS } from "@/lib/admin/constants";
import { uploadProductImage } from "@/lib/admin/actions";

// Mirrors lib/admin/image-storage.ts — kept as plain client-side literals
// (that module is server-only) so this file stays importable from the
// browser bundle. The server always re-validates independently; these are
// UX hints only.
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function ImageUploadForm({ productId }: { productId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setServerError(null);
    if (preview) URL.revokeObjectURL(preview);

    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setClientError(null);
      return;
    }
    if (file.type === "image/heic" || file.type === "image/heif") {
      setClientError("HEIC/HEIF photos aren't supported — export as JPEG (iPhone: Settings → Camera → Formats → Most Compatible) and upload again.");
      setPreview(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setClientError(`Unsupported file type "${file.type || "unknown"}". Please choose a JPEG, PNG or WebP image.`);
      setPreview(null);
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setClientError(`Image is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum is ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB.`);
      setPreview(null);
      return;
    }
    setClientError(null);
    setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (clientError) return;
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await uploadProductImage(productId, formData);
        formRef.current?.reset();
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setServerError(null);
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-4">
      <div className="flex items-start gap-3 sm:col-span-4">
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element -- local blob preview before upload, not a storefront asset
          <img src={preview} alt="" className="h-20 w-20 shrink-0 rounded-sm object-cover" />
        )}
        <div className="flex-1">
          <input
            type="file"
            name="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            required
            className="input"
          />
          <p className="mt-1 text-[11px] text-muted">JPEG, PNG or WebP, up to 10MB.</p>
          {clientError && <p className="mt-1 text-xs text-terracotta">{clientError}</p>}
        </div>
      </div>
      <input name="alt" placeholder="Alt text" required className="input sm:col-span-2" />
      <select name="kind" defaultValue="front" className="input">
        {PRODUCT_IMAGE_KINDS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending || !!clientError}
        className="rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory disabled:opacity-50"
      >
        {pending ? "Uploading…" : "Upload Image"}
      </button>
      {serverError && <p className="text-xs text-terracotta sm:col-span-4">{serverError}</p>}
    </form>
  );
}
