export function formatPrice(amount: number | string, currency = "EUR") {
  const value = typeof amount === "string" ? Number(amount) : amount;
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

const COLOR_LABELS: Record<string, string> = {
  COGNAC: "Cognac",
  DARK_BROWN: "Dark Brown",
  BLACK: "Black",
  OLIVE: "Olive",
  NATURAL: "Natural",
};

const SIZE_LABELS: Record<string, string> = {
  MINI: "Mini",
  MEDIUM: "Medium",
  LARGE: "Large",
};

const HARDWARE_LABELS: Record<string, string> = {
  BRASS: "Brass",
  ANTIQUE_BRASS: "Antique Brass",
};

const STRAP_LABELS: Record<string, string> = {
  STANDARD: "Standard",
  LONG: "Long",
  ADJUSTABLE: "Adjustable",
};

export function colorLabel(value: string) {
  return COLOR_LABELS[value] ?? value;
}
export function sizeLabel(value: string) {
  return SIZE_LABELS[value] ?? value;
}
export function hardwareLabel(value: string) {
  return HARDWARE_LABELS[value] ?? value;
}
export function strapLabel(value: string) {
  return STRAP_LABELS[value] ?? value;
}

const SWATCH_HEX: Record<string, string> = {
  COGNAC: "#B4865E",
  DARK_BROWN: "#5A3A24",
  BLACK: "#27231F",
  OLIVE: "#4E5741",
  NATURAL: "#DCCCB7",
};

export function colorSwatchHex(value: string) {
  return SWATCH_HEX[value] ?? "#81766A";
}
