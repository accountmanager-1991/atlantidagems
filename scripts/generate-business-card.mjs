#!/usr/bin/env node
// Print-ready business card generator.
// US standard: 3.5" × 2" trim, 1/8" bleed, 1/8" safe zone, 300 DPI.
//   Trim:     1050 × 600 px
//   Bleed:    1125 × 675 px (canvas) — design extends here
//   Safe:      975 × 525 px (interior — keep critical elements inside this)
// Outputs both Light + Dark themes, both Front + Back.

import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "brand-kit/03-BUSINESS-CARD-2026-04";
mkdirSync(OUT, { recursive: true });

const markSrc = readFileSync("brand-kit/01-LOGOS/final-2026-04/logo-mark.svg", "utf8");
const defsMatch = markSrc.match(/<defs>([\s\S]*?)<\/defs>/);
const LOGO_DEFS = defsMatch ? defsMatch[1] : "";
const bodyMatch = markSrc.match(/<\/defs>([\s\S]*)<\/svg>/);
const LOGO_BODY = bodyMatch ? bodyMatch[1] : "";

const P = {
  cream: "#FAF7F0",
  ocean: "#0C1420",
  midnight: "#08080E",
  gold: "#C9A84C",
  goldLight: "#EDD8A0",
  goldDeep: "#8A6418",
  ambar: "#D06800",
  larimar: "#3AADCC",
};

// 300 DPI working canvas (with bleed)
const W = 1125, H = 675;          // bleed canvas
const TRIM_X = 37.5, TRIM_Y = 37.5; // trim starts here (1/8" inset)
const TRIM_W = 1050, TRIM_H = 600;
const SAFE_X = 75, SAFE_Y = 75;     // safe zone (1/8" inside trim)
const SAFE_W = 975, SAFE_H = 525;

// Logo embed
function mark({ cx, cy, size }) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 240 240">${LOGO_BODY}</svg>`;
}

// Crop marks (4 corners — guides the printer where to trim)
function cropMarks() {
  const len = 18;        // length of each crop mark
  const stroke = "#000"; // black registration
  const sw = 1;
  const m = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}"/>`;
  return [
    // Top-left
    m(0, TRIM_Y, len, TRIM_Y), m(TRIM_X, 0, TRIM_X, len),
    // Top-right
    m(TRIM_X + TRIM_W, 0, TRIM_X + TRIM_W, len),
    m(W - len, TRIM_Y, W, TRIM_Y),
    // Bottom-left
    m(0, TRIM_Y + TRIM_H, len, TRIM_Y + TRIM_H),
    m(TRIM_X, H - len, TRIM_X, H),
    // Bottom-right
    m(TRIM_X + TRIM_W, H - len, TRIM_X + TRIM_W, H),
    m(W - len, TRIM_Y + TRIM_H, W, TRIM_Y + TRIM_H),
  ].join("");
}

