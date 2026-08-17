"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-sm border border-terracotta/40 bg-terracotta/10 p-6 text-sm text-charcoal">
      <p className="font-medium text-terracotta">Something went wrong.</p>
      <p className="mt-1 text-charcoal/80">{error.message || "The action could not be completed."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-sm bg-charcoal px-4 py-2 text-xs text-ivory"
      >
        Try Again
      </button>
    </div>
  );
}
