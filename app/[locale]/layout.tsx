import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Playfair_Display, Inter } from "next/font/google";
import { routing, type Locale } from "@/i18n/routing";
import { OG_LOCALES } from "@/lib/utils/seo";
import "../globals.css";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (hasLocale(routing.locales, locale) ? locale : routing.defaultLocale) as Locale;
  const t = await getTranslations({ locale: safeLocale, namespace: "seo" });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: t("siteTitle"),
      template: "%s | Dar Asala",
    },
    description: t("siteDescription"),
    openGraph: {
      title: t("siteTitle"),
      description: t("ogDescription"),
      url: `${siteUrl}/${safeLocale}`,
      siteName: "Dar Asala",
      locale: OG_LOCALES[safeLocale],
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale subtree.
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
