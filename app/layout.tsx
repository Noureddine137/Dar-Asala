import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dar Asala — Handcrafted Moroccan Leather Bags",
    template: "%s | Dar Asala",
  },
  description:
    "Dar Asala crafts small-batch, handmade leather bags for women, shaped by Moroccan artisanship in genuine full-grain leather.",
  openGraph: {
    title: "Dar Asala — Handcrafted Moroccan Leather Bags",
    description:
      "Small-batch, handmade leather bags for women, shaped by Moroccan artisanship.",
    url: siteUrl,
    siteName: "Dar Asala",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-charcoal">{children}</body>
    </html>
  );
}
