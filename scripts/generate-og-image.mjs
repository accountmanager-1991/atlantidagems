#!/usr/bin/env node
// Generate a STATIC og-image.png served at /og-image.png.
// Static = always works, no edge runtime, no fetch failures, no Vercel fallback.
// Saved straight to public/ so it ships with the build.

import sharp from "sharp";
import { readFileSync } from "node:fs";

const W = 1200, H = 630;
const markSvg = readFileSync("brand-kit/01-LOGOS/final-2026-04/logo-mark.svg");

// Build the OG image as one big SVG with the logo embedded inline.
// Fonts: Georgia (system-installed everywhere — sharp will find it).
// All brand colors hardcoded so no env vars or runtime fetching.
const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <radialGradient id="bg" cx="50%" cy="50%" r="80%">
    <stop offset="0%" stop-color="#1A2A3E"/>
    <stop offset="60%" stop-color="#0C1420"/>
    <stop offset="100%" stop-color="#08080E"/>
  </radialGradient>
  <linearGradient id="goldG" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#F5E5B5"/>
    <stop offset="50%" stop-color="#C9A84C"/>
    <stop offset="100%" stop-color="#8A6418"/>
  </linearGradient>
</defs>

<!-- Radial-gradient navy background -->
<rect width="${W}" height="${H}" fill="url(#bg)"/>

<!-- Decorative gold dot border -->
${Array.from({ length: 28 }, (_, i) => {
  const x = 70 + (i * (W - 140)) / 27;
  return `<circle cx="${x.toFixed(0)}" cy="40" r="2.5" fill="#C9A84C" opacity="0.7"/>` +
         `<circle cx="${x.toFixed(0)}" cy="${H - 40}" r="2.5" fill="#C9A84C" opacity="0.7"/>`;
}).join("")}

<!-- Logo seal (left side) -->
<svg x="80" y="${(H - 360) / 2}" width="360" height="360" viewBox="0 0 240 240">
  ${readFileSync("brand-kit/01-LOGOS/final-2026-04/logo-mark.svg", "utf8")
    .replace(/<\?xml[^?]*\?>/, "")
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>/, "")}
</svg>

<!-- Wordmark (right side) -->
<text x="500" y="${H / 2 - 50}" font-family="Georgia, serif" font-weight="700" font-size="72" letter-spacing="6" fill="#FAF7F0">AMBAR &amp;</text>
<text x="500" y="${H / 2 + 30}" font-family="Georgia, serif" font-weight="700" font-size="72" letter-spacing="6" fill="#FAF7F0">LARIMAR</text>
<text x="500" y="${H / 2 + 100}" font-family="Georgia, serif" font-style="italic" font-size="48" letter-spacing="14" fill="#EDD8A0">Shop</text>

<!-- Gold accent bar between brand and tagline -->
<line x1="500" y1="${H / 2 + 130}" x2="700" y2="${H / 2 + 130}" stroke="#C9A84C" stroke-width="1.2"/>

<!-- Tagline -->
<text x="500" y="${H / 2 + 168}" font-family="Helvetica, Arial, sans-serif" font-size="20" letter-spacing="6" fill="#C9A84C">THE RAREST STONES ON EARTH</text>

<!-- Bottom small text -->
<text x="${W / 2}" y="${H - 60}" font-family="Helvetica, Arial, sans-serif" font-size="14" letter-spacing="6" fill="#EDD8A0" opacity="0.7" text-anchor="middle">FINE CARIBBEAN JEWELRY · DOMINICAN REPUBLIC</text>
</svg>`;

await sharp(Buffer.from(og), { density: 144 })
  .resize(W, H)
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile("public/og-image.png");

const meta = await sharp("public/og-image.png").metadata();
console.log(`Generated public/og-image.png — ${meta.width}×${meta.height}, ${meta.format}, alpha=${meta.hasAlpha || false}`);
