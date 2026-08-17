// Hrefs are locale-independent path segments — product/collection slugs stay
// stable across languages (see checkpoint note on SEO-safe slugs), so no
// per-locale mapping is needed here. Labels are translation keys resolved at
// render time via useTranslations("nav") / useTranslations("footer"), not
// literal English strings, so header/footer/mobile-menu render in the
// active locale.
export type NavLink = { labelKey: string; href: string };

export const SHOP_LINKS: NavLink[] = [
  { labelKey: "allBags", href: "/collections/all" },
  { labelKey: "newArrivals", href: "/collections/new-arrivals" },
  { labelKey: "bestSellers", href: "/collections/best-sellers" },
  { labelKey: "handbags", href: "/collections/handbags" },
  { labelKey: "shoulderBags", href: "/collections/shoulder-bags" },
  { labelKey: "crossbodyBags", href: "/collections/crossbody-bags" },
  { labelKey: "toteBags", href: "/collections/tote-bags" },
  { labelKey: "miniBags", href: "/collections/mini-bags" },
  { labelKey: "leatherAccessories", href: "/collections/leather-accessories" },
  { labelKey: "customOrders", href: "/custom-orders" },
];

export const BRAND_LINKS: NavLink[] = [
  { labelKey: "ourStory", href: "/about" },
  { labelKey: "craftsmanship", href: "/about/craftsmanship" },
  { labelKey: "artisans", href: "/artisans" },
  { labelKey: "materials", href: "/about/materials" },
  { labelKey: "journal", href: "/journal" },
];

export const HELP_LINKS: NavLink[] = [
  { labelKey: "shipping", href: "/shipping" },
  { labelKey: "returns", href: "/returns" },
  { labelKey: "faq", href: "/faq" },
  { labelKey: "contact", href: "/contact" },
];

export const HEADER_PRIMARY_LINKS: NavLink[] = [
  { labelKey: "allBags", href: "/collections/all" },
  { labelKey: "handbags", href: "/collections/handbags" },
  { labelKey: "shoulderBags", href: "/collections/shoulder-bags" },
  { labelKey: "crossbody", href: "/collections/crossbody-bags" },
  { labelKey: "totes", href: "/collections/tote-bags" },
  { labelKey: "ourStory", href: "/about" },
];

// headingKey resolves against the "footer" namespace; each link's labelKey
// resolves against "nav" (the same labels used in the header/drawer).
export const FOOTER_COLUMNS: { headingKey: string; links: NavLink[] }[] = [
  {
    headingKey: "shop",
    links: [
      { labelKey: "allBags", href: "/collections/all" },
      { labelKey: "newArrivals", href: "/collections/new-arrivals" },
      { labelKey: "bestSellers", href: "/collections/best-sellers" },
      { labelKey: "handbags", href: "/collections/handbags" },
      { labelKey: "crossbody", href: "/collections/crossbody-bags" },
      { labelKey: "toteBags", href: "/collections/tote-bags" },
    ],
  },
  {
    headingKey: "ourWorld",
    links: [
      { labelKey: "ourStory", href: "/about" },
      { labelKey: "craftsmanship", href: "/about/craftsmanship" },
      { labelKey: "artisans", href: "/artisans" },
      { labelKey: "materials", href: "/about/materials" },
      { labelKey: "journal", href: "/journal" },
    ],
  },
  {
    headingKey: "help",
    links: [
      { labelKey: "faq", href: "/faq" },
      { labelKey: "shipping", href: "/shipping" },
      { labelKey: "returns", href: "/returns" },
      { labelKey: "contact", href: "/contact" },
      { labelKey: "careGuide", href: "/about/materials" },
    ],
  },
];

// labelKey resolves against the "footer" namespace (terms/privacy/imprint/cookies).
export const LEGAL_LINKS: NavLink[] = [
  { labelKey: "terms", href: "/legal/terms" },
  { labelKey: "privacy", href: "/legal/privacy" },
  { labelKey: "imprint", href: "/legal/imprint" },
  { labelKey: "cookies", href: "/legal/cookies" },
];
