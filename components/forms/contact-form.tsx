"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
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
        Thank you — your message has been received. We typically reply within 1–2 business days.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
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
      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full border-b border-sand bg-transparent py-2 text-sm text-charcoal focus:border-charcoal focus:outline-none"
        />
      </div>
      {status === "error" && <p className="text-xs text-terracotta">{error}</p>}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
