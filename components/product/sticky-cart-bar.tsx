"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils/format";
import { Button } from "@/components/ui/button";

export function StickyMobileCartBar({ price, currency }: { price: number; currency: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const target = document.getElementById("purchase-panel");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function scrollToPanel() {
    document.getElementById("purchase-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (!show) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-sand bg-ivory/95 px-4 py-3 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <span className="text-base font-medium text-charcoal">{formatPrice(price, currency)}</span>
      <Button onClick={scrollToPanel} size="md">
        Add to Cart
      </Button>
    </div>
  );
}
