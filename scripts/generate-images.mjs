// Generates the placeholder product photography used across the storefront.
// These are original, programmatically-rendered studio-style compositions —
// structured bag body, flap, handle, hardware, stitching, leather-sheen
// gradients and soft shadows — standing in for real photography until real
// product photos are shot and uploaded. Run with: node scripts/generate-images.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "public", "images");

const PALETTE = {
  cream: "#F6F1E8",
  ivory: "#FAF7F0",
  sand: "#E9DFCF",
  tan: "#D6C6AD",
  camel: "#B98B67",
  leather: "#8B5E3C",
  terracotta: "#A95F43",
  olive: "#4E5741",
  forest: "#3E4638",
  charcoal: "#2C2A26",
  brass: "#A78B57",
  muted: "#7A6F62",
};

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}
function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((v) => clamp(v).toString(16).padStart(2, "0")).join("")}`;
}
/** percent > 0 lightens toward white, percent < 0 darkens toward black */
function shade(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const t = percent > 0 ? 255 : 0;
  const p = Math.abs(percent) / 100;
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p);
}

let uid = 0;
function nextId(prefix) {
  uid += 1;
  return `${prefix}${uid}`;
}

// ---------------------------------------------------------------------------
// Reusable SVG fragments
// ---------------------------------------------------------------------------
function grainFilter(id, opacity = 0.045) {
  return `
  <filter id="${id}">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="noise"/>
    <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0"/>
  </filter>`;
}

function blurFilter(id, stdDeviation = 8) {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${stdDeviation}"/></filter>`;
}

function leatherGradient(id, baseHex, angle = 135) {
  const light = shade(baseHex, 22);
  const dark = shade(baseHex, -26);
  return `
  <linearGradient id="${id}" gradientTransform="rotate(${angle})">
    <stop offset="0%" stop-color="${light}"/>
    <stop offset="55%" stop-color="${baseHex}"/>
    <stop offset="100%" stop-color="${dark}"/>
  </linearGradient>`;
}

function metalGradient(id, tone = "brass") {
  const stops =
    tone === "dark"
      ? ["#8A8378", "#4B463F", "#2C2A26"]
      : tone === "antique"
        ? ["#C9A15C", "#8C6B3A", "#5B4726"]
        : ["#EAD4A0", "#B98B67", "#8B6B3A"];
  return `
  <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${stops[0]}"/>
    <stop offset="55%" stop-color="${stops[1]}"/>
    <stop offset="100%" stop-color="${stops[2]}"/>
  </linearGradient>`;
}

function studioBackground(id, tone = PALETTE.sand) {
  const outer = shade(tone, -6);
  return `
  <radialGradient id="${id}" cx="50%" cy="38%" r="75%">
    <stop offset="0%" stop-color="${PALETTE.ivory}"/>
    <stop offset="60%" stop-color="${tone}"/>
    <stop offset="100%" stop-color="${outer}"/>
  </radialGradient>`;
}

function sceneBackground(id, from, to, angle = 135) {
  return `
  <linearGradient id="${id}" gradientTransform="rotate(${angle})">
    <stop offset="0%" stop-color="${from}"/>
    <stop offset="100%" stop-color="${to}"/>
  </linearGradient>`;
}

function archPath(x, y, w, h) {
  const r = w / 2;
  return `M ${x} ${y + h} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h} Z`;
}

function vignette(width, height, color = "#000000", opacity = 0.18) {
  const id = nextId("vig");
  return {
    defs: `
    <radialGradient id="${id}" cx="50%" cy="42%" r="75%">
      <stop offset="55%" stop-color="${color}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="${opacity}"/>
    </radialGradient>`,
    body: `<rect width="${width}" height="${height}" fill="url(#${id})"/>`,
  };
}

