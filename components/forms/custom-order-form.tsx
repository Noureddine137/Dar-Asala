"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const FIELDS = [
  { name: "leatherColor", label: "Preferred Leather Color", placeholder: "e.g. Cognac" },
  { name: "dimensions", label: "Dimensions", placeholder: "e.g. 30 x 22 x 10 cm" },
  { name: "strapLength", label: "Strap Length", placeholder: "e.g. Adjustable, 60–120cm" },
  { name: "initials", label: "Monogram Initials", placeholder: "e.g. A.B." },
  { name: "lining", label: "Interior Lining", placeholder: "e.g. Natural cotton twill" },
  { name: "hardware", label: "Hardware Finish", placeholder: "e.g. Antique brass" },
];

export function CustomOrderForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

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
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <p className="rounded-sm bg-cream p-6 text-sm text-charcoal">
        Thank you — your custom order request has been received. An atelier specialist will follow
        up by email within 2–3 business days to discuss options and pricing.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
            Name
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
            Email
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

      <div className="grid gap-5 sm:grid-cols-2">
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
          Tell us about the piece you have in mind
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
        {status === "loading" ? "Sending…" : "Submit Request"}
      </Button>
    </form>
  );
}
