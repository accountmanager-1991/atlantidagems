#!/usr/bin/env node
// Generate profile pictures for every relevant platform at THREE sizes:
//   - Platform-spec (the size the platform recommends or requires)
//   - 1080 px (HD — what most modern phones/tablets display at)
//   - 1920 px (max quality — future-proof, retina-ready)
// All transparent. Plus 4 universal "any platform" sizes at the top.

import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const SRC = "brand-kit/01-LOGOS/final-2026-04/logo-mark.svg";
const OUT = "brand-kit/LOGO-EVERYWHERE/02-PROFILE-PICTURES";

if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const markSvg = readFileSync(SRC);

async function render(size, dst) {
  mkdirSync(dst.replace(/[\\/][^\\/]+$/, ""), { recursive: true });
  await sharp(markSvg, { density: Math.max(96, (size / 240) * 96) })
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(dst);
}

// Universal "any platform" sizes — drop these on any service that lets you upload
const universal = [
  ["universal-1080.png", 1080, "Universal HD profile (any platform)"],
  ["universal-1920.png", 1920, "Universal MAX-quality profile"],
  ["universal-2048.png", 2048, "Future-proof master (some platforms accept up to 2048)"],
];

// Per-platform definitions:
//   spec   = the platform's recommended/required size
//   note   = limit info
const platforms = [
  { name: "instagram-profile",     spec: 320, max: 1080, label: "Instagram",       note: "min 320, displays up to 1080px (story circle)" },
  { name: "facebook-profile",      spec: 512, max: 2048, label: "Facebook",        note: "min 180, accepts up to 2048" },
  { name: "facebook-group",        spec: 512, max: 1024, label: "Facebook Group",  note: "min 250, displays at 250" },
  { name: "tiktok-profile",        spec: 400, max: 1080, label: "TikTok",          note: "min 200, displays at 200, accepts up to 1080" },
  { name: "x-twitter-profile",     spec: 400, max: 1080, label: "X / Twitter",     note: "displays at 400, accepts up to 2MB" },
  { name: "threads-profile",       spec: 320, max: 1080, label: "Threads",         note: "Meta's Twitter — same as IG profile spec" },
  { name: "linkedin-page",         spec: 400, max: 1024, label: "LinkedIn Page",   note: "300×300 min, accepts PNG up to 8MB" },
  { name: "linkedin-personal",     spec: 400, max: 1024, label: "LinkedIn Personal", note: "Same as Page" },
  { name: "pinterest-profile",     spec: 400, max: 1080, label: "Pinterest",       note: "min 165, accepts large" },
  { name: "youtube-channel",       spec: 800, max: 2048, label: "YouTube",         note: "REQUIRED min 800, max 2048×2048" },
  { name: "etsy-shop",             spec: 500, max: 500,  label: "Etsy",            note: "REQUIRED EXACTLY 500×500" },
  { name: "whatsapp-business",     spec: 640, max: 1024, label: "WhatsApp Business", note: "640 ideal, larger downscaled" },
  { name: "snapchat",              spec: 320, max: 1080, label: "Snapchat",        note: "Bitmoji / profile" },
  { name: "google-business",       spec: 720, max: 1080, label: "Google Business", note: "min 250, larger improves rendering" },
  { name: "discord-server",        spec: 512, max: 1024, label: "Discord Server",  note: "min 128, accepts 1024" },
  { name: "telegram-channel",      spec: 512, max: 1280, label: "Telegram",        note: "Up to 1280×1280" },
  { name: "reddit-community",      spec: 256, max: 1024, label: "Reddit Community", note: "Subreddit / community icon" },
  { name: "bluesky-profile",       spec: 1000, max: 1000, label: "BlueSky",        note: "Recommended ~1000×1000" },
  { name: "behance-profile",       spec: 276, max: 1080, label: "Behance",         note: "Min 276, larger improves" },
  { name: "tumblr-blog",           spec: 128, max: 1080, label: "Tumblr",          note: "Avatar 128, larger fine" },
  { name: "vimeo-channel",         spec: 300, max: 1080, label: "Vimeo",           note: "Channel avatar" },
  { name: "mastodon-profile",      spec: 400, max: 1024, label: "Mastodon",        note: "Up to 1MB on most instances" },
];

console.log("== Universal sizes ==");
for (const [name, size] of universal) {
  await render(size, join(OUT, name));
  console.log(`  ${name}  ${size}×${size}`);
}

console.log("\n== Per-platform (spec + 1080 + 1920 always) ==");
const STRICT = new Set(["etsy-shop"]); // platforms that REJECT non-spec sizes — only generate spec
for (const p of platforms) {
  // 1. platform-spec (what the platform asks for / requires)
  await render(p.spec, join(OUT, `${p.name}-${p.spec}.png`));

  if (STRICT.has(p.name)) {
    console.log(`  ${p.label.padEnd(22)}  STRICT ${p.spec}×${p.spec} only`);
    continue;
  }

  // 2. 1080 HD — always, unless spec already >= 1080
  if (p.spec !== 1080) {
    await render(1080, join(OUT, `${p.name}-1080.png`));
  }
  // 3. 1920 MAX — always, unless spec already >= 1920
  if (p.spec !== 1920) {
    await render(1920, join(OUT, `${p.name}-1920.png`));
  }
  console.log(`  ${p.label.padEnd(22)}  ${p.spec} + 1080 + 1920`);
}

// Verify all files have alpha
console.log("\n== Verifying transparency ==");
const { readdirSync } = await import("node:fs");
const files = readdirSync(OUT).filter(f => f.endsWith(".png"));
let okCount = 0, badCount = 0;
for (const f of files) {
  const m = await sharp(join(OUT, f)).metadata();
  if (m.hasAlpha) okCount++; else { badCount++; console.log(`  MISSING ALPHA: ${f}`); }
}
console.log(`  ${okCount} files transparent  ${badCount} missing alpha`);

// README
writeFileSync(join(OUT, "README.txt"),
`PROFILE PICTURES — HIGH QUALITY (transparent)
==============================================
Every file is on a transparent background — uploads cleanly to any
platform's profile picture field.

Three sizes per platform:
  {platform}-{spec}.png   →  the platform's recommended / required size
  {platform}-1080.png     →  HD — what most modern phones display at
  {platform}-1920.png     →  MAX quality — future-proof, retina-ready

UNIVERSAL (works anywhere):
  universal-1080.png      →  drop on any platform (HD)
  universal-1920.png      →  drop on any platform (MAX)
  universal-2048.png      →  future-proof master

PLATFORMS INCLUDED (${platforms.length} platforms × 2-3 sizes = ${files.length - universal.length} files):

` + platforms.map(p => `  ${p.label.padEnd(22)}  ${p.note}`).join("\n") + `

NOTE — sizes the platform may auto-downscale:
  - X / Twitter displays at 400×400 max but accepts larger uploads.
  - Etsy is STRICT 500×500 — anything else is rejected.
  - YouTube REQUIRES 800×800 minimum but accepts up to 2048×2048.

For ABSOLUTE best quality (any size at all), use the SVG:
  /01-MASTER-VECTOR/logo-mark.svg
`);

console.log(`\nWrote ${files.length} PNG files in ${OUT}/`);
