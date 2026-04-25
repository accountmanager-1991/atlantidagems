#!/usr/bin/env node
// Export PNGs at every standard size from the master SVGs.
// Renders with a transparent background so the logo works on any surface.

import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "brand-kit/01-LOGOS/final-2026-04/png";
mkdirSync(OUT_DIR, { recursive: true });

const markSvg = readFileSync("brand-kit/01-LOGOS/final-2026-04/logo-mark.svg");
const horizontalSvg = readFileSync("brand-kit/01-LOGOS/final-2026-04/logo-horizontal.svg");

// Square sizes for the circular seal: used as profile pics, app icons, favicons.
const markSizes = [32, 48, 64, 128, 180, 192, 256, 320, 400, 512, 800, 1024, 2048];
// Horizontal wordmark sizes (width-based): used for site headers, email signatures, banners.
const horizontalWidths = [600, 900, 1200, 1600, 2400];

console.log("== Exporting seal (square) ==");
for (const size of markSizes) {
  const file = join(OUT_DIR, `mark-${size}.png`);
  await sharp(markSvg, { density: Math.max(72, (size / 240) * 96) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file);
  console.log(`  ${file}`);
}

console.log("== Exporting horizontal wordmark ==");
for (const w of horizontalWidths) {
  const h = Math.round(w * (240 / 900));
  const file = join(OUT_DIR, `horizontal-${w}.png`);
  await sharp(horizontalSvg, { density: Math.max(72, (w / 900) * 96) })
    .resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(file);
  console.log(`  ${file}`);
}

console.log("== Favicon / touch icons ==");
// Favicon sizes commonly used
const faviconMap = {
  "favicon-16.png": 16,
  "favicon-32.png": 32,
  "favicon-48.png": 48,
  "favicon-192.png": 192,
  "apple-touch-icon.png": 180, // Apple standard
};
for (const [name, size] of Object.entries(faviconMap)) {
  const file = join(OUT_DIR, name);
  await sharp(markSvg, { density: Math.max(72, (size / 240) * 96) })
    .resize(size, size)
    .png()
    .toFile(file);
  console.log(`  ${file}`);
}

console.log("\nDone. Files in", OUT_DIR);
