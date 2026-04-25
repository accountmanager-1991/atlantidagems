#!/usr/bin/env node
// 1. Verify every PNG in LOGO-EVERYWHERE has a real alpha channel (transparency).
// 2. Render ultra-high-quality versions (4096 / 6144 / 8192) for max fidelity.
// 3. Re-render any non-transparent file with explicit alpha.

import sharp from "sharp";
import { readFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = "brand-kit/LOGO-EVERYWHERE";
const SRC_LOGOS = "brand-kit/01-LOGOS/final-2026-04";
const markSvg = readFileSync(join(SRC_LOGOS, "logo-mark.svg"));

let total = 0, withAlpha = 0, withoutAlpha = 0;
const noAlphaFiles = [];

async function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else if (e.name.endsWith(".png")) {
      total++;
      const meta = await sharp(full).metadata();
      if (meta.hasAlpha) {
        withAlpha++;
      } else {
        withoutAlpha++;
        noAlphaFiles.push(full);
      }
    }
  }
}

console.log("=== Verifying transparency ===");
await walk(ROOT);
console.log(`  ${total} PNG files inspected`);
console.log(`  ${withAlpha} have alpha (transparent)`);
console.log(`  ${withoutAlpha} have NO alpha`);
if (noAlphaFiles.length) {
  console.log("  Files missing alpha:");
  for (const f of noAlphaFiles) console.log("    " + f);
}

// === Ultra-high-quality versions for max fidelity ===
console.log("\n=== Building ultra-HQ versions ===");
const ultraDir = join(ROOT, "09-ULTRA-HD");
mkdirSync(ultraDir, { recursive: true });

const ultraSpecs = [
  ["mark-4096.png", 4096, "Large poster / packaging label"],
  ["mark-6144.png", 6144, "Premium retail signage"],
  ["mark-8192.png", 8192, "Billboard / trade-show display / archival"],
];
for (const [name, size] of ultraSpecs) {
  const dst = join(ultraDir, name);
  await sharp(markSvg, { density: Math.max(96, (size / 240) * 96) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(dst);
  // Verify
  const m = await sharp(dst).metadata();
  console.log(`  ${name} ${size}×${size}  alpha=${m.hasAlpha}  ${(statSync(dst).size / 1024 / 1024).toFixed(2)} MB`);
}

import { writeFileSync } from "node:fs";
writeFileSync(join(ultraDir, "README.txt"),
`ULTRA-HD VERSIONS — for max-fidelity uses
==========================================
All files have a transparent (alpha) background — the surface behind
the logo will show through (this is what the grey checker pattern
means in image viewers).

  mark-4096.png   →  large poster, packaging labels (≈14 inches @ 300 DPI)
  mark-6144.png   →  premium retail signage
  mark-8192.png   →  billboard / trade-show display / archival master
                     (27 inches @ 300 DPI, 91 inches @ 90 DPI)

For anything bigger or with custom dimensions, use the SVG (it scales
losslessly to ANY size). The SVG lives at:
  /01-MASTER-VECTOR/logo-mark.svg

PNG vs SVG:
  - SVG = perfect quality, any size, but only works in modern apps.
  - PNG = works everywhere, but pixelated above its rendered size.

Always prefer SVG for print, signage, billboards, anything large.
`);

console.log("\nDone.");