// ---------------------------------------------------------------------------
// The bag illustration — a structured handbag with body, flap, handle,
// hardware, stitching and drop shadow. All coordinates are local to a
// (-140,-130)..(140,140) box, positioned/scaled by the caller.
// ---------------------------------------------------------------------------
function bagIllustration({ baseHex, view = "front", hardware = "brass", strap = false }) {
  const leatherId = nextId("leather");
  const flapId = nextId("flap");
  const metalId = nextId("metal");
  const shadowId = nextId("shadow");
  const skew = view === "side" ? "scale(0.62,1)" : "scale(1,1)";
  const flapDark = shade(baseHex, -12);

  const w = 220;
  const h = 168;
  const x = -w / 2;
  const y = -60;
  const rx = 20;

  const defs = `
    ${leatherGradient(leatherId, baseHex)}
    ${leatherGradient(flapId, flapDark, 120)}
    ${metalGradient(metalId, hardware === "antique" ? "antique" : hardware === "dark" ? "dark" : "brass")}
    ${blurFilter(shadowId, 10)}
  `;

  const shadow = `<ellipse cx="0" cy="${y + h + 18}" rx="${w * 0.56}" ry="${w * 0.09}" fill="#000000" opacity="0.22" filter="url(#${shadowId})"/>`;

  const strapRibbon = strap
    ? `<g opacity="0.95">
        <path d="M ${x - 8} ${y - 60} C ${x - 90} ${y + 40}, ${x - 70} ${y + 160}, ${x + 20} ${y + 210}"
              fill="none" stroke="${shade(baseHex, -18)}" stroke-width="22" stroke-linecap="round" opacity="0.9"/>
        <path d="M ${x - 8} ${y - 60} C ${x - 90} ${y + 40}, ${x - 70} ${y + 160}, ${x + 20} ${y + 210}"
              fill="none" stroke="${shade(baseHex, 14)}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
      </g>`
    : "";

  const body = `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#${leatherId})"/>
    <rect x="${x}" y="${y}" width="16" height="${h}" rx="${rx}" fill="#000000" opacity="0.1"/>
    <rect x="${x + w - 16}" y="${y}" width="16" height="${h}" rx="${rx}" fill="#000000" opacity="0.1"/>
    <rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" rx="${rx - 6}"
          fill="none" stroke="${PALETTE.ivory}" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="3 5"/>
  `;

  const flapBottomY = y + h * 0.52;
  const flap =
    view === "back"
      ? `<rect x="${x + w * 0.22}" y="${y + h * 0.5}" width="${w * 0.56}" height="${h * 0.36}" rx="10"
            fill="none" stroke="${PALETTE.ivory}" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="3 5"/>`
      : `
    <path d="M ${x} ${y} L ${x + w} ${y} L ${x + w} ${flapBottomY} Q 0 ${flapBottomY + 34} ${x} ${flapBottomY} Z"
          fill="url(#${flapId})"/>
    <path d="M ${x} ${flapBottomY} Q 0 ${flapBottomY + 34} ${x + w} ${flapBottomY}"
          fill="none" stroke="${PALETTE.ivory}" stroke-opacity="0.4" stroke-width="1.5" stroke-dasharray="3 5"/>
    <rect x="${-24}" y="${flapBottomY - 26}" width="48" height="24" rx="6" fill="url(#${metalId})"/>
    <circle cx="0" cy="${flapBottomY - 14}" r="4" fill="${shade(baseHex, -30)}" opacity="0.6"/>
    <rect x="-7" y="${flapBottomY - 2}" width="14" height="16" rx="3" fill="url(#${metalId})"/>
  `;

  const handleLift = view === "back" ? 0 : 1;
  const handleY = y;
  const handle =
    handleLift &&
    `
    <path d="M ${x + w * 0.24} ${handleY} C ${x + w * 0.24} ${handleY - 78}, ${x + w * 0.76} ${handleY - 78}, ${x + w * 0.76} ${handleY}"
          fill="none" stroke="${shade(baseHex, -20)}" stroke-width="15" stroke-linecap="round"/>
    <path d="M ${x + w * 0.24} ${handleY} C ${x + w * 0.24} ${handleY - 78}, ${x + w * 0.76} ${handleY - 78}, ${x + w * 0.76} ${handleY}"
          fill="none" stroke="${shade(baseHex, 16)}" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
    <circle cx="${x + w * 0.24}" cy="${handleY}" r="7" fill="url(#${metalId})"/>
    <circle cx="${x + w * 0.76}" cy="${handleY}" r="7" fill="url(#${metalId})"/>
  `;

  return {
    defs,
    body: `<g transform="${skew}">${shadow}${strapRibbon}${body}${flap}${handle || ""}</g>`,
  };
}

