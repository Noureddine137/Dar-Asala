import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { base, variants, sizes, type CommonProps } from "@/components/ui/button";

// Locale-aware ButtonLink for the storefront: same look as
// components/ui/button.tsx's ButtonLink, but built on next-intl's Link so
// the current locale prefix is preserved automatically.
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: CommonProps & Omit<ComponentProps<typeof Link>, "href" | "className" | "children"> & {
  href: ComponentProps<typeof Link>["href"];
}) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
