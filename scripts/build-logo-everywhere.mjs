#!/usr/bin/env node
// Build a single consolidated folder with the FINAL logo in every form
// it could be needed: master vectors, per-platform profile pics, favicons,
// app store icons, print sizes, watermark overlays, email signatures.
//
// Each file is named for its specific use, so the user can drag-and-drop
// the right one straight into a platform's upload field without thinking.

import sharp from "sharp";
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "brand-kit/LOGO-EVERYWHERE";
const SRC_LOGOS = "brand-kit/01-LOGOS/final-2026-04";
const SRC_PNG = join(SRC_LOGOS, "png");

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

function safeCopy(src, dst) {
  mkdirSync(dst.replace(/[\\/][^\\/]+$/, ""), { recursive: true });
  if (existsSync(dst)) {
    try {
      const s = statSync(dst);
      if (s.isDirectory()) rmSync(dst, { recursive: true, force: true });
      else rmSync(dst, { force: true });
    } catch {}
  }
  try { copyFileSync(src, dst); }
  catch (e) {
    if (e.code === "EPERM" || e.code === "EBUSY") {
      writeFileSync(dst, readFileSync(src));
    } else { throw e; }
  }
}

// Render a custom-sized PNG from the master SVG when we don't already have it
const markSvg = readFileSync(join(SRC_LOGOS, "logo-mark.svg"));
async function renderMark(size, dst) {
  mkdirSync(dst.replace(/[\\/][^\\/]+$/, ""), { recursive: true });
  await sharp(markSvg, { density: Math.max(72, (size / 240) * 96) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(dst);
}

// ============================================================
// 01 - MASTER VECTOR (always prefer SVG when accepted)
// ============================================================
const v01 = join(OUT, "01-MASTER-VECTOR");
safeCopy(join(SRC_LOGOS, "logo-mark.svg"), join(v01, "logo-mark.svg"));
safeCopy(join(SRC_LOGOS, "logo-horizontal.svg"), join(v01, "logo-horizontal.svg"));
writeFileSync(join(v01, "README.txt"),
`MASTER VECTOR FILES
====================
Use these wherever the platform accepts a vector file (SVG, EPS, PDF).
Vector files scale to any size with no quality loss.

  logo-mark.svg        — the circular seal (primary use)
  logo-horizontal.svg  — seal + "AMBAR & LARIMAR / Shop" wordmark side-by-side

WHEN TO USE WHICH:
  - Use logo-mark.svg for square or circular contexts (profile pics, favicons,
    app icons, stickers, anywhere you need just the seal)
  - Use logo-horizontal.svg when you have a wide horizontal space and want
    the brand name spelled out (website headers, email signatures, banners)
`);

// ============================================================
// 02 - PROFILE PICTURES (per platform, with platform-correct sizes)
// ============================================================
const v02 = join(OUT, "02-PROFILE-PICTURES");
console.log("Building 02-PROFILE-PICTURES...");
const profileSpecs = [
  // [filename, size, platform, note]
  ["instagram-profile-400.png", 400, "Instagram", "Min 320×320, recommended 400×400"],
  ["instagram-profile-1080.png", 1080, "Instagram", "Retina / max quality"],
  ["facebook-profile-512.png", 512, "Facebook", "Page profile picture (any size 180+)"],
  ["facebook-group-512.png", 512, "Facebook Groups", "Same"],
  ["tiktok-profile-400.png", 400, "TikTok", "Min 200×200"],
  ["x-twitter-profile-400.png", 400, "X / Twitter", "Max 400×400"],
  ["linkedin-page-logo-400.png", 400, "LinkedIn Page", "300×300+ recommended"],
  ["linkedin-personal-400.png", 400, "LinkedIn Personal", "400×400 ideal"],
  ["pinterest-profile-400.png", 400, "Pinterest", "Min 165×165"],
  ["youtube-channel-800.png", 800, "YouTube", "Min 800×800 for channel avatar"],
  ["etsy-shop-500.png", 500, "Etsy", "Required exactly 500×500"],
  ["whatsapp-business-640.png", 640, "WhatsApp Business", "Catalog / business profile"],
  ["snapchat-320.png", 320, "Snapchat", "Bitmoji / profile area"],
  ["google-business-720.png", 720, "Google Business", "Cover / profile"],
  ["discord-512.png", 512, "Discord", "Server icon"],
  ["telegram-512.png", 512, "Telegram", "Channel / group photo"],
];
for (const [name, size] of profileSpecs) {
  await renderMark(size, join(v02, name));
}
writeFileSync(join(v02, "README.txt"),
`PROFILE PICTURES — ONE FILE PER PLATFORM
==========================================
Each file is named for its target platform and pre-sized correctly.
Drag-and-drop straight into the platform's upload field.

` + profileSpecs.map(([name, , platform, note]) => `  ${name.padEnd(36)} → ${platform.padEnd(20)} (${note})`).join("\n"));

// ============================================================
// 03 - FAVICONS (web)
// ============================================================
const v03 = join(OUT, "03-FAVICONS-WEB");
console.log("Building 03-FAVICONS-WEB...");
safeCopy(join(SRC_PNG, "favicon-16.png"), join(v03, "favicon-16.png"));
safeCopy(join(SRC_PNG, "favicon-32.png"), join(v03, "favicon-32.png"));
safeCopy(join(SRC_PNG, "favicon-48.png"), join(v03, "favicon-48.png"));
safeCopy(join(SRC_PNG, "favicon-192.png"), join(v03, "favicon-192.png"));
safeCopy(join(SRC_PNG, "apple-touch-icon.png"), join(v03, "apple-touch-icon-180.png"));
await renderMark(96, join(v03, "favicon-96.png"));
writeFileSync(join(v03, "README.txt"),
`WEB FAVICONS
=============
Drop these into the /public folder of any website (or root).

  favicon-16.png             → browser tab (legacy)
  favicon-32.png             → browser tab (standard)
  favicon-48.png             → Windows site icon
  favicon-96.png             → Edge / desktop shortcut
  favicon-192.png            → Android home screen / PWA
  apple-touch-icon-180.png   → iOS home screen

In your HTML <head>:
  <link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192">
  <link rel="apple-touch-icon" href="/apple-touch-icon-180.png">
`);

// ============================================================
// 04 - APP ICONS (PWA, App Store, Play Store)
// ============================================================
const v04 = join(OUT, "04-APP-ICONS");
console.log("Building 04-APP-ICONS...");
const appSpecs = [
  ["pwa-192.png", 192, "PWA / Android home"],
  ["pwa-512.png", 512, "PWA splash / Android"],
  ["ios-app-store-1024.png", 1024, "iOS App Store (required exact 1024×1024)"],
  ["android-play-store-512.png", 512, "Google Play Store"],
  ["maskable-512.png", 512, "PWA maskable icon (Android)"],
];
for (const [name, size] of appSpecs) {
  await renderMark(size, join(v04, name));
}
writeFileSync(join(v04, "README.txt"),
`APP / PWA ICONS
================
` + appSpecs.map(([n, , use]) => `  ${n.padEnd(32)} → ${use}`).join("\n") + `

For PWA manifest.json:
  {
    "icons": [
      { "src": "/pwa-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/pwa-512.png", "sizes": "512x512", "type": "image/png" },
      { "src": "/maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
    ]
  }
`);

// ============================================================
// 05 - PRINT-LARGE (high-resolution PNGs for print and big displays)
// ============================================================
const v05 = join(OUT, "05-PRINT-LARGE");
console.log("Building 05-PRINT-LARGE...");
safeCopy(join(SRC_PNG, "mark-512.png"), join(v05, "mark-512.png"));
safeCopy(join(SRC_PNG, "mark-1024.png"), join(v05, "mark-1024.png"));
safeCopy(join(SRC_PNG, "mark-2048.png"), join(v05, "mark-2048.png"));
safeCopy(join(SRC_PNG, "horizontal-1200.png"), join(v05, "horizontal-1200.png"));
safeCopy(join(SRC_PNG, "horizontal-1600.png"), join(v05, "horizontal-1600.png"));
safeCopy(join(SRC_PNG, "horizontal-2400.png"), join(v05, "horizontal-2400.png"));
await renderMark(4096, join(v05, "mark-4096.png"));
writeFileSync(join(v05, "README.txt"),
`PRINT-LARGE — high-resolution PNGs
=====================================
For print materials, large displays, packaging stickers, posters.

  mark-512.png         → small product tags / hang tags
  mark-1024.png        → letterhead, gift cards
  mark-2048.png        → packaging / labels (4×4 inch print at 300 DPI)
  mark-4096.png        → posters / large banners
  horizontal-1200.png  → letterhead / business stationery
  horizontal-1600.png  → branded notepads
  horizontal-2400.png  → trade-show banners

For print, prefer the SVG (in /01-MASTER-VECTOR/) whenever possible.
PNGs are provided for printers that don't accept SVG.
`);

// ============================================================
// 06 - WATERMARK / OVERLAY (semi-transparent for product photos)
// ============================================================
const v06 = join(OUT, "06-WATERMARK-OVERLAY");
console.log("Building 06-WATERMARK-OVERLAY...");
async function makeWatermark(size, dst) {
  mkdirSync(dst.replace(/[\\/][^\\/]+$/, ""), { recursive: true });
  await sharp(markSvg, { density: Math.max(72, (size / 240) * 96) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .composite([{
      input: Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="white" opacity="0.55"/></svg>`),
      blend: "dest-in",
    }])
    .png()
    .toFile(dst);
}
await makeWatermark(128, join(v06, "watermark-128.png"));
await makeWatermark(256, join(v06, "watermark-256.png"));
await makeWatermark(512, join(v06, "watermark-512.png"));
writeFileSync(join(v06, "README.txt"),
`WATERMARK / OVERLAY
====================
55% opacity versions of the seal, ready to drop onto product photography
to discourage screenshot reuse / theft.

  watermark-128.png    → small overlay (mobile thumbnails)
  watermark-256.png    → standard product photo overlay
  watermark-512.png    → large / banner overlay

Tip: place in a corner (e.g., bottom-right) at 10-15% of the photo width
for a tasteful brand stamp without covering the product.
`);

// ============================================================
// 07 - EMAIL SIGNATURE (horizontal lockup, web-display sizes)
// ============================================================
const v07 = join(OUT, "07-EMAIL-SIGNATURE");
console.log("Building 07-EMAIL-SIGNATURE...");
safeCopy(join(SRC_PNG, "horizontal-600.png"), join(v07, "email-signature-600.png"));
safeCopy(join(SRC_PNG, "horizontal-900.png"), join(v07, "email-signature-900.png"));
writeFileSync(join(v07, "README.txt"),
`EMAIL SIGNATURE
================
Horizontal lockup at email-friendly sizes (Gmail / Outlook / Apple Mail
auto-shrink images to ~600px wide max).

  email-signature-600.png   → standard signature
  email-signature-900.png   → high-DPI / retina display

Embed in Gmail signature: Settings → General → Signature → Insert image.
Embed in Outlook: File → Options → Mail → Signatures → Picture icon.
`);

// ============================================================
// 08 - SOCIAL POST OVERLAYS (the brand mark for stamping content)
// ============================================================
const v08 = join(OUT, "08-CONTENT-STAMPS");
console.log("Building 08-CONTENT-STAMPS...");
safeCopy(join(SRC_PNG, "mark-128.png"), join(v08, "stamp-small-128.png"));
safeCopy(join(SRC_PNG, "mark-256.png"), join(v08, "stamp-medium-256.png"));
safeCopy(join(SRC_PNG, "mark-400.png"), join(v08, "stamp-large-400.png"));
writeFileSync(join(v08, "README.txt"),
`CONTENT STAMPS
===============
Solid (non-watermark) versions of the seal for stamping into Reels,
TikToks, Pinterest pins, infographics — anywhere you want the brand
mark visible at a small size.

  stamp-small-128.png    → corner of a Reel / story
  stamp-medium-256.png   → IG carousel slide
  stamp-large-400.png    → infographic header

For semi-transparent overlay use, use /06-WATERMARK-OVERLAY/ instead.
`);

// ============================================================
// TOP-LEVEL README
// ============================================================
writeFileSync(join(OUT, "README.txt"),
`AMBAR & LARIMAR SHOP — LOGO EVERYWHERE
========================================
2026-04 release · "Caribbean Sun" Concept A logo

This is the consolidated logo folder — every file you'll need, named
for its specific use case. Just open the right subfolder, find the
right file, drag it where it needs to go.

FOLDERS:
  01-MASTER-VECTOR         → SVG sources (use these whenever possible)
  02-PROFILE-PICTURES      → One file per social platform, sized correctly
  03-FAVICONS-WEB          → Browser tab icons + Apple touch icon
  04-APP-ICONS             → PWA / iOS / Android app icons
  05-PRINT-LARGE           → High-res PNGs for print and big displays
  06-WATERMARK-OVERLAY     → 55% opacity stamps for product photos
  07-EMAIL-SIGNATURE       → Horizontal lockup for email clients
  08-CONTENT-STAMPS        → Solid mark for stamping social content

QUICK GUIDE — what to upload where:

   Instagram profile     → 02-PROFILE-PICTURES/instagram-profile-400.png
   Facebook page         → 02-PROFILE-PICTURES/facebook-profile-512.png
   TikTok profile        → 02-PROFILE-PICTURES/tiktok-profile-400.png
   YouTube channel       → 02-PROFILE-PICTURES/youtube-channel-800.png
   Etsy shop icon        → 02-PROFILE-PICTURES/etsy-shop-500.png
   X / Twitter profile   → 02-PROFILE-PICTURES/x-twitter-profile-400.png
   LinkedIn page         → 02-PROFILE-PICTURES/linkedin-page-logo-400.png
   Pinterest profile     → 02-PROFILE-PICTURES/pinterest-profile-400.png
   WhatsApp Business     → 02-PROFILE-PICTURES/whatsapp-business-640.png

   Website favicon       → 03-FAVICONS-WEB/favicon-32.png
   iPhone home screen    → 03-FAVICONS-WEB/apple-touch-icon-180.png
   PWA / Android         → 04-APP-ICONS/pwa-512.png
   App Store submission  → 04-APP-ICONS/ios-app-store-1024.png
   Google Play           → 04-APP-ICONS/android-play-store-512.png

   Email signature       → 07-EMAIL-SIGNATURE/email-signature-600.png
   Letterhead / print    → 05-PRINT-LARGE/horizontal-1600.png
   Hang tag / sticker    → 05-PRINT-LARGE/mark-1024.png
   Product photo stamp   → 06-WATERMARK-OVERLAY/watermark-256.png
   Reel / TikTok corner  → 08-CONTENT-STAMPS/stamp-small-128.png

To upload to Google Drive: drag this entire LOGO-EVERYWHERE folder
into Drive. The structure (numbered folders, READMEs in each) carries
across.

To regenerate this folder: node scripts/build-logo-everywhere.mjs
`);

console.log(`\nBuilt ${OUT}/`);