function stitchSeam(x, y, w, h, color, ticks = 10) {
  let ticksMarkup = "";
  for (let i = 0; i <= ticks; i++) {
    const px = x + (w / ticks) * i;
    const py = y + (h / ticks) * i;
    ticksMarkup += `<line x1="${px - 4}" y1="${py - 8}" x2="${px + 4}" y2="${py + 8}" stroke="${color}" stroke-width="2" opacity="0.55"/>`;
  }
  return `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="${color}" stroke-width="1.5" opacity="0.4"/>${ticksMarkup}`;
}

function svgDoc(width, height, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${inner}</svg>`;
}

async function render(name, width, height, svg) {
  const full = svgDoc(width, height, svg);
  const outPath = path.join(ROOT, name);
  await mkdir(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(full))
    .webp({ quality: 84 })
    .toFile(outPath.endsWith(".webp") ? outPath : `${outPath}.webp`);
}

// ---------------------------------------------------------------------------
// 1. Hero — editorial lifestyle composition
// ---------------------------------------------------------------------------
async function heroImage() {
  const w = 1600, h = 2000;
  const bg = sceneBackground(nextId("bg"), PALETTE.tan, PALETTE.leather, 120);
  const glow = `
  <radialGradient id="glow" cx="70%" cy="14%" r="55%">
    <stop offset="0%" stop-color="${PALETTE.cream}" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="${PALETTE.cream}" stop-opacity="0"/>
  </radialGradient>`;
  const vig = vignette(w, h, "#000000", 0.28);
  const bag = bagIllustration({ baseHex: PALETTE.leather, view: "front", hardware: "brass" });
  const svg = `
  <defs>${bg}${glow}${grainFilter("g1", 0.035)}${bag.defs}${vig.defs}</defs>
  <rect width="${w}" height="${h}" fill="url(#${bg.match(/id="([^"]+)"/)[1]})"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <path d="${archPath(w * 0.08, h * 0.06, w * 0.58, h * 0.62)}" fill="${PALETTE.ivory}" opacity="0.1"/>
  <path d="${archPath(w * 0.14, h * 0.1, w * 0.46, h * 0.52)}" fill="${PALETTE.charcoal}" opacity="0.18"/>
  <g transform="translate(${w * 0.56},${h * 0.72}) scale(2.55)">${bag.body}</g>
  <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
  ${vig.body}`;
  await render("hero/hero-main.webp", w, h, svg);
}

// ---------------------------------------------------------------------------
// 2. Category cards (square, studio, front-shot bag)
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { slug: "handbags", body: PALETTE.leather, hardware: "brass", strap: false, tone: PALETTE.sand },
  { slug: "shoulder-bags", body: PALETTE.olive, hardware: "antique", strap: true, tone: PALETTE.tan },
  { slug: "crossbody-bags", body: PALETTE.terracotta, hardware: "brass", strap: true, tone: PALETTE.sand },
  { slug: "tote-bags", body: PALETTE.leather, hardware: "brass", strap: false, tone: PALETTE.tan },
  { slug: "mini-bags", body: PALETTE.camel, hardware: "brass", strap: true, tone: PALETTE.sand },
  { slug: "leather-accessories", body: PALETTE.brass, hardware: "dark", strap: false, tone: PALETTE.tan },
];

async function categoryImages() {
  const w = 900, h = 900;
  for (const c of CATEGORIES) {
    const bg = studioBackground(nextId("bg"), c.tone);
    const bgId = bg.match(/id="([^"]+)"/)[1];
    const bag = bagIllustration({ baseHex: c.body, view: "front", hardware: c.hardware, strap: c.strap });
    const svg = `
    <defs>${bg}${grainFilter("g1", 0.03)}${bag.defs}</defs>
    <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
    <g transform="translate(${w * 0.5},${h * 0.56}) scale(1.85)">${bag.body}</g>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.4"/>`;
    await render(`categories/${c.slug}.webp`, w, h, svg);
  }
}

