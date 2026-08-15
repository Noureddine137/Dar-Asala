// Generates the placeholder editorial art direction used across the storefront.
// These are original abstract/gradient compositions (arch motifs, bag silhouettes,
// leather-grain textures) — not photography — standing in until real product and
// lifestyle photography is shot. Run with: node scripts/generate-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images");

const PALETTE = {
  cream: "#F6F0E7",
  ivory: "#FBF8F2",
  sand: "#DCCCB7",
  camel: "#B4865E",
  leather: "#8B5E3C",
  terracotta: "#A95F43",
  olive: "#4E5741",
  forest: "#25352B",
  charcoal: "#27231F",
  brass: "#A78B57",
  muted: "#81766A",
};

function grainFilter(id, opacity = 0.05) {
  return `
  <filter id="${id}">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0"/>
  </filter>`;
}

function archPath(x, y, w, h) {
  const r = w / 2;
  return `M ${x} ${y + h} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
}

function bagSilhouette(cx, cy, scale, bodyColor, accentColor) {
  const w = 220 * scale;
  const h = 190 * scale;
  const x = cx - w / 2;
  const y = cy - h / 2;
  const strapR = w * 0.62;
  return `
  <g>
    <path d="M ${cx - strapR} ${y + 18 * scale}
             A ${strapR} ${strapR * 1.3} 0 0 1 ${cx + strapR} ${y + 18 * scale}"
          fill="none" stroke="${accentColor}" stroke-width="${9 * scale}" stroke-linecap="round" opacity="0.85"/>
    <rect x="${x}" y="${y + 40 * scale}" width="${w}" height="${h}" rx="${22 * scale}" fill="${bodyColor}"/>
    <path d="M ${x} ${y + 78 * scale} Q ${cx} ${y + 40 * scale} ${x + w} ${y + 78 * scale}"
          fill="none" stroke="${accentColor}" stroke-width="${3 * scale}" opacity="0.5"/>
    <circle cx="${cx}" cy="${y + 92 * scale}" r="${7 * scale}" fill="${accentColor}"/>
    <rect x="${x + 10 * scale}" y="${y + h - 46 * scale}" width="${w - 20 * scale}" height="${3 * scale}" fill="${accentColor}" opacity="0.35"/>
    <rect x="${x + 10 * scale}" y="${y + h - 30 * scale}" width="${w - 20 * scale}" height="${3 * scale}" fill="${accentColor}" opacity="0.25"/>
  </g>`;
}

function stitchLines(x, y, w, h, color, count = 6) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const yy = y + (h / count) * i;
    out += `<line x1="${x}" y1="${yy}" x2="${x + w}" y2="${yy}" stroke="${color}" stroke-width="1.5" stroke-dasharray="6 6" opacity="0.35"/>`;
  }
  return out;
}

function svgDoc(width, height, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${inner}</svg>`;
}

function vignette(width, height, color = "#000000", opacity = 0.18) {
  return `
  <defs>
    <radialGradient id="vig" cx="50%" cy="42%" r="75%">
      <stop offset="60%" stop-color="${color}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="${opacity}"/>
    </radialGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#vig)"/>`;
}

async function render(name, width, height, svg) {
  const full = svgDoc(width, height, svg);
  const outPath = path.join(ROOT, name);
  await mkdir(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(full))
    .webp({ quality: 82 })
    .toFile(outPath.endsWith(".webp") ? outPath : `${outPath}.webp`);
}

function sceneBackground(id, from, to, angle = 135) {
  return `
  <linearGradient id="${id}" gradientTransform="rotate(${angle})">
    <stop offset="0%" stop-color="${from}"/>
    <stop offset="100%" stop-color="${to}"/>
  </linearGradient>`;
}

// ---------------------------------------------------------------------------
// 1. Hero
// ---------------------------------------------------------------------------
async function heroImage() {
  const w = 2000, h = 2500;
  const svg = `
  <defs>
    ${sceneBackground("bg", PALETTE.forest, PALETTE.charcoal)}
    ${grainFilter("g1", 0.05)}
    <radialGradient id="glow" cx="72%" cy="18%" r="45%">
      <stop offset="0%" stop-color="${PALETTE.camel}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${PALETTE.camel}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <path d="${archPath(w * 0.52, h * 0.08, w * 0.4, h * 0.62)}" fill="${PALETTE.charcoal}" opacity="0.55"/>
  <path d="${archPath(w * 0.56, h * 0.14, w * 0.32, h * 0.5)}" fill="${PALETTE.sand}" opacity="0.12"/>
  ${bagSilhouette(w * 0.32, h * 0.74, 3.4, PALETTE.leather, PALETTE.brass)}
  <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.6"/>
  ${vignette(w, h, "#000000", 0.32)}`;
  await render("hero/hero-main.webp", w, h, svg);
}

