import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

// Exported so components/ui/button-link.tsx (the locale-aware storefront
// variant) can share the exact same look without duplicating the styles.
export const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal";

export const variants = {
  primary: "bg-charcoal text-ivory hover:bg-leather",
  secondary: "bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory",
  ghost: "bg-transparent text-charcoal hover:bg-sand/40",
  light: "bg-ivory text-charcoal hover:bg-cream",
};

export const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6",
  lg: "h-14 px-8 text-base",
};

export type Variant = keyof typeof variants;
export type Size = keyof typeof sizes;

export type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

// Plain next/link — for the admin dashboard and the global not-found page,
// neither of which is localized and neither of which renders inside the
// NextIntlClientProvider a locale-aware Link needs. Storefront components
// should use the locale-aware ButtonLink from "@/components/ui/button-link"
// instead, so language switching preserves the current page.
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