async function collectionBanners() {
  const w = 1920, h = 560;
  const banners = [
    { slug: "handbags", body: PALETTE.leather, hardware: "brass", tone: PALETTE.sand },
    { slug: "shoulder-bags", body: PALETTE.olive, hardware: "antique", tone: PALETTE.tan },
    { slug: "crossbody-bags", body: PALETTE.terracotta, hardware: "brass", tone: PALETTE.sand },
    { slug: "tote-bags", body: PALETTE.leather, hardware: "brass", tone: PALETTE.tan },
    { slug: "mini-bags", body: PALETTE.camel, hardware: "brass", tone: PALETTE.sand },
    { slug: "leather-accessories", body: PALETTE.brass, hardware: "dark", tone: PALETTE.tan },
    { slug: "all", body: PALETTE.leather, hardware: "brass", tone: PALETTE.tan },
    { slug: "new-arrivals", body: PALETTE.terracotta, hardware: "brass", tone: PALETTE.sand },
    { slug: "best-sellers", body: PALETTE.camel, hardware: "brass", tone: PALETTE.tan },
  ];
  for (const b of banners) {
    const bg = studioBackground(nextId("bg"), b.tone);
    const bgId = bg.match(/id="([^"]+)"/)[1];
    const bag = bagIllustration({ baseHex: b.body, view: "front", hardware: b.hardware });
    const svg = `
    <defs>${bg}${grainFilter("g1", 0.03)}${bag.defs}</defs>
    <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
    <g transform="translate(${w * 0.5},${h * 0.62}) scale(1.7)">${bag.body}</g>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.4"/>`;
    await render(`categories/${b.slug}-banner.webp`, w, h, svg);
  }
}

// ---------------------------------------------------------------------------
// 3. Products — front / side / back / stitching-detail / hardware-detail / lifestyle
// ---------------------------------------------------------------------------
const COLOR_HEX = {
  cognac: PALETTE.camel,
  "dark-brown": "#5A3A24",
  black: PALETTE.charcoal,
  olive: PALETTE.olive,
  natural: PALETTE.tan,
};

export const PRODUCT_SLUGS = [
  { slug: "lalla-leather-bag", color: "cognac", hardware: "brass", strap: false },
  { slug: "zahra-tote", color: "dark-brown", hardware: "brass", strap: false },
  { slug: "atlas-crossbody", color: "black", hardware: "dark", strap: true },
  { slug: "medina-mini-bag", color: "natural", hardware: "brass", strap: true },
  { slug: "riad-shoulder-bag", color: "olive", hardware: "antique", strap: true },
  { slug: "noor-bucket-bag", color: "cognac", hardware: "brass", strap: true },
  { slug: "essaouira-tote", color: "natural", hardware: "brass", strap: false },
  { slug: "amira-bag", color: "dark-brown", hardware: "brass", strap: false },
  { slug: "bahia-shoulder-bag", color: "black", hardware: "antique", strap: true },
  { slug: "safi-crossbody", color: "olive", hardware: "brass", strap: true },
  { slug: "kasbah-tote", color: "cognac", hardware: "brass", strap: false },
  { slug: "yasmine-mini", color: "dark-brown", hardware: "brass", strap: true },
];