// ---------------------------------------------------------------------------
// 2. Categories
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { slug: "handbags", from: PALETTE.sand, to: PALETTE.camel, body: PALETTE.leather, scale: 2.6 },
  { slug: "shoulder-bags", from: PALETTE.cream, to: PALETTE.sand, body: PALETTE.olive, scale: 2.3 },
  { slug: "crossbody-bags", from: PALETTE.ivory, to: PALETTE.sand, body: PALETTE.terracotta, scale: 2.0 },
  { slug: "tote-bags", from: PALETTE.sand, to: PALETTE.muted, body: PALETTE.leather, scale: 3.0 },
  { slug: "mini-bags", from: PALETTE.cream, to: PALETTE.camel, body: PALETTE.camel, scale: 1.7 },
  { slug: "leather-accessories", from: PALETTE.ivory, to: PALETTE.sand, body: PALETTE.brass, scale: 1.3 },
];

async function categoryImages() {
  const w = 1000, h = 1250;
  for (const c of CATEGORIES) {
    const svg = `
    <defs>
      ${sceneBackground("bg", c.from, c.to)}
      ${grainFilter("g1", 0.04)}
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${bagSilhouette(w * 0.5, h * 0.56, c.scale, c.body, PALETTE.charcoal)}
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
    ${vignette(w, h, "#000000", 0.16)}`;
    await render(`categories/${c.slug}.webp`, w, h, svg);
  }
}

// ---------------------------------------------------------------------------
// 3. Products
// ---------------------------------------------------------------------------
const COLOR_HEX = {
  cognac: PALETTE.camel,
  "dark-brown": PALETTE.leather,
  black: PALETTE.charcoal,
  olive: PALETTE.olive,
  natural: PALETTE.sand,
};

export const PRODUCT_SLUGS = [
  { slug: "lalla-leather-bag", color: "cognac", scale: 2.6 },
  { slug: "zahra-tote", color: "dark-brown", scale: 3.1 },
  { slug: "atlas-crossbody", color: "black", scale: 1.9 },
  { slug: "medina-mini-bag", color: "natural", scale: 1.5 },
  { slug: "riad-shoulder-bag", color: "olive", scale: 2.3 },
  { slug: "noor-bucket-bag", color: "cognac", scale: 2.2 },
  { slug: "essaouira-tote", color: "natural", scale: 3.0 },
  { slug: "amira-bag", color: "dark-brown", scale: 2.5 },
  { slug: "bahia-shoulder-bag", color: "black", scale: 2.2 },
  { slug: "safi-crossbody", color: "olive", scale: 1.9 },
  { slug: "kasbah-tote", color: "cognac", scale: 3.1 },
  { slug: "yasmine-mini", color: "dark-brown", scale: 1.5 },
];

async function productImages() {
  const w = 1200, h = 1500;
  for (const p of PRODUCT_SLUGS) {
    const body = COLOR_HEX[p.color];
    const front = `
      <defs>${sceneBackground("bg", PALETTE.ivory, PALETTE.cream, 100)}${grainFilter("g1", 0.035)}</defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      ${bagSilhouette(w * 0.5, h * 0.52, p.scale, body, PALETTE.brass)}
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
      ${vignette(w, h, "#000000", 0.12)}`;
    await render(`products/${p.slug}-front.webp`, w, h, front);

    const side = `
      <defs>${sceneBackground("bg", PALETTE.cream, PALETTE.sand, 60)}${grainFilter("g1", 0.035)}</defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      <g transform="translate(${w * 0.06},0) scale(0.92,1)">${bagSilhouette(w * 0.5, h * 0.52, p.scale * 0.95, body, PALETTE.brass)}</g>
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
      ${vignette(w, h, "#000000", 0.12)}`;
    await render(`products/${p.slug}-side.webp`, w, h, side);

    const detail = `
      <defs>${sceneBackground("bg", body, PALETTE.charcoal, 140)}${grainFilter("g1", 0.09)}</defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      ${stitchLines(w * 0.15, h * 0.3, w * 0.7, h * 0.4, PALETTE.brass, 8)}
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.7"/>
      ${vignette(w, h, "#000000", 0.28)}`;
    await render(`products/${p.slug}-detail.webp`, w, h, detail);

    const lifestyle = `
      <defs>${sceneBackground("bg", PALETTE.terracotta, PALETTE.charcoal, 120)}${grainFilter("g1", 0.05)}
        <radialGradient id="glow" cx="70%" cy="15%" r="50%"><stop offset="0%" stop-color="${PALETTE.brass}" stop-opacity="0.45"/><stop offset="100%" stop-color="${PALETTE.brass}" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#bg)"/>
      <rect width="${w}" height="${h}" fill="url(#glow)"/>
      <path d="${archPath(w * 0.58, h * 0.05, w * 0.36, h * 0.55)}" fill="${PALETTE.charcoal}" opacity="0.4"/>
      ${bagSilhouette(w * 0.36, h * 0.72, p.scale * 0.85, body, PALETTE.brass)}
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.55"/>
      ${vignette(w, h, "#000000", 0.3)}`;
    await render(`products/${p.slug}-lifestyle.webp`, w, h, lifestyle);
  }
}

