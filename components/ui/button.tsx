import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-charcoal";

const variants = {
  primary: "bg-charcoal text-ivory hover:bg-leather",
  secondary: "bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory",
  ghost: "bg-transparent text-charcoal hover:bg-sand/40",
  light: "bg-ivory text-charcoal hover:bg-cream",
};

const sizes = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6",
  lg: "h-14 px-8 text-base",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

type CommonProps = {
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
