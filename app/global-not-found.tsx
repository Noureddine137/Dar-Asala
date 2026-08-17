// Escape hatch for the "multiple root layouts" setup (see next.config.ts's
// experimental.globalNotFound comment): this is the only UI shown for URLs
// that don't match any route at all — before locale routing even runs — so
// it must be a fully self-contained document with no locale/translation
// dependency, in English (the source locale) as a safe universal fallback.
import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page not found | Dar Asala",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream text-charcoal">
        <div className="container-page flex min-h-full flex-col items-center justify-center gap-4 py-32 text-center">
          <p className="font-serif-display text-7xl text-camel">404</p>
          <h1 className="font-serif-display text-2xl text-charcoal">Page not found</h1>
          <p className="max-w-sm text-sm text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.</p>
          <Link
            href="/en"
            className="mt-2 inline-flex h-11 items-center justify-center rounded-sm bg-charcoal px-6 text-sm font-medium tracking-wide text-ivory transition-colors hover:bg-leather"
          >
            Back to Homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
