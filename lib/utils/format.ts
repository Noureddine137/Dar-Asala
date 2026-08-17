import { INTL_LOCALE_TAGS, DEFAULT_LOCALE, type Locale } from "@/i18n/routing";

export function formatPrice(amount: number | string, currency = "EUR", locale: Locale = DEFAULT_LOCALE) {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat(INTL_LOCALE_TAGS[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

const COLOR_LABELS: Record<Locale, Record<string, string>> = {
  en: { COGNAC: "Cognac", DARK_BROWN: "Dark Brown", BLACK: "Black", OLIVE: "Olive", NATURAL: "Natural" },
  de: { COGNAC: "Cognac", DARK_BROWN: "Dunkelbraun", BLACK: "Schwarz", OLIVE: "Oliv", NATURAL: "Natur" },
  fr: { COGNAC: "Cognac", DARK_BROWN: "Brun foncé", BLACK: "Noir", OLIVE: "Olive", NATURAL: "Naturel" },
};

const SIZE_LABELS: Record<Locale, Record<string, string>> = {
  en: { MINI: "Mini", MEDIUM: "Medium", LARGE: "Large" },
  de: { MINI: "Mini", MEDIUM: "Medium", LARGE: "Groß" },
  fr: { MINI: "Mini", MEDIUM: "Moyen", LARGE: "Grand" },
};

const HARDWARE_LABELS: Record<Locale, Record<string, string>> = {
  en: { BRASS: "Brass", ANTIQUE_BRASS: "Antique Brass" },
  de: { BRASS: "Messing", ANTIQUE_BRASS: "Antikmessing" },
  fr: { BRASS: "Laiton", ANTIQUE_BRASS: "Laiton vieilli" },
};

const STRAP_LABELS: Record<Locale, Record<string, string>> = {
  en: { STANDARD: "Standard", LONG: "Long / Crossbody", ADJUSTABLE: "Adjustable" },
  de: { STANDARD: "Standard", LONG: "Lang / Umhänge", ADJUSTABLE: "Verstellbar" },
  fr: { STANDARD: "Standard", LONG: "Long / Bandoulière", ADJUSTABLE: "Réglable" },
};

export function colorLabel(value: string, locale: Locale = DEFAULT_LOCALE) {
  return COLOR_LABELS[locale][value] ?? value;
}
export function sizeLabel(value: string, locale: Locale = DEFAULT_LOCALE) {
  return SIZE_LABELS[locale][value] ?? value;
}
export function hardwareLabel(value: string, locale: Locale = DEFAULT_LOCALE) {
  return HARDWARE_LABELS[locale][value] ?? value;
}
export function strapLabel(value: string, locale: Locale = DEFAULT_LOCALE) {
  return STRAP_LABELS[locale][value] ?? value;
}

const SWATCH_HEX: Record<string, string> = {
  COGNAC: "#B98B67",
  DARK_BROWN: "#5A3A24",
  BLACK: "#2C2A26",
  OLIVE: "#4E5741",
  NATURAL: "#D6C6AD",
};

export function colorSwatchHex(value: string) {
  return SWATCH_HEX[value] ?? "#7A6F62";
}
