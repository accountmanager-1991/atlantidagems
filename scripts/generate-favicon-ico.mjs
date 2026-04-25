// Generates a proper multi-resolution favicon.ico from the master logo SVG.
// ICO files can hold multiple sizes — 16, 32, 48 — so OSes and crawlers
// each pick the best fit. Saved to src/app/favicon.ico (Next.js convention)
// AND public/favicon.ico for legacy /favicon.ico requests.

import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const masterSvg = readFileSync("brand-kit/01-LOGOS/final-2026-04/logo-mark.svg");

// Render PNGs at three sizes, all transparent
async function pngBuf(size) {
  return await sharp(masterSvg, { density: Math.max(96, (size / 240) * 96) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

console.log("Rendering PNGs...");
const pngs = await Promise.all([16, 32, 48].map(pngBuf));

console.log("Packing ICO...");
const ico = await pngToIco(pngs);

// Next.js prefers src/app/favicon.ico (auto-served at /favicon.ico)
mkdirSync("src/app", { recursive: true });
writeFileSync("src/app/favicon.ico", ico);
console.log(`  src/app/favicon.ico  (${ico.length} bytes, 16+32+48px)`);

// Also place a copy in public/ as a backup
writeFileSync("public/favicon.ico", ico);
console.log(`  public/favicon.ico  (${ico.length} bytes, 16+32+48px)`);

console.log("\nDone. Commit + redeploy and the Google search favicon will eventually update.");
console.log("To accelerate: open Google Search Console → URL Inspection → request indexing.");