// FRONT: logo + brand name + tagline, decorative
function front(theme) {
  const isDark = theme === "dark";
  const bg = isDark ? P.ocean : P.cream;
  const text = isDark ? P.cream : P.ocean;
  const subtext = isDark ? P.goldLight : P.goldDeep;
  const bgGrad = isDark
    ? `<defs><radialGradient id="bgR" cx="50%" cy="50%" r="80%"><stop offset="0%" stop-color="#1A2A3E"/><stop offset="100%" stop-color="${P.midnight}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#bgR)"/>`
    : `<rect width="${W}" height="${H}" fill="${bg}"/>`;

  const markSize = 280;
  const markCx = TRIM_X + 220;
  const markCy = H / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${LOGO_DEFS ? `<defs>${LOGO_DEFS}</defs>` : ""}
${bgGrad}

${cropMarks()}

<!-- Decorative gold dot border along top + bottom (within safe zone) -->
${Array.from({ length: 22 }, (_, i) => {
  const x = SAFE_X + (i * SAFE_W) / 21;
  return `<circle cx="${x.toFixed(0)}" cy="${(SAFE_Y + 8).toFixed(0)}" r="2" fill="${P.gold}" opacity="0.55"/>`;
}).join("")}
${Array.from({ length: 22 }, (_, i) => {
  const x = SAFE_X + (i * SAFE_W) / 21;
  return `<circle cx="${x.toFixed(0)}" cy="${(SAFE_Y + SAFE_H - 8).toFixed(0)}" r="2" fill="${P.gold}" opacity="0.55"/>`;
}).join("")}

<!-- Logo seal -->
${mark({ cx: markCx, cy: markCy, size: markSize })}

<!-- Wordmark -->
<text x="${markCx + markSize / 2 + 60}" y="${H / 2 - 12}" font-family="Georgia, serif" font-weight="700" font-size="74" letter-spacing="6" fill="${text}">AMBAR &amp;</text>
<text x="${markCx + markSize / 2 + 60}" y="${H / 2 + 56}" font-family="Georgia, serif" font-weight="700" font-size="74" letter-spacing="6" fill="${text}">LARIMAR</text>
<text x="${markCx + markSize / 2 + 60}" y="${H / 2 + 110}" font-family="Georgia, serif" font-style="italic" font-size="38" letter-spacing="10" fill="${subtext}">Shop</text>

<!-- Tagline -->
<text x="${markCx + markSize / 2 + 60}" y="${SAFE_Y + SAFE_H - 18}" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="4" fill="${subtext}" opacity="0.85">THE RAREST STONES ON EARTH</text>
</svg>`;
}

// BACK: contact details
function back(theme) {
  const isDark = theme === "dark";
  const bg = isDark ? P.ocean : P.cream;
  const text = isDark ? P.cream : P.ocean;
  const subtext = isDark ? P.goldLight : P.goldDeep;
  const accent = P.gold;
  const bgGrad = isDark
    ? `<defs><radialGradient id="bgR" cx="50%" cy="50%" r="80%"><stop offset="0%" stop-color="#1A2A3E"/><stop offset="100%" stop-color="${P.midnight}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#bgR)"/>`
    : `<rect width="${W}" height="${H}" fill="${bg}"/>`;

  const markSize = 90;
  const markCx = SAFE_X + markSize / 2;
  const markCy = SAFE_Y + markSize / 2;

  // Contact rows
  const contactX = SAFE_X + 200;
  const rowY = SAFE_Y + 40;
  const rowH = 42;
  const labelStyle = `font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="3" fill="${subtext}" opacity="0.75"`;
  const valueStyle = `font-family="Georgia, serif" font-size="22" fill="${text}"`;

  const rows = [
    { label: "WEB", value: "ambarlarimarshop.com" },
    { label: "EMAIL", value: "hello@ambarlarimarshop.com" },
    { label: "INSTAGRAM", value: "@ambarlarimarshop" },
    { label: "PHONE", value: "+1 (809) ___ ____" },
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
${LOGO_DEFS ? `<defs>${LOGO_DEFS}</defs>` : ""}
${bgGrad}

${cropMarks()}

<!-- Logo top-left -->
${mark({ cx: markCx, cy: markCy, size: markSize })}

<!-- Brand name next to logo -->
<text x="${markCx + markSize / 2 + 24}" y="${markCy - 4}" font-family="Georgia, serif" font-weight="700" font-size="28" letter-spacing="3" fill="${text}">AMBAR &amp; LARIMAR</text>
<text x="${markCx + markSize / 2 + 24}" y="${markCy + 22}" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="3" fill="${subtext}" opacity="0.85">FINE CARIBBEAN JEWELRY</text>

<!-- Gold divider under header -->
<line x1="${SAFE_X}" y1="${SAFE_Y + markSize + 18}" x2="${SAFE_X + SAFE_W}" y2="${SAFE_Y + markSize + 18}" stroke="${accent}" stroke-width="0.8" opacity="0.5"/>
<circle cx="${SAFE_X + SAFE_W / 2}" cy="${SAFE_Y + markSize + 18}" r="3.5" fill="${accent}"/>

<!-- Contact rows -->
${rows.map((r, i) => {
  const y = SAFE_Y + markSize + 70 + i * rowH;
  return `
    <text x="${SAFE_X}" y="${y}" ${labelStyle}>${r.label}</text>
    <text x="${SAFE_X + 140}" y="${y}" ${valueStyle}>${r.value}</text>
  `;
}).join("")}

<!-- Footer tagline -->
<text x="${W / 2}" y="${SAFE_Y + SAFE_H - 12}" font-family="Helvetica, Arial, sans-serif" font-size="11" letter-spacing="4" fill="${subtext}" text-anchor="middle" opacity="0.75">DOMINICAN REPUBLIC · WORLDWIDE SHIPPING</text>
</svg>`;
}

const variants = [
  { name: "card-front-light", svg: front("light") },
  { name: "card-front-dark", svg: front("dark") },
  { name: "card-back-light", svg: back("light") },
  { name: "card-back-dark", svg: back("dark") },
];

console.log("== Business cards ==");
for (const v of variants) {
  const svgPath = join(OUT, `${v.name}.svg`);
  writeFileSync(svgPath, v.svg);
  const pngPath = svgPath.replace(/\.svg$/, ".png");
  await sharp(Buffer.from(v.svg), { density: 300 }).png().toFile(pngPath);
  console.log(`  ${v.name} 1125×675 (3.625" × 2.125" with bleed @ 300 DPI)`);
}

writeFileSync(join(OUT, "README.txt"),
`AMBAR & LARIMAR SHOP — BUSINESS CARDS
======================================

Print specs:
  Trim size:  3.5" × 2.0"   (1050 × 600 px)
  Bleed:      0.125" all sides (canvas: 1125 × 675 px)
  Safe zone:  0.125" inside trim
  DPI:        300

Files:
  card-front-{light|dark}.svg / .png
  card-back-{light|dark}.svg / .png

When ordering from a printer (Vistaprint, Moo, Got Print, local press):
  1. Choose the LIGHT version for cream stock or matte finish
  2. Choose the DARK version for navy stock or premium dark finish
  3. Upload the PNG file (or the SVG if your printer accepts vector)
  4. The black corner marks are crop marks — printer trims along them
  5. The design extends to the bleed area; final card is 3.5" × 2"

Edit before printing:
  - Open the SVG in any vector editor (Illustrator, Inkscape, Figma)
  - Replace the phone number placeholder ("+1 (809) ___ ____")
  - Adjust handle / email if needed
  - Re-export to PNG/PDF
`);

console.log("\nDone. Cards in", OUT);