async function productImages() {
  const w = 1200, h = 1200;
  for (const p of PRODUCT_SLUGS) {
    const body = COLOR_HEX[p.color];

    // Front
    {
      const bg = studioBackground(nextId("bg"), PALETTE.sand);
      const bgId = bg.match(/id="([^"]+)"/)[1];
      const bag = bagIllustration({ baseHex: body, view: "front", hardware: p.hardware, strap: p.strap });
      const svg = `
      <defs>${bg}${grainFilter("g1", 0.03)}${bag.defs}</defs>
      <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
      <g transform="translate(${w * 0.5},${h * 0.56}) scale(2.05)">${bag.body}</g>
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.35"/>`;
      await render(`products/${p.slug}-front.webp`, w, h, svg);
    }

    // Side
    {
      const bg = studioBackground(nextId("bg"), PALETTE.tan);
      const bgId = bg.match(/id="([^"]+)"/)[1];
      const bag = bagIllustration({ baseHex: body, view: "side", hardware: p.hardware, strap: p.strap });
      const svg = `
      <defs>${bg}${grainFilter("g1", 0.03)}${bag.defs}</defs>
      <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
      <g transform="translate(${w * 0.5},${h * 0.56}) scale(2.05)">${bag.body}</g>
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.35"/>`;
      await render(`products/${p.slug}-side.webp`, w, h, svg);
    }

    // Back
    {
      const bg = studioBackground(nextId("bg"), PALETTE.sand);
      const bgId = bg.match(/id="([^"]+)"/)[1];
      const bag = bagIllustration({ baseHex: body, view: "back", hardware: p.hardware, strap: false });
      const svg = `
      <defs>${bg}${grainFilter("g1", 0.03)}${bag.defs}</defs>
      <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
      <g transform="translate(${w * 0.5},${h * 0.56}) scale(2.05)">${bag.body}</g>
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.35"/>`;
      await render(`products/${p.slug}-back.webp`, w, h, svg);
    }

    // Stitching detail (tight macro crop)
    {
      const grad = leatherGradient(nextId("lg"), body, 100);
      const gradId = grad.match(/id="([^"]+)"/)[1];
      const vig = vignette(w, h, "#000000", 0.32);
      const vigId = vig.defs.match(/id="([^"]+)"/)[1];
      const svg = `
      <defs>${grad}${grainFilter("g1", 0.1)}${vig.defs}</defs>
      <rect width="${w}" height="${h}" fill="url(#${gradId})"/>
      ${stitchSeam(w * 0.08, h * 0.28, w * 0.84, h * 0.44, PALETTE.ivory, 14)}
      ${stitchSeam(w * 0.08, h * 0.62, w * 0.84, h * 0.2, shade(body, -18), 10)}
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.85"/>
      <rect width="${w}" height="${h}" fill="url(#${vigId})"/>`;
      await render(`products/${p.slug}-detail-stitching.webp`, w, h, svg);
    }

    // Hardware detail (macro on buckle/rivet)
    {
      const grad = leatherGradient(nextId("lg2"), body, 100);
      const gradId = grad.match(/id="([^"]+)"/)[1];
      const metal = metalGradient(nextId("mt"), p.hardware === "antique" ? "antique" : p.hardware === "dark" ? "dark" : "brass");
      const metalId = metal.match(/id="([^"]+)"/)[1];
      const vig = vignette(w, h, "#000000", 0.3);
      const vigId = vig.defs.match(/id="([^"]+)"/)[1];
      const svg = `
      <defs>${grad}${metal}${grainFilter("g1", 0.06)}${vig.defs}</defs>
      <rect width="${w}" height="${h}" fill="url(#${gradId})"/>
      <rect x="${w * 0.28}" y="${h * 0.36}" width="${w * 0.44}" height="${h * 0.28}" rx="18" fill="url(#${metalId})"/>
      <circle cx="${w * 0.5}" cy="${h * 0.5}" r="${w * 0.05}" fill="${shade(body, -35)}" opacity="0.5"/>
      <rect x="${w * 0.44}" y="${h * 0.6}" width="${w * 0.12}" height="${h * 0.18}" rx="6" fill="url(#${metalId})"/>
      ${stitchSeam(w * 0.1, h * 0.85, w * 0.8, 0, PALETTE.ivory, 12)}
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
      <rect width="${w}" height="${h}" fill="url(#${vigId})"/>`;
      await render(`products/${p.slug}-detail-hardware.webp`, w, h, svg);
    }

    // Lifestyle (warm interior scene)
    {
      const bgGrad = sceneBackground(nextId("bg"), shade(PALETTE.terracotta, 8), PALETTE.charcoal, 120);
      const bgId = bgGrad.match(/id="([^"]+)"/)[1];
      const glow = `<radialGradient id="glow${uid}" cx="72%" cy="16%" r="50%"><stop offset="0%" stop-color="${PALETTE.camel}" stop-opacity="0.5"/><stop offset="100%" stop-color="${PALETTE.camel}" stop-opacity="0"/></radialGradient>`;
      const glowId = `glow${uid}`;
      const bag = bagIllustration({ baseHex: body, view: "front", hardware: p.hardware, strap: p.strap });
      const vig = vignette(w, h, "#000000", 0.32);
      const vigId = vig.defs.match(/id="([^"]+)"/)[1];
      const svg = `
      <defs>${bgGrad}${glow}${grainFilter("g1", 0.045)}${bag.defs}${vig.defs}</defs>
      <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
      <rect width="${w}" height="${h}" fill="url(#${glowId})"/>
      <path d="${archPath(w * 0.54, h * 0.03, w * 0.4, h * 0.55)}" fill="${PALETTE.charcoal}" opacity="0.35"/>
      <ellipse cx="${w * 0.5}" cy="${h * 0.78}" rx="${w * 0.34}" ry="${h * 0.03}" fill="#000000" opacity="0.25"/>
      <g transform="translate(${w * 0.46},${h * 0.68}) scale(1.9)">${bag.body}</g>
      <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.55"/>
      <rect width="${w}" height="${h}" fill="url(#${vigId})"/>`;
      await render(`products/${p.slug}-lifestyle.webp`, w, h, svg);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Craftsmanship macro shots
