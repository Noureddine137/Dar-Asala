export type NavLink = { label: string; href: string };

export const SHOP_LINKS: NavLink[] = [
  { label: "All Bags", href: "/collections/all" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Best Sellers", href: "/collections/best-sellers" },
  { label: "Handbags", href: "/collections/handbags" },
  { label: "Shoulder Bags", href: "/collections/shoulder-bags" },
  { label: "Crossbody Bags", href: "/collections/crossbody-bags" },
  { label: "Tote Bags", href: "/collections/tote-bags" },
  { label: "Mini Bags", href: "/collections/mini-bags" },
  { label: "Leather Accessories", href: "/collections/leather-accessories" },
];

export const BRAND_LINKS: NavLink[] = [
  { label: "Our Story", href: "/about" },
  { label: "Craftsmanship", href: "/about/craftsmanship" },
  { label: "Artisans", href: "/artisans" },
  { label: "Materials", href: "/about/materials" },
  { label: "Journal", href: "/journal" },
];

export const HELP_LINKS: NavLink[] = [
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const HEADER_PRIMARY_LINKS: NavLink[] = [
  { label: "All Bags", href: "/collections/all" },
  { label: "Handbags", href: "/collections/handbags" },
  { label: "Shoulder Bags", href: "/collections/shoulder-bags" },
  { label: "Crossbody", href: "/collections/crossbody-bags" },
  { label: "Totes", href: "/collections/tote-bags" },
  { label: "Our Story", href: "/about" },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "All Bags", href: "/collections/all" },
      { label: "New Arrivals", href: "/collections/new-arrivals" },
      { label: "Best Sellers", href: "/collections/best-sellers" },
      { label: "Handbags", href: "/collections/handbags" },
      { label: "Crossbody", href: "/collections/crossbody-bags" },
      { label: "Tote Bags", href: "/collections/tote-bags" },
    ],
  },
  {
    heading: "Our World",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Craftsmanship", href: "/about/craftsmanship" },
      { label: "Artisans", href: "/artisans" },
      { label: "Materials", href: "/about/materials" },
      { label: "Journal", href: "/journal" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Contact", href: "/contact" },
      { label: "Care Guide", href: "/about/materials" },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Imprint", href: "/legal/imprint" },
  { label: "Cookies", href: "/legal/cookies" },
];
