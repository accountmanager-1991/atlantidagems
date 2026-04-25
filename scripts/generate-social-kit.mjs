#!/usr/bin/env node
// Generate the full social media kit:
//  - Platform banners (Facebook / X / LinkedIn / YouTube / Pinterest) light + dark
//  - Instagram post & story templates with centered product zones, light + dark
//
// Outputs SVG sources + PNG renders via sharp.

import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = "brand-kit/02-SOCIAL-2026-04";
mkdirSync(join(OUT, "banners"), { recursive: true });
mkdirSync(join(OUT, "instagram"), { recursive: true });

const markSrc = readFileSync("brand-kit/01-LOGOS/final-2026-04/logo-mark.svg", "utf8");
// Extract <defs>...</defs>
const defsMatch = markSrc.match(/<defs>([\s\S]*?)<\/defs>/);
const LOGO_DEFS = defsMatch ? defsMatch[1] : "";
// Extract everything between </defs> and </svg>
const bodyMatch = markSrc.match(/<\/defs>([\s\S]*)<\/svg>/);
const LOGO_BODY = bodyMatch ? bodyMatch[1] : "";

// The logo viewBox is 0 0 240 240 — center at 120,120, radius ~115
const MARK_VIEWBOX = "0 0 240 240";

// Common palette
const P = {
  cream: "#FAF7F0",
  ocean: "#0C1420",
  navy: "#0E3A54",
  midnight: "#08080E",
  gold: "#C9A84C",
  goldLight: "#EDD8A0",
  goldDeep: "#8A6418",
  ambar: "#D06800",
  larimar: "#3AADCC",
};

// Shared font stack strings (web-safe fallbacks, since SVG → PNG in sharp uses system fonts)
const FONT_HEADING = "Georgia, 'Times New Roman', serif";
const FONT_BODY = "Georgia, serif";
const FONT_UI = "Helvetica, Arial, sans-serif";

// Taíno petroglyph row — subtle decorative dotted border
function taino({ cx, cy, radius, count = 16, fill = P.gold, opacity = 0.6 }) {
  let out = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * 2 * Math.PI - Math.PI / 2;
    const x = cx + radius * Math.cos(a);
    const y = cy + radius * Math.sin(a);
    out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="${fill}" opacity="${opacity}"/>`;
  }
  return out;
}

// Embed the logo at (cx, cy) centered with given size
function mark({ cx, cy, size }) {
  const x = cx - size / 2;
  const y = cy - size / 2;
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${MARK_VIEWBOX}">${LOGO_BODY}</svg>`;
}

// Ornate corner flourish
function corner({ x, y, size = 60, rotate = 0, color = P.gold }) {
  return `<g transform="translate(${x},${y}) rotate(${rotate})">
    <path d="M0,0 L${size * 0.7},0" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.75"/>
    <path d="M0,0 L0,${size * 0.7}" stroke="${color}" stroke-width="1.5" fill="none" opacity="0.75"/>
    <path d="M${size * 0.6},0 A${size * 0.6},${size * 0.6} 0 0 0 0,${size * 0.6}" stroke="${color}" stroke-width="0.8" fill="none" opacity="0.4"/>
    <circle cx="0" cy="0" r="2.5" fill="${color}" opacity="0.9"/>
  </g>`;
}