// ---------------------------------------------------------------------------
async function craftsmanshipImages() {
  const w = 1400, h = 1050;
  const steps = [
    { slug: "leather-selection", body: PALETTE.camel },
    { slug: "cutting", body: PALETTE.leather },
    { slug: "stitching", body: "#5A3A24" },
    { slug: "edge-finishing", body: PALETTE.terracotta },
    { slug: "final-inspection", body: PALETTE.olive },
  ];
  for (const s of steps) {
    const grad = leatherGradient(nextId("lg"), s.body, 100);
    const gradId = grad.match(/id="([^"]+)"/)[1];
    const metal = metalGradient(nextId("mt"), "brass");
    const metalId = metal.match(/id="([^"]+)"/)[1];
    const vig = vignette(w, h, "#000000", 0.26);
    const vigId = vig.defs.match(/id="([^"]+)"/)[1];
    const svg = `
    <defs>${grad}${metal}${grainFilter("g1", 0.07)}${vig.defs}</defs>
    <rect width="${w}" height="${h}" fill="url(#${gradId})"/>
    ${stitchSeam(w * 0.08, h * 0.3, w * 0.8, h * 0.35, PALETTE.ivory, 10)}
    <circle cx="${w * 0.82}" cy="${h * 0.26}" r="${w * 0.045}" fill="url(#${metalId})" opacity="0.9"/>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.6"/>
    <rect width="${w}" height="${h}" fill="url(#${vigId})"/>`;
    await render(`craftsmanship/${s.slug}.webp`, w, h, svg);
  }
}

// ---------------------------------------------------------------------------
// 5. Editorial / lifestyle
// ---------------------------------------------------------------------------
async function editorialImages() {
  const w = 1400, h = 1750;
  const scenes = [
    { slug: "marrakech-edit", from: PALETTE.terracotta, to: PALETTE.charcoal, body: PALETTE.camel },
    { slug: "medina-collection", from: PALETTE.olive, to: PALETTE.forest, body: PALETTE.leather },
    { slug: "workshop-to-wardrobe", from: PALETTE.camel, to: PALETTE.charcoal, body: "#5A3A24" },
  ];
  for (const s of scenes) {
    const bg = sceneBackground(nextId("bg"), s.from, s.to, 130);
    const bgId = bg.match(/id="([^"]+)"/)[1];
    const bag = bagIllustration({ baseHex: s.body, view: "front", hardware: "brass", strap: true });
    const vig = vignette(w, h, "#000000", 0.3);
    const vigId = vig.defs.match(/id="([^"]+)"/)[1];
    const svg = `
    <defs>${bg}${grainFilter("g1", 0.05)}${bag.defs}${vig.defs}</defs>
    <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
    <path d="${archPath(w * 0.24, h * 0.05, w * 0.5, h * 0.58)}" fill="${PALETTE.ivory}" opacity="0.08"/>
    <ellipse cx="${w * 0.5}" cy="${h * 0.82}" rx="${w * 0.32}" ry="${h * 0.02}" fill="#000000" opacity="0.25"/>
    <g transform="translate(${w * 0.5},${h * 0.74}) scale(2.1)">${bag.body}</g>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
    <rect width="${w}" height="${h}" fill="url(#${vigId})"/>`;
    await render(`editorial/${s.slug}.webp`, w, h, svg);
  }
}

