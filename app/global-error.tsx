"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#FBF8F2] px-6 text-center text-[#27231F]">
        <p style={{ fontSize: "1.5rem" }}>Something went wrong</p>
        <p style={{ maxWidth: "24rem", fontSize: "0.875rem", color: "#81766A" }}>
          We hit an unexpected error loading Dar Asala. Please try again.
        </p>
        <button
          onClick={reset}
          style={{ background: "#27231F", color: "#FBF8F2", padding: "0.75rem 1.5rem", borderRadius: "2px" }}
        >
          Try Again
        </button>
      </body>
    </html>
  );
}
