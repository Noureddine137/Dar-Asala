import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileMenu } from "@/components/navigation/mobile-menu";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchOverlay } from "@/components/navigation/search-overlay";
import { CookieConsent } from "@/components/analytics/cookie-consent";
import { AnalyticsScripts } from "@/components/analytics/analytics-scripts";
import { getStoreSettings } from "@/lib/content/store-settings";

export default async function StorefrontLayout({ children }: { children: ReactNode }) {
  const settings = await getStoreSettings();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory"
      >
        Skip to content
      </a>
      <Header />
      <MobileMenu instagramUrl={settings.instagramUrl} facebookUrl={settings.facebookUrl} tiktokUrl={settings.tiktokUrl} />
      <SearchOverlay />
      <CartDrawer />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <AnalyticsScripts />
    </>
  );
}
