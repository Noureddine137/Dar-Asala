"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center text-charcoal">
      <p className="font-serif-display text-2xl">Something went wrong</p>
      <p className="max-w-sm text-sm text-muted">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
