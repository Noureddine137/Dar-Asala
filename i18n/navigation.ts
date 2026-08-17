import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware drop-ins for next/link, next/navigation's redirect/useRouter/
// usePathname — Link automatically prefixes the current locale and
// usePathname strips it, so components never need to manually prepend
// `/${locale}` to preserve the current page when switching languages.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