// BANNER GENERATOR
function makeBanner({ w, h, theme, markSize = 180, layout = "left-mark" }) {
  const isDark = theme === "dark";
  const bg = isDark ? P.ocean : P.cream;
  const bgGrad = isDark
    ? `<defs><radialGradient id="bgR" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="#1A2A3E"/><stop offset="100%" stop-color="${P.midnight}"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#bgR)"/>`
    : `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  const text = isDark ? P.cream : P.ocean;
  const subtext = isDark ? P.goldLight : P.goldDeep;

  const markCx = layout === "center" ? w / 2 : markSize / 2 + 80;
  const markCy = h / 2;
  const textAnchor = layout === "center" ? "middle" : "start";
  const textX = layout === "center" ? w / 2 : markCx + markSize / 2 + 60;

  // Compose:
  // 1. background (with subtle gradient for dark)
  // 2. dotted Taíno border along top + bottom, inset
  // 3. logo
  // 4. wordmark
  // 5. tagline
  // 6. bottom tagline "DOMINICAN REPUBLIC"

  const bottomGold = Math.min(h - 40, h - h * 0.1);
  const headingSize = Math.min(markSize * 0.36, 64);
  const subSize = Math.min(headingSize * 0.55, 34);
  const tagSize = Math.min(subSize * 0.5, 16);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${LOGO_DEFS ? `<defs>${LOGO_DEFS}</defs>` : ""}
${bgGrad}

<!-- Top + bottom Taíno dot borders -->
${Array.from({ length: 20 }, (_, i) => {
  const x = 60 + (i * (w - 120)) / 19;
  return `<circle cx="${x.toFixed(0)}" cy="28" r="1.8" fill="${P.gold}" opacity="${isDark ? 0.55 : 0.45}"/>`;
}).join("")}
${Array.from({ length: 20 }, (_, i) => {
  const x = 60 + (i * (w - 120)) / 19;
  return `<circle cx="${x.toFixed(0)}" cy="${h - 28}" r="1.8" fill="${P.gold}" opacity="${isDark ? 0.55 : 0.45}"/>`;
}).join("")}

<!-- Ornate corners -->
${corner({ x: 30, y: 30, rotate: 0 })}
${corner({ x: w - 30, y: 30, rotate: 90 })}
${corner({ x: w - 30, y: h - 30, rotate: 180 })}
${corner({ x: 30, y: h - 30, rotate: 270 })}

<!-- Logo mark -->
${mark({ cx: markCx, cy: markCy, size: markSize })}

<!-- Wordmark -->
<text x="${textX}" y="${markCy - headingSize * 0.2}" font-family="${FONT_HEADING}" font-weight="700" font-size="${headingSize}" letter-spacing="${headingSize * 0.08}" fill="${text}" text-anchor="${textAnchor}">AMBAR &amp; LARIMAR</text>
<text x="${textX}" y="${markCy + subSize}" font-family="${FONT_BODY}" font-style="italic" font-size="${subSize}" letter-spacing="${subSize * 0.3}" fill="${subtext}" text-anchor="${textAnchor}">Shop</text>

<!-- Bottom tagline -->
<text x="${w / 2}" y="${bottomGold}" font-family="${FONT_UI}" font-size="${tagSize}" letter-spacing="${tagSize * 0.3}" fill="${subtext}" text-anchor="middle" opacity="0.8">FINE CARIBBEAN JEWELRY · DOMINICAN REPUBLIC</text>
</svg>`;
}