async function collectionBanners() {
  const w = 1920, h = 640;
  const banners = [
    { slug: "handbags", from: PALETTE.sand, to: PALETTE.camel, body: PALETTE.leather, scale: 3.2 },
    { slug: "shoulder-bags", from: PALETTE.cream, to: PALETTE.sand, body: PALETTE.olive, scale: 2.8 },
    { slug: "crossbody-bags", from: PALETTE.ivory, to: PALETTE.sand, body: PALETTE.terracotta, scale: 2.4 },
    { slug: "tote-bags", from: PALETTE.sand, to: PALETTE.muted, body: PALETTE.leather, scale: 3.6 },
    { slug: "mini-bags", from: PALETTE.cream, to: PALETTE.camel, body: PALETTE.camel, scale: 2.0 },
    { slug: "leather-accessories", from: PALETTE.ivory, to: PALETTE.sand, body: PALETTE.brass, scale: 1.6 },
    { slug: "all", from: PALETTE.forest, to: PALETTE.charcoal, body: PALETTE.leather, scale: 3.2, arch: true },
    { slug: "new-arrivals", from: PALETTE.terracotta, to: PALETTE.charcoal, body: PALETTE.camel, scale: 3.0, arch: true },
    { slug: "best-sellers", from: PALETTE.olive, to: PALETTE.forest, body: PALETTE.camel, scale: 3.0, arch: true },
  ];
  for (const b of banners) {
    const svg = `
    <defs>${sceneBackground("bg", b.from, b.to, 100)}${grainFilter("g1", 0.045)}</defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${b.arch ? `<path d="${archPath(w * 0.7, h * -0.5, w * 0.34, h * 1.7)}" fill="${PALETTE.ivory}" opacity="0.08"/>` : ""}
    ${bagSilhouette(w * 0.5, h * 0.58, b.scale, b.body, PALETTE.brass)}
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
    ${vignette(w, h, "#000000", 0.24)}`;
    await render(`categories/${b.slug}-banner.webp`, w, h, svg);
  }
}

// ---------------------------------------------------------------------------
// 4. Craftsmanship
// ---------------------------------------------------------------------------
async function craftsmanshipImages() {
  const w = 1400, h = 1050;
  const steps = [
    { slug: "leather-selection", from: PALETTE.sand, to: PALETTE.camel },
    { slug: "cutting", from: PALETTE.camel, to: PALETTE.leather },
    { slug: "stitching", from: PALETTE.leather, to: PALETTE.charcoal },
    { slug: "edge-finishing", from: PALETTE.terracotta, to: PALETTE.leather },
    { slug: "final-inspection", from: PALETTE.olive, to: PALETTE.forest },
  ];
  for (const s of steps) {
    const svg = `
    <defs>${sceneBackground("bg", s.from, s.to, 110)}${grainFilter("g1", 0.07)}</defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${stitchLines(w * 0.1, h * 0.35, w * 0.8, h * 0.35, PALETTE.brass, 6)}
    <circle cx="${w * 0.82}" cy="${h * 0.28}" r="${w * 0.05}" fill="${PALETTE.brass}" opacity="0.5"/>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.6"/>
    ${vignette(w, h, "#000000", 0.22)}`;
    await render(`craftsmanship/${s.slug}.webp`, w, h, svg);
  }
}

// ---------------------------------------------------------------------------
// 5. Editorial / lifestyle
// ---------------------------------------------------------------------------
async function editorialImages() {
  const w = 1400, h = 1750;
  const scenes = [
    { slug: "marrakech-edit", from: PALETTE.terracotta, to: PALETTE.charcoal },
    { slug: "medina-collection", from: PALETTE.olive, to: PALETTE.forest },
    { slug: "workshop-to-wardrobe", from: PALETTE.camel, to: PALETTE.charcoal },
  ];
  for (const s of scenes) {
    const svg = `
    <defs>${sceneBackground("bg", s.from, s.to, 130)}${grainFilter("g1", 0.05)}</defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <path d="${archPath(w * 0.28, h * 0.06, w * 0.44, h * 0.62)}" fill="${PALETTE.ivory}" opacity="0.08"/>
    ${bagSilhouette(w * 0.5, h * 0.78, 2.6, PALETTE.leather, PALETTE.brass)}
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
    ${vignette(w, h, "#000000", 0.3)}`;
    await render(`editorial/${s.slug}.webp`, w, h, svg);
  }
}

