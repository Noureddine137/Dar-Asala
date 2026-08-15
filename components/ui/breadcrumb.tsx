import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function Breadcrumb({
  items,
  light = false,
}: {
  items: { label: string; href?: string }[];
  light?: boolean;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex flex-wrap items-center gap-1.5 text-xs", light ? "text-ivory/70" : "text-muted")}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {item.href ? (
            <Link href={item.href} className={cn("hover:underline", light ? "hover:text-ivory" : "hover:text-charcoal")}>
              {item.label}
            </Link>
          ) : (
            <span className={light ? "text-ivory" : "text-charcoal"}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