// INSTAGRAM POST / STORY TEMPLATE with centered product photo zone
function makeInstagram({ w, h, theme, label = "square" }) {
  const isDark = theme === "dark";
  const bg = isDark ? P.ocean : P.cream;
  const bgGrad = isDark
    ? `<defs><radialGradient id="bgR" cx="50%" cy="40%" r="75%"><stop offset="0%" stop-color="#1A2A3E"/><stop offset="100%" stop-color="${P.midnight}"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#bgR)"/>`
    : `<defs><radialGradient id="bgR" cx="50%" cy="40%" r="75%"><stop offset="0%" stop-color="#FFFBEF"/><stop offset="100%" stop-color="${P.cream}"/></radialGradient></defs><rect width="${w}" height="${h}" fill="url(#bgR)"/>`;
  const text = isDark ? P.cream : P.ocean;
  const subtext = isDark ? P.goldLight : P.goldDeep;
  const placeholderFill = isDark ? "#1a2839" : "#ebe5d0";
  const placeholderStroke = isDark ? "#3a4d6a" : "#c9b99a";

  // Product photo zone: centered, ~65% of width, square
  const zoneSize = Math.min(w, h) * 0.62;
  const zoneX = (w - zoneSize) / 2;
  const zoneY = (h - zoneSize) / 2;

  // Logo at top
  const topMarkSize = Math.min(w * 0.11, 130);
  const topMarkY = h * 0.08;

  // Header text below logo
  const headerY = topMarkY + topMarkSize * 0.8;

  // Bottom metadata zone
  const bottomY = zoneY + zoneSize + (h - zoneY - zoneSize) * 0.35;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
${LOGO_DEFS ? `<defs>${LOGO_DEFS}</defs>` : ""}
${bgGrad}

<!-- Decorative outer frame -->
<rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="${P.gold}" stroke-width="1.5" opacity="0.5"/>
<rect x="38" y="38" width="${w - 76}" height="${h - 76}" fill="none" stroke="${P.gold}" stroke-width="0.6" opacity="0.3"/>

<!-- Taíno dot rows (decorative) -->
${taino({ cx: w / 2, cy: 70, radius: 0, count: 0 })}
${Array.from({ length: 18 }, (_, i) => {
  const x = 60 + (i * (w - 120)) / 17;
  return `<circle cx="${x.toFixed(0)}" cy="${(h * 0.14).toFixed(0)}" r="1.6" fill="${P.gold}" opacity="0.35"/>`;
}).join("")}
${Array.from({ length: 18 }, (_, i) => {
  const x = 60 + (i * (w - 120)) / 17;
  return `<circle cx="${x.toFixed(0)}" cy="${(h * 0.86).toFixed(0)}" r="1.6" fill="${P.gold}" opacity="0.35"/>`;
}).join("")}

<!-- Ornate corner flourishes -->
${corner({ x: 60, y: 60, rotate: 0, size: 50 })}
${corner({ x: w - 60, y: 60, rotate: 90, size: 50 })}
${corner({ x: w - 60, y: h - 60, rotate: 180, size: 50 })}
${corner({ x: 60, y: h - 60, rotate: 270, size: 50 })}

<!-- Logo at top -->
${mark({ cx: w / 2, cy: topMarkY + topMarkSize / 2, size: topMarkSize })}

<!-- Brand name under logo -->
<text x="${w / 2}" y="${headerY + topMarkSize * 0.55}" font-family="${FONT_HEADING}" font-weight="700" font-size="${w * 0.038}" letter-spacing="${w * 0.004}" fill="${text}" text-anchor="middle">AMBAR &amp; LARIMAR</text>

<!-- PRODUCT PHOTO PLACEHOLDER ZONE (drop jewelry photo here) -->
<rect x="${zoneX}" y="${zoneY}" width="${zoneSize}" height="${zoneSize}" fill="${placeholderFill}" stroke="${placeholderStroke}" stroke-width="2" stroke-dasharray="10,6" rx="8"/>
<!-- Gold corner accents on the photo zone -->
<path d="M${zoneX},${zoneY + 30} L${zoneX},${zoneY} L${zoneX + 30},${zoneY}" stroke="${P.gold}" stroke-width="3" fill="none"/>
<path d="M${zoneX + zoneSize - 30},${zoneY} L${zoneX + zoneSize},${zoneY} L${zoneX + zoneSize},${zoneY + 30}" stroke="${P.gold}" stroke-width="3" fill="none"/>
<path d="M${zoneX + zoneSize},${zoneY + zoneSize - 30} L${zoneX + zoneSize},${zoneY + zoneSize} L${zoneX + zoneSize - 30},${zoneY + zoneSize}" stroke="${P.gold}" stroke-width="3" fill="none"/>
<path d="M${zoneX + 30},${zoneY + zoneSize} L${zoneX},${zoneY + zoneSize} L${zoneX},${zoneY + zoneSize - 30}" stroke="${P.gold}" stroke-width="3" fill="none"/>
<!-- Placeholder center text -->
<text x="${w / 2}" y="${zoneY + zoneSize / 2 - 8}" font-family="${FONT_UI}" font-size="${w * 0.025}" letter-spacing="${w * 0.003}" fill="${placeholderStroke}" text-anchor="middle" opacity="0.7">[ DROP JEWELRY PHOTO HERE ]</text>
<text x="${w / 2}" y="${zoneY + zoneSize / 2 + 24}" font-family="${FONT_UI}" font-size="${w * 0.015}" letter-spacing="${w * 0.002}" fill="${placeholderStroke}" text-anchor="middle" opacity="0.55">replace this rectangle in Canva/Photoshop</text>

<!-- Horizontal gold divider under photo -->
<line x1="${w * 0.2}" y1="${bottomY - 30}" x2="${w * 0.8}" y2="${bottomY - 30}" stroke="${P.gold}" stroke-width="1" opacity="0.6"/>
<circle cx="${w / 2}" cy="${bottomY - 30}" r="4" fill="${P.gold}"/>

<!-- Tagline -->
<text x="${w / 2}" y="${bottomY}" font-family="${FONT_BODY}" font-style="italic" font-size="${w * 0.026}" letter-spacing="${w * 0.003}" fill="${subtext}" text-anchor="middle">The rarest stones on Earth.</text>

<!-- Handle + URL -->
<text x="${w / 2}" y="${bottomY + 42}" font-family="${FONT_UI}" font-size="${w * 0.016}" letter-spacing="${w * 0.004}" fill="${subtext}" text-anchor="middle" opacity="0.85">@AMBARLARIMARSHOP · AMBARLARIMARSHOP.COM</text>

<!-- "DOMINICAN REPUBLIC" small text at very bottom -->
<text x="${w / 2}" y="${h - 50}" font-family="${FONT_UI}" font-size="${w * 0.013}" letter-spacing="${w * 0.006}" fill="${subtext}" text-anchor="middle" opacity="0.7">FINE CARIBBEAN JEWELRY · DOMINICAN REPUBLIC</text>
</svg>`;
}

// === BANNERS ===
const banners = [
  { name: "facebook-cover", w: 1200, h: 630 },
  { name: "twitter-header", w: 1500, h: 500 },
  { name: "linkedin-banner", w: 1584, h: 396 },
  { name: "youtube-banner", w: 2560, h: 1440 },
  { name: "pinterest-cover", w: 1000, h: 1500 },
  // Etsy
  { name: "etsy-banner-big", w: 3360, h: 840 },
  { name: "etsy-banner-mini", w: 1200, h: 300 },
  { name: "etsy-shop-icon", w: 500, h: 500, markSize: 440, layout: "center" },
];

console.log("== Banners ==");
for (const b of banners) {
  for (const theme of ["light", "dark"]) {
    const svg = makeBanner({ w: b.w, h: b.h, theme, markSize: b.markSize, layout: b.layout });
    const svgPath = join(OUT, "banners", `${b.name}-${theme}.svg`);
    writeFileSync(svgPath, svg);
    const pngPath = svgPath.replace(/\.svg$/, ".png");
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    console.log(`  ${b.name}-${theme} ${b.w}x${b.h}`);
  }
}

// Etsy featured listing template (product photo with branding frame — same as IG square but optimized for Etsy)
const etsyFeatured = [
  { name: "etsy-listing-template", w: 2000, h: 2000 },
];
for (const t of etsyFeatured) {
  for (const theme of ["light", "dark"]) {
    const svg = makeInstagram({ w: t.w, h: t.h, theme });
    const svgPath = join(OUT, "banners", `${t.name}-${theme}.svg`);
    writeFileSync(svgPath, svg);
    const pngPath = svgPath.replace(/\.svg$/, ".png");
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    console.log(`  ${t.name}-${theme} ${t.w}x${t.h}`);
  }
}

// === INSTAGRAM TEMPLATES ===
const igTemplates = [
  { name: "post-square", w: 1080, h: 1080 },
  { name: "post-portrait", w: 1080, h: 1350 },
  { name: "story", w: 1080, h: 1920 },
];

console.log("== Instagram ==");
for (const t of igTemplates) {
  for (const theme of ["light", "dark"]) {
    const svg = makeInstagram({ w: t.w, h: t.h, theme });
    const svgPath = join(OUT, "instagram", `${t.name}-${theme}.svg`);
    writeFileSync(svgPath, svg);
    const pngPath = svgPath.replace(/\.svg$/, ".png");
    await sharp(Buffer.from(svg)).png().toFile(pngPath);
    console.log(`  ${t.name}-${theme} ${t.w}x${t.h}`);
  }
}

console.log("\nDone. Kit in", OUT);