// ---------------------------------------------------------------------------
// 6. Brand / story / custom orders / about
// ---------------------------------------------------------------------------
async function brandImages() {
  const w = 1800, h = 1300;

  {
    const bg = sceneBackground(nextId("bg"), PALETTE.tan, PALETTE.camel, 100);
    const bgId = bg.match(/id="([^"]+)"/)[1];
    const svg = `
    <defs>${bg}${grainFilter("g1", 0.04)}</defs>
    <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
    <path d="${archPath(w * 0.62, h * 0.02, w * 0.34, h * 0.9)}" fill="${PALETTE.ivory}" opacity="0.35"/>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
    ${vignette(w, h, "#000000", 0.14).body}`;
    await render("brand/story.webp", w, h, svg);
  }

  {
    const bg = sceneBackground(nextId("bg"), PALETTE.olive, PALETTE.forest, 120);
    const bgId = bg.match(/id="([^"]+)"/)[1];
    const bag = bagIllustration({ baseHex: PALETTE.camel, view: "front", hardware: "brass" });
    const vig = vignette(w, h, "#000000", 0.26);
    const vigId = vig.defs.match(/id="([^"]+)"/)[1];
    const swatches = ["cognac", "dark-brown", "black", "olive", "natural"]
      .map((c, i) => `<circle cx="${w * 0.64 + i * 70}" cy="${h * 0.8}" r="26" fill="${COLOR_HEX[c]}" stroke="${PALETTE.ivory}" stroke-width="3"/>`)
      .join("");
    const svg = `
    <defs>${bg}${grainFilter("g1", 0.05)}${bag.defs}${vig.defs}</defs>
    <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
    <g transform="translate(${w * 0.32},${h * 0.55}) scale(2.4)">${bag.body}</g>
    ${swatches}
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.5"/>
    <rect width="${w}" height="${h}" fill="url(#${vigId})"/>`;
    await render("brand/custom-orders.webp", w, h, svg);
  }

  {
    const bg = sceneBackground(nextId("bg"), PALETTE.charcoal, PALETTE.leather, 100);
    const bgId = bg.match(/id="([^"]+)"/)[1];
    const svg = `
    <defs>${bg}${grainFilter("g1", 0.05)}</defs>
    <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
    <path d="${archPath(w * 0.06, h * 0.05, w * 0.3, h * 0.75)}" fill="${PALETTE.sand}" opacity="0.15"/>
    <path d="${archPath(w * 0.64, h * 0.05, w * 0.3, h * 0.75)}" fill="${PALETTE.sand}" opacity="0.15"/>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.55"/>
    ${vignette(w, h, "#000000", 0.3).body}`;
    await render("brand/about-hero.webp", w, h, svg);
  }
}

async function artisanImages() {
  const w = 1200, h = 1500;
  const scenes = [
    { slug: "workshop-1", from: PALETTE.camel, to: PALETTE.leather },
    { slug: "workshop-2", from: PALETTE.tan, to: PALETTE.camel },
    { slug: "workshop-3", from: PALETTE.leather, to: PALETTE.charcoal },
  ];
  for (const s of scenes) {
    const bg = sceneBackground(nextId("bg"), s.from, s.to, 100);
    const bgId = bg.match(/id="([^"]+)"/)[1];
    const vig = vignette(w, h, "#000000", 0.24);
    const vigId = vig.defs.match(/id="([^"]+)"/)[1];
    const svg = `
    <defs>${bg}${grainFilter("g1", 0.06)}${vig.defs}</defs>
    <rect width="${w}" height="${h}" fill="url(#${bgId})"/>
    ${stitchSeam(w * 0.18, h * 0.55, w * 0.64, h * 0.28, PALETTE.ivory, 8)}
    <circle cx="${w * 0.28}" cy="${h * 0.32}" r="${w * 0.08}" fill="${PALETTE.ivory}" opacity="0.18"/>
    <rect width="${w}" height="${h}" filter="url(#g1)" opacity="0.6"/>
    <rect width="${w}" height="${h}" fill="url(#${vigId})"/>`;
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
  console.log("Generated placeholder product photography and art direction images.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
