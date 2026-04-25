#!/usr/bin/env node
// Reorganize the brand kit into platform-specific folders ready for Google Drive upload.
// Each folder contains all relevant SVG/PNG assets + a README explaining usage.

import { mkdirSync, copyFileSync, writeFileSync, readdirSync, readFileSync, statSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const SRC_LOGOS = "brand-kit/01-LOGOS/final-2026-04";
const SRC_SOCIAL = "brand-kit/02-SOCIAL-2026-04";
const SRC_CARD = "brand-kit/03-BUSINESS-CARD-2026-04";
const SRC_GUIDE = "brand-kit/00-BRAND-GUIDE";

const ROOT = "brand-kit/google-drive-ready";
// Wipe & recreate
if (existsSync(ROOT)) rmSync(ROOT, { recursive: true, force: true });
mkdirSync(ROOT, { recursive: true });

function copy(src, dst) {
  mkdirSync(dst.replace(/\/[^/]+$/, ""), { recursive: true });
  // OneDrive can leave stub directories where files should be — wipe and retry.
  if (existsSync(dst)) {
    try {
      const s = statSync(dst);
      if (s.isDirectory()) rmSync(dst, { recursive: true, force: true });
      else rmSync(dst, { force: true });
    } catch { /* ignore */ }
  }
  try {
    copyFileSync(src, dst);
  } catch (e) {
    if (e.code === "EPERM" || e.code === "EBUSY") {
      writeFileSync(dst, readFileSync(src));
    } else {
      throw e;
    }
  }
}

// ----- 00-BRAND-CORE -----
const core = join(ROOT, "00-BRAND-CORE");
mkdirSync(core, { recursive: true });
copy(join(SRC_GUIDE, "Ambar-Larimar-Brand-Guide.pdf"), join(core, "Ambar-Larimar-Brand-Guide.pdf"));
// Master logo SVGs
copy(join(SRC_LOGOS, "logo-mark.svg"), join(core, "logo-mark.svg"));
copy(join(SRC_LOGOS, "logo-horizontal.svg"), join(core, "logo-horizontal.svg"));
// Common PNGs
["mark-2048.png", "mark-1024.png", "mark-512.png", "mark-256.png", "horizontal-2400.png", "horizontal-1200.png"].forEach((f) => {
  copy(join(SRC_LOGOS, "png", f), join(core, f));
});
writeFileSync(join(core, "README.txt"),
`AMBAR & LARIMAR SHOP — BRAND CORE
==================================
Read the PDF first.

Files:
  Ambar-Larimar-Brand-Guide.pdf  — full brand book (palette, type, logo, social specs)
  logo-mark.svg                  — primary seal, vector source
  logo-horizontal.svg            — wordmark + seal lockup, vector source
  mark-{size}.png                — seal as PNG at common sizes
  horizontal-{width}.png         — horizontal lockup PNGs

Use the SVGs in any design tool that accepts vectors. PNGs are ready for upload.
`);

// ----- 01-FACEBOOK -----
const fb = join(ROOT, "01-FACEBOOK");
mkdirSync(fb, { recursive: true });
["facebook-cover-light.png", "facebook-cover-light.svg", "facebook-cover-dark.png", "facebook-cover-dark.svg"].forEach((f) => copy(join(SRC_SOCIAL, "banners", f), join(fb, f)));
copy(join(SRC_LOGOS, "png", "mark-512.png"), join(fb, "profile-pic-512.png"));
copy(join(SRC_LOGOS, "png", "mark-400.png"), join(fb, "profile-pic-400.png"));
writeFileSync(join(fb, "README.txt"),
`FACEBOOK — Ambar & Larimar Shop
================================

Profile picture (square):  profile-pic-512.png  (or 400 for legacy)
Page cover photo:          facebook-cover-light.png  (or -dark.png)

Light = cream background, editorial / luxury feel.
Dark  = navy radial gradient, bolder.

Cover dimensions: 1200 × 630 (Facebook scales to 820×312 on desktop).
`);

// ----- 02-INSTAGRAM -----
const ig = join(ROOT, "02-INSTAGRAM");
mkdirSync(ig, { recursive: true });
["post-square-light", "post-square-dark", "post-portrait-light", "post-portrait-dark", "story-light", "story-dark"].forEach((b) => {
  ["png", "svg"].forEach((ext) => copy(join(SRC_SOCIAL, "instagram", `${b}.${ext}`), join(ig, `${b}.${ext}`)));
});
copy(join(SRC_LOGOS, "png", "mark-400.png"), join(ig, "profile-pic-400.png"));
copy(join(SRC_LOGOS, "png", "mark-512.png"), join(ig, "profile-pic-512.png"));
writeFileSync(join(ig, "README.txt"),
`INSTAGRAM — Ambar & Larimar Shop
=================================

Profile picture (320+):     profile-pic-400.png  or  profile-pic-512.png

POST TEMPLATES (drop your jewelry photo in the dashed center zone):
  post-square-light.svg     1080 × 1080  (feed post, light)
  post-square-dark.svg      1080 × 1080  (feed post, dark)
  post-portrait-light.svg   1080 × 1350  (portrait feed post)
  post-portrait-dark.svg    1080 × 1350
  story-light.svg           1080 × 1920  (story / Reel cover)
  story-dark.svg            1080 × 1920

How to use:
  1. Open the SVG in Canva, Figma, Illustrator or Photoshop.
  2. Delete the dashed placeholder rectangle in the center.
  3. Add your jewelry photo behind the gold corner brackets.
  4. Crop your photo to a square so it fits inside the frame area.
  5. Export as JPG/PNG and upload to Instagram.
`);

// ----- 03-TIKTOK -----
const tt = join(ROOT, "03-TIKTOK");
mkdirSync(tt, { recursive: true });
copy(join(SRC_LOGOS, "png", "mark-400.png"), join(tt, "profile-pic-400.png"));
copy(join(SRC_SOCIAL, "instagram", "story-light.png"), join(tt, "video-overlay-light.png"));
copy(join(SRC_SOCIAL, "instagram", "story-dark.png"), join(tt, "video-overlay-dark.png"));
writeFileSync(join(tt, "README.txt"),
`TIKTOK — Ambar & Larimar Shop
==============================

Profile picture (200×200 min):  profile-pic-400.png

TikTok doesn't have a banner. The story templates (1080×1920) work great as Reel-style overlays — you can use them as transition frames in your videos or as the cover thumbnail.

  video-overlay-light.png  1080 × 1920
  video-overlay-dark.png   1080 × 1920
`);

// ----- 04-X-TWITTER -----
const tw = join(ROOT, "04-X-TWITTER");
mkdirSync(tw, { recursive: true });
["twitter-header-light.png", "twitter-header-light.svg", "twitter-header-dark.png", "twitter-header-dark.svg"].forEach((f) => copy(join(SRC_SOCIAL, "banners", f), join(tw, f)));
copy(join(SRC_LOGOS, "png", "mark-400.png"), join(tw, "profile-pic-400.png"));
writeFileSync(join(tw, "README.txt"),
`X / TWITTER — Ambar & Larimar Shop
===================================

Profile picture:  profile-pic-400.png   (X displays at 400×400 max)
Header banner:    twitter-header-{light|dark}.png   1500 × 500
`);

// ----- 05-LINKEDIN -----
const li = join(ROOT, "05-LINKEDIN");
mkdirSync(li, { recursive: true });
["linkedin-banner-light.png", "linkedin-banner-light.svg", "linkedin-banner-dark.png", "linkedin-banner-dark.svg"].forEach((f) => copy(join(SRC_SOCIAL, "banners", f), join(li, f)));
copy(join(SRC_LOGOS, "png", "mark-400.png"), join(li, "page-logo-400.png"));
writeFileSync(join(li, "README.txt"),
`LINKEDIN — Ambar & Larimar Shop
================================

Page logo:        page-logo-400.png
Page banner:      linkedin-banner-{light|dark}.png   1584 × 396
`);

// ----- 06-YOUTUBE -----
const yt = join(ROOT, "06-YOUTUBE");
mkdirSync(yt, { recursive: true });
["youtube-banner-light.png", "youtube-banner-light.svg", "youtube-banner-dark.png", "youtube-banner-dark.svg"].forEach((f) => copy(join(SRC_SOCIAL, "banners", f), join(yt, f)));
copy(join(SRC_LOGOS, "png", "mark-800.png"), join(yt, "channel-avatar-800.png"));
writeFileSync(join(yt, "README.txt"),
`YOUTUBE — Ambar & Larimar Shop
===============================

Channel avatar (800+):  channel-avatar-800.png
Channel banner:         youtube-banner-{light|dark}.png   2560 × 1440
                        (safe area for text/logo: center 1546 × 423)
`);

// ----- 07-PINTEREST -----
const pt = join(ROOT, "07-PINTEREST");
mkdirSync(pt, { recursive: true });
["pinterest-cover-light.png", "pinterest-cover-light.svg", "pinterest-cover-dark.png", "pinterest-cover-dark.svg"].forEach((f) => copy(join(SRC_SOCIAL, "banners", f), join(pt, f)));
copy(join(SRC_LOGOS, "png", "mark-400.png"), join(pt, "profile-pic-400.png"));
writeFileSync(join(pt, "README.txt"),
`PINTEREST — Ambar & Larimar Shop
=================================

Profile picture:  profile-pic-400.png   (Pinterest min 165×165)
Branded pin:      pinterest-cover-{light|dark}.png   1000 × 1500
                  (use as a pin template — vertical 2:3 ratio)
`);

// ----- 08-ETSY -----
const etsy = join(ROOT, "08-ETSY");
mkdirSync(etsy, { recursive: true });
["etsy-shop-icon-light.png", "etsy-shop-icon-light.svg", "etsy-shop-icon-dark.png", "etsy-shop-icon-dark.svg",
 "etsy-banner-big-light.png", "etsy-banner-big-light.svg", "etsy-banner-big-dark.png", "etsy-banner-big-dark.svg",
 "etsy-banner-mini-light.png", "etsy-banner-mini-light.svg", "etsy-banner-mini-dark.png", "etsy-banner-mini-dark.svg",
 "etsy-listing-template-light.png", "etsy-listing-template-light.svg", "etsy-listing-template-dark.png", "etsy-listing-template-dark.svg"
].forEach((f) => copy(join(SRC_SOCIAL, "banners", f), join(etsy, f)));
writeFileSync(join(etsy, "README.txt"),
`ETSY — Ambar & Larimar Shop
============================

REQUIRED:
  Shop icon:           etsy-shop-icon-{light|dark}.png   500 × 500
                       (shows on listing cards, messages, and shop page)

BANNERS (choose one based on your shop layout):
  Big banner (new):    etsy-banner-big-{light|dark}.png   3360 × 840
  Mini banner (old):   etsy-banner-mini-{light|dark}.png  1200 × 300

LISTING PHOTO TEMPLATE:
  etsy-listing-template-{light|dark}.png   2000 × 2000
  Drop your jewelry photo in the center zone — this becomes the main
  branded listing image (the one customers see in search results).
`);

// ----- 09-BUSINESS-CARD -----
const bc = join(ROOT, "09-BUSINESS-CARD");
mkdirSync(bc, { recursive: true });
["card-front-light.png", "card-front-light.svg", "card-front-dark.png", "card-front-dark.svg",
 "card-back-light.png", "card-back-light.svg", "card-back-dark.png", "card-back-dark.svg",
 "README.txt"
].forEach((f) => copy(join(SRC_CARD, f), join(bc, f)));

// ----- TOP-LEVEL README -----
writeFileSync(join(ROOT, "README.txt"),
`AMBAR & LARIMAR SHOP — GOOGLE DRIVE BRAND KIT
==============================================
2026-04 release · concept A "Caribbean Sun" identity

To upload to Google Drive:
  1. Open this folder (brand-kit/google-drive-ready/) in your file explorer.
  2. Drag the entire folder into Google Drive — it'll preserve the structure.
     OR drag each numbered subfolder individually into Drive.

Folders:
  00-BRAND-CORE     — start here. Read the PDF guide. Master logo files.
  01-FACEBOOK       — page profile + cover banner (light & dark)
  02-INSTAGRAM      — profile + post / story templates (light & dark)
  03-TIKTOK         — profile + Reel overlay templates
  04-X-TWITTER      — profile + header banner
  05-LINKEDIN       — page logo + banner
  06-YOUTUBE        — channel avatar + banner
  07-PINTEREST      — profile + branded pin template
  08-ETSY           — shop icon + banner + listing photo template
  09-BUSINESS-CARD  — print-ready front + back, light & dark

Every folder has its own README explaining what each file is for.
Each visual asset comes in two themes: LIGHT (cream background) or DARK (navy).

Regenerate the kit anytime:
  node scripts/export-logo-pngs.mjs
  node scripts/generate-social-kit.mjs
  node scripts/generate-business-card.mjs
  node scripts/generate-brand-guide-pdf.mjs
  node scripts/organize-kit-for-drive.mjs   ← rebuilds this folder
`);

// Print a summary
function tree(dir, prefix = "") {
  const entries = readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      const childCount = readdirSync(full).length;
      console.log(`${prefix}${e.name}/  (${childCount} files)`);
    }
  }
}
console.log(`Built ${ROOT}/`);
tree(ROOT);