// ---------------------------------------------------------------------------
// 6. Brand / story / custom orders / about
// ---------------------------------------------------------------------------
async function brandImages() {
  const w = 1800, h = 1300;
  const story = `
  <defs>${sceneBackground("bg", PALETTE.sand, PALETTE.camel, 100)}${grainFilter("g1", 0.045)}</defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <path d="${archPath(w * 0.62, h * 0.02, w * 0.34, h * 0.9)}" fill="${PALETTE.ivory}" opacity="0.35"/>
  <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
  ${vignette(w, h, "#000000", 0.14)}`;
  await render("brand/story.webp", w, h, story);

  const custom = `
  <defs>${sceneBackground("bg", PALETTE.olive, PALETTE.forest, 120)}${grainFilter("g1", 0.05)}</defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${bagSilhouette(w * 0.32, h * 0.55, 2.8, PALETTE.camel, PALETTE.brass)}
  ${["cognac", "dark-brown", "black", "olive", "natural"]
    .map((c, i) => `<circle cx="${w * 0.62 + i * 70}" cy="${h * 0.78}" r="26" fill="${COLOR_HEX[c]}" stroke="${PALETTE.ivory}" stroke-width="3"/>`)
    .join("")}
  <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
  ${vignette(w, h, "#000000", 0.26)}`;
  await render("brand/custom-orders.webp", w, h, custom);

  const about = `
  <defs>${sceneBackground("bg", PALETTE.charcoal, PALETTE.leather, 100)}${grainFilter("g1", 0.05)}</defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <path d="${archPath(w * 0.06, h * 0.05, w * 0.3, h * 0.75)}" fill="${PALETTE.sand}" opacity="0.15"/>
  <path d="${archPath(w * 0.64, h * 0.05, w * 0.3, h * 0.75)}" fill="${PALETTE.sand}" opacity="0.15"/>
  <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.55"/>
  ${vignette(w, h, "#000000", 0.3)}`;
  await render("brand/about-hero.webp", w, h, about);
}

async function artisanImages() {
  const w = 1200, h = 1500;
  const scenes = [
    { slug: "workshop-1", from: PALETTE.camel, to: PALETTE.leather },
    { slug: "workshop-2", from: PALETTE.sand, to: PALETTE.camel },
    { slug: "workshop-3", from: PALETTE.leather, to: PALETTE.charcoal },
  ];
  for (const s of scenes) {
    const svg = `
    <defs>${sceneBackground("bg", s.from, s.to, 100)}${grainFilter("g1", 0.06)}</defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    ${stitchLines(w * 0.18, h * 0.55, w * 0.64, h * 0.28, PALETTE.brass, 5)}
    <circle cx="${w * 0.28}" cy="${h * 0.32}" r="${w * 0.08}" fill="${PALETTE.ivory}" opacity="0.18"/>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.6"/>
    ${vignette(w, h, "#000000", 0.24)}`;
    await render(`artisans/${s.slug}.webp`, w, h, svg);
  }
}

async function avatarImages() {
  const names = [
    { slug: "s-b", initials: "SB", color: PALETTE.camel },
    { slug: "l-m", initials: "LM", color: PALETTE.olive },
    { slug: "a-k", initials: "AK", color: PALETTE.terracotta },
    { slug: "n-h", initials: "NH", color: PALETTE.leather },
    { slug: "e-r", initials: "ER", color: PALETTE.brass },
  ];
  const w = 200, h = 200;
  for (const n of names) {
    const svg = `
    <circle cx="${w / 2}" cy="${h / 2}" r="${w / 2}" fill="${n.color}"/>
    <text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle" font-family="Georgia, serif" font-size="72" fill="${PALETTE.ivory}">${n.initials}</text>`;
    await render(`avatars/${n.slug}.webp`, w, h, svg);
  }
}

async function main() {
  await heroImage();
  await categoryImages();
  await collectionBanners();
  await productImages();
  await craftsmanshipImages();
  await editorialImages();
  await brandImages();
  await artisanImages();
  await avatarImages();
  console.log("Generated placeholder art direction images.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
