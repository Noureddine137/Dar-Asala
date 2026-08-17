"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function CustomOrderForm({ productNames = [] }: { productNames?: string[] }) {
  const t = useTranslations("forms");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const FIELDS = [
    { name: "leatherColor", label: t("leatherColor"), placeholder: t("leatherColorPlaceholder") },
    { name: "dimensions", label: t("dimensions"), placeholder: t("dimensionsPlaceholder") },
    { name: "strapLength", label: t("strapLength"), placeholder: t("strapLengthPlaceholder") },
    { name: "initials", label: t("initials"), placeholder: t("initialsPlaceholder") },
    { name: "lining", label: t("lining"), placeholder: t("liningPlaceholder") },
    { name: "hardware", label: t("hardware"), placeholder: t("hardwarePlaceholder") },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? t("genericError"));
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : t("genericError"));
    }
  }

  if (status === "success") {
    return <p className="rounded-sm bg-cream p-6 text-sm text-charcoal">{t("customOrderSuccess")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            required
            className="w-full border-b border-sand bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border-b border-sand bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            {t("phoneWhatsapp")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder={t("phoneOptional")}
            className="w-full border-b border-sand bg-transparent py-2 text-sm text-charcoal placeholder:text-muted/60 focus:border-charcoal focus:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor="requestedProductName"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted"
          >
            {t("startingFromProduct")}
          </label>
          <input
            id="requestedProductName"
            name="requestedProductName"
            list="custom-order-products"
            placeholder={t("startingFromProductPlaceholder")}
            className="w-full border-b border-sand bg-transparent py-2 text-sm text-charcoal placeholder:text-muted/60 focus:border-charcoal focus:outline-none"
          />
          {productNames.length > 0 && (
            <datalist id="custom-order-products">
              {productNames.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
              {f.label}
            </label>
            <input
              id={f.name}
              name={f.name}
              placeholder={f.placeholder}
              className="w-full border-b border-sand bg-transparent py-2 text-sm text-charcoal placeholder:text-muted/60 focus:border-charcoal focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          {t("tellUsAboutPiece")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full border-b border-sand bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      </div>

      {status === "error" && <p className="text-xs text-terracotta">{error}</p>}
      <Button type="submit" size="lg" disabled={status === "loading"}>
        {status === "loading" ? t("sending") : t("submitRequest")}
      </Button>
    </form>
  );
}
