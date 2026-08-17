"use client";

import { useState, type FormEvent } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }
      setStatus("success");
      setMessage("You’re on the list. Welcome to the atelier.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return <p className={cn("text-sm", compact ? "text-charcoal" : "text-ivory")}>{message}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className={cn("flex items-stretch gap-2", compact ? "" : "sm:max-w-md")}>
        <label htmlFor={compact ? "newsletter-footer" : "newsletter-home"} className="sr-only">
          Email address
        </label>
        <input
          id={compact ? "newsletter-footer" : "newsletter-home"}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className={cn(
            "min-w-0 flex-1 border-b bg-transparent px-1 py-2 text-sm placeholder:text-current/50 focus:outline-none",
            compact ? "border-charcoal/30 text-charcoal" : "border-ivory/40 text-ivory"
          )}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={cn(
            "shrink-0 border-b px-3 text-sm font-medium uppercase tracking-wide transition-opacity disabled:opacity-50",
            compact ? "border-charcoal text-charcoal" : "border-ivory text-ivory"
          )}
        >
          Join
        </button>
      </div>
      {status === "error" && <p className="text-xs text-terracotta">{message}</p>}
      <p className={cn("text-xs", compact ? "text-muted" : "text-ivory/70")}>
        By signing up you agree to receive marketing emails. Unsubscribe anytime. See our{" "}
        <Link href="/legal/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
