export type LegalPage = {
  slug: string;
  title: string;
  sections: { heading: string; body: string[] }[];
};

const DISCLAIMER =
  "This is placeholder legal content generated for development purposes. It must be reviewed and finalized by a qualified legal professional, specific to your business entity and target markets, before this site goes live.";

export const LEGAL_PAGES: Record<string, LegalPage> = {
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    sections: [
      { heading: "Legal Review Notice", body: [DISCLAIMER] },
      {
        heading: "1. Acceptance of Terms",
        body: [
          "By accessing or placing an order through this website, you agree to be bound by these Terms & Conditions.",
        ],
      },
      {
        heading: "2. Products",
        body: [
          "All products are handmade and produced in small batches; minor variations in leather grain, color and stitching are natural characteristics of handmade goods, not defects.",
        ],
      },
      {
        heading: "3. Pricing & Payment",
        body: [
          "All prices are listed in EUR and include applicable VAT unless stated otherwise. Payment is processed securely through Stripe at checkout.",
        ],
      },
      {
        heading: "4. Governing Law",
        body: ["These terms are governed by the laws of the jurisdiction in which Dar Asala is registered."],
      },
    ],
  },
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    sections: [
      { heading: "Legal Review Notice", body: [DISCLAIMER] },
      {
        heading: "1. Data We Collect",
        body: [
          "We collect information you provide directly — such as your name, email and shipping address — as well as order and browsing data necessary to operate the store.",
        ],
      },
      {
        heading: "2. How We Use Your Data",
        body: [
          "Your data is used to process orders, provide customer support, and — with your consent — send marketing communications. We do not sell your personal data.",
        ],
      },
      {
        heading: "3. Your Rights (GDPR)",
        body: [
          "If you are located in the EU/EEA, you have the right to access, correct, delete, or export your personal data, and to withdraw consent at any time by contacting hello@darasala.example.",
        ],
      },
      {
        heading: "4. Cookies",
        body: ["See our Cookie Policy for details on the cookies used on this site."],
      },
    ],
  },
  imprint: {
    slug: "imprint",
    title: "Imprint",
    sections: [
      { heading: "Legal Review Notice", body: [DISCLAIMER] },
      {
        heading: "Company Information",
        body: [
          "Dar Asala [Legal entity name to be added]",
          "[Registered address to be added]",
          "[Commercial register number to be added]",
          "[VAT ID to be added]",
        ],
      },
      {
        heading: "Contact",
        body: ["Email: hello@darasala.example"],
      },
    ],
  },
  cookies: {
    slug: "cookies",
    title: "Cookie Policy",
    sections: [
      { heading: "Legal Review Notice", body: [DISCLAIMER] },
      {
        heading: "1. Essential Cookies",
        body: [
          "These cookies are required for core functionality — such as keeping items in your cart — and cannot be disabled.",
        ],
      },
      {
        heading: "2. Analytics & Marketing Cookies",
        body: [
          "Non-essential analytics (e.g. Google Analytics) and marketing pixels (e.g. Meta Pixel, TikTok Pixel) are only loaded after you provide consent via our cookie banner, and remain disabled by default.",
        ],
      },
      {
        heading: "3. Managing Preferences",
        body: ["You can change your cookie preferences at any time using the link in our footer."],
      },
    ],
  },
};
