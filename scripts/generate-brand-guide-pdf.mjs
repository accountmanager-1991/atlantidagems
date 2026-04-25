#!/usr/bin/env node
// Generate "Ambar-Larimar-Brand-Guide.pdf" — multi-page brand book.
// Pages: cover, story, logo system, color palette (with hex/RGB/CMYK),
//        typography, social spec sheet, print/business card spec.

import PDFDocument from "pdfkit";
import { readFileSync, writeFileSync, mkdirSync, createWriteStream } from "node:fs";
import { join } from "node:path";

const OUT = "brand-kit/00-BRAND-GUIDE";
mkdirSync(OUT, { recursive: true });
const outPath = join(OUT, "Ambar-Larimar-Brand-Guide.pdf");

// Palette (hex + computed RGB/CMYK)
function hexToRgb(hex) {
  const m = hex.replace("#", "").match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}
function rgbToCmyk([r, g, b]) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);
  if (k === 1) return [0, 0, 0, 100];
  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);
  return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
}

const PALETTE = [
  { name: "Ambar Light", hex: "#FFB830", role: "Sunlight, highlights" },
  { name: "Ambar", hex: "#D06800", role: "Primary amber accent" },
  { name: "Ambar Deep", hex: "#6B3000", role: "Amber shadow / inclusion" },
  { name: "Larimar", hex: "#3AADCC", role: "Primary blue / Caribbean" },
  { name: "Larimar Mid", hex: "#1A7A9E", role: "Secondary blue" },
  { name: "Larimar Deep", hex: "#0E3A54", role: "Deep ocean accent" },
  { name: "Gold", hex: "#C9A84C", role: "Premium accent, dividers" },
  { name: "Gold Light", hex: "#EDD8A0", role: "Highlights on dark" },
  { name: "Gold Deep", hex: "#8A6418", role: "Subtle text on cream" },
  { name: "Cream", hex: "#FAF7F0", role: "Primary background" },
  { name: "Navy", hex: "#0C1420", role: "Primary text, dark theme bg" },
  { name: "Midnight", hex: "#08080E", role: "Deepest dark / accents" },
];

const doc = new PDFDocument({ size: "LETTER", margin: 60, info: {
  Title: "Ambar & Larimar Shop — Brand Guide",
  Author: "Ambar & Larimar Shop",
  Subject: "Brand identity, palette, typography, and social specs",
  Keywords: "brand, identity, larimar, amber, dominican, caribbean, jewelry",
} });
doc.pipe(createWriteStream(outPath));

const W = doc.page.width;
const H = doc.page.height;
const M = 60;

const FONT_HEAD = "Helvetica-Bold"; // pdfkit built-in (Cinzel not embedded — use bold sans-serif as substitute)
const FONT_BODY = "Times-Roman";
const FONT_UI = "Helvetica";

// Helpers
function pageHeader(title, subtitle) {
  doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(28).text(title, M, M, { characterSpacing: 2 });
  if (subtitle) {
    doc.fillColor("#8A6418").font(FONT_UI).fontSize(10).text(subtitle.toUpperCase(), M, doc.y + 4, { characterSpacing: 3 });
  }
  // Gold accent line
  doc.moveTo(M, doc.y + 14).lineTo(M + 60, doc.y + 14).strokeColor("#C9A84C").lineWidth(0.8).stroke();
  doc.moveDown(2);
}

function pageFooter() {
  doc.fillColor("#8A6418").font(FONT_UI).fontSize(8).text("AMBAR & LARIMAR SHOP · BRAND GUIDE · 2026-04", M, H - 40, { characterSpacing: 2 });
  doc.text(`${doc.bufferedPageRange().count}`, W - M - 30, H - 40, { align: "right", width: 30 });
}

// ============================================================
// PAGE 1 — COVER
// ============================================================
doc.rect(0, 0, W, H).fill("#FAF7F0");
// Decorative gold dot border
for (let i = 0; i < 30; i++) {
  const x = M + (i * (W - 2 * M)) / 29;
  doc.circle(x, M, 1.5).fill("#C9A84C");
  doc.circle(x, H - M, 1.5).fill("#C9A84C");
}
// Logo image (PNG)
try {
  const markPng = "brand-kit/01-LOGOS/final-2026-04/png/mark-512.png";
  doc.image(markPng, W / 2 - 110, H / 2 - 200, { width: 220, height: 220 });
} catch (e) {
  console.warn("Logo image not found, skipping");
}
// Title
doc.fillColor("#0C1420").font(FONT_HEAD).fontSize(38).text("AMBAR & LARIMAR", M, H / 2 + 50, { align: "center", characterSpacing: 4, width: W - 2 * M });
doc.fillColor("#0E3A54").font("Times-Italic").fontSize(22).text("Shop", M, doc.y + 4, { align: "center", characterSpacing: 6, width: W - 2 * M });
// Tagline
doc.fillColor("#8A6418").font(FONT_UI).fontSize(11).text("BRAND GUIDE · 2026-04", M, doc.y + 30, { align: "center", characterSpacing: 4, width: W - 2 * M });
doc.fillColor("#8A6418").font(FONT_BODY).fontSize(13).text("The rarest stones on Earth.", M, doc.y + 16, { align: "center", width: W - 2 * M });
doc.fillColor("#8A6418").font(FONT_UI).fontSize(9).text("FINE CARIBBEAN JEWELRY · DOMINICAN REPUBLIC", M, H - M - 20, { align: "center", characterSpacing: 3, width: W - 2 * M });

// ============================================================
// PAGE 2 — BRAND STORY
// ============================================================
doc.addPage();
pageHeader("01  Brand Story", "Who we are");
doc.fillColor("#0C1420").font(FONT_BODY).fontSize(13).text(
  "Ambar & Larimar Shop is the export storefront of the Ambar Mine Museum — a family of artisans, curators, and gem experts working from the Dominican Republic.",
  M, doc.y, { width: W - 2 * M, align: "justify", paragraphGap: 8 }
);
doc.text(
  "We craft fine jewelry around two stones the world cannot find anywhere else: Larimar, the Caribbean blue gem mined only in Barahona, and Dominican Amber — including the famously rare Blue Amber that fluoresces under sunlight.",
  { width: W - 2 * M, align: "justify", paragraphGap: 8 }
);
doc.text(
  "Our identity is anchored in a sense of place: the Caribbean sun, the Atlantic blue, and the gold that frames every piece. Wherever the brand appears — a website, an Instagram post, a business card, a shipment label — it carries that origin.",
  { width: W - 2 * M, align: "justify", paragraphGap: 8 }
);
doc.moveDown(2);
doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(14).text("PROMISE", { characterSpacing: 3 });
doc.fillColor("#0C1420").font(FONT_BODY).fontSize(13).text("Authentic Dominican stones. Crafted by hand. Direct from the source.");
doc.moveDown(1.5);
doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(14).text("VOICE", { characterSpacing: 3 });
doc.fillColor("#0C1420").font(FONT_BODY).fontSize(13).text("Quiet luxury. Story-forward. Slow over loud.");
pageFooter();

// ============================================================
// PAGE 3 — LOGO SYSTEM
// ============================================================
doc.addPage();
pageHeader("02  Logo System", "Mark · Wordmark · Usage");

doc.fillColor("#0C1420").font(FONT_BODY).fontSize(12).text(
  "The seal is a Caribbean Sun — half amber sky, half larimar sea, framed in gold, with the Dominican Republic at its heart. Use the seal anywhere. Use the horizontal lockup when there is room for the wordmark.",
  M, doc.y, { width: W - 2 * M, align: "justify" }
);
doc.moveDown(1.5);

// Embed two logo PNGs side by side
try {
  doc.image("brand-kit/01-LOGOS/final-2026-04/png/mark-400.png", M, doc.y, { width: 160 });
  doc.image("brand-kit/01-LOGOS/final-2026-04/png/horizontal-1200.png", M + 200, doc.y - 160 + 60, { width: W - 2 * M - 220 });
} catch (e) {}

doc.moveDown(12);
doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(12).text("DO", M, doc.y, { characterSpacing: 3 });
doc.fillColor("#0C1420").font(FONT_BODY).fontSize(12);
[
  "Use the SVG file whenever the medium accepts vectors.",
  "Maintain at least one seal-radius of clear space around the mark.",
  "Use the seal alone for square or circular contexts (profile pics, app icons).",
  "Use the horizontal lockup for site headers and email signatures.",
].forEach((line) => doc.text(`  ·  ${line}`, { width: W - 2 * M }));

doc.moveDown(1);
doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(12).text("DON'T", { characterSpacing: 3 });
doc.fillColor("#0C1420").font(FONT_BODY).fontSize(12);
[
  "Recolor the gradients — they are tied to the brand stones.",
  "Stretch, skew, or rotate the seal.",
  "Add drop shadows or outer glows.",
  "Place the seal on a low-contrast photo without the gold ring intact.",
].forEach((line) => doc.text(`  ·  ${line}`, { width: W - 2 * M }));

pageFooter();

// ============================================================
// PAGE 4 — COLOR PALETTE
// ============================================================
doc.addPage();
pageHeader("03  Color Palette", "Hex · RGB · CMYK");

const cols = 3;
const swatchW = (W - 2 * M - (cols - 1) * 12) / cols;
const swatchH = 130;
let cx = M, cy = doc.y;

PALETTE.forEach((c, i) => {
  const col = i % cols;
  const row = Math.floor(i / cols);
  const x = M + col * (swatchW + 12);
  const y = cy + row * (swatchH + 12);
  // Color block
  doc.rect(x, y, swatchW, 60).fill(c.hex);
  // Info block
  doc.rect(x, y + 60, swatchW, swatchH - 60).fill("#FFFFFF").stroke("#E0D9C0");
  doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(11).text(c.name.toUpperCase(), x + 8, y + 66, { characterSpacing: 1.5, width: swatchW - 16 });
  const rgb = hexToRgb(c.hex);
  const cmyk = rgbToCmyk(rgb);
  doc.fillColor("#8A6418").font(FONT_UI).fontSize(8.5);
  doc.text(`HEX  ${c.hex}`, x + 8, y + 80, { width: swatchW - 16, characterSpacing: 0.5 });
  doc.text(`RGB  ${rgb.join("  ")}`, x + 8, y + 92, { width: swatchW - 16, characterSpacing: 0.5 });
  doc.text(`CMYK ${cmyk.join("  ")}`, x + 8, y + 104, { width: swatchW - 16, characterSpacing: 0.5 });
  doc.fillColor("#0C1420").font(FONT_BODY).fontSize(8.5).text(c.role, x + 8, y + 116, { width: swatchW - 16, italics: true });
});

pageFooter();

// ============================================================
// PAGE 5 — TYPOGRAPHY
// ============================================================
doc.addPage();
pageHeader("04  Typography", "Cinzel · Cormorant Garamond · Montserrat");

doc.fillColor("#0C1420").font(FONT_BODY).fontSize(12).text(
  "Three typefaces carry the brand. Use Cinzel for all-caps headings (titles, banners, logos in lockups). Use Cormorant Garamond for body text — descriptions, product copy, longer paragraphs. Use Montserrat for UI labels, captions, eyebrow text, and small details.",
  M, doc.y, { width: W - 2 * M, align: "justify" }
);
doc.moveDown(2);

// Specimen blocks (approximated with built-in fonts since we can't load Cinzel etc. without embedding TTFs)
function specimen(label, sample, fontName, sizes) {
  doc.fillColor("#8A6418").font(FONT_UI).fontSize(10).text(label.toUpperCase(), M, doc.y, { characterSpacing: 3 });
  doc.fillColor("#0C1420").font(fontName);
  sizes.forEach((s) => { doc.fontSize(s).text(sample, { characterSpacing: s > 24 ? 3 : 1 }); });
  doc.moveDown(1.5);
}
specimen("Cinzel — Headings (substitute: Helvetica-Bold)", "AMBAR & LARIMAR", "Helvetica-Bold", [32, 22, 14]);
specimen("Cormorant Garamond — Body (substitute: Times)", "Crafted from the rarest stones on Earth.", "Times-Italic", [22, 16]);
doc.font("Times-Roman").fontSize(13).fillColor("#0C1420").text(
  "Larimar is the Caribbean's hidden treasure — a soft, sky-blue stone found only along the south-western coast of the Dominican Republic, where it forms in volcanic veins close to the sea.",
  { width: W - 2 * M, align: "justify" }
);
doc.moveDown(1.5);
specimen("Montserrat — UI / labels (substitute: Helvetica)", "FINE CARIBBEAN JEWELRY · DOMINICAN REPUBLIC", "Helvetica", [11, 9]);

doc.moveDown(0.5);
doc.fillColor("#0C1420").font(FONT_BODY).fontSize(10).text(
  "Note: this PDF uses built-in PDF fonts. The actual brand fonts (Cinzel, Cormorant Garamond, Montserrat) are loaded via Google Fonts on the website and should be installed locally for print designs.",
  { width: W - 2 * M, align: "justify" }
);

pageFooter();

// ============================================================
// PAGE 6 — SOCIAL MEDIA SPEC SHEET
// ============================================================
doc.addPage();
pageHeader("05  Social Specs", "Where each asset goes");

doc.fillColor("#0C1420").font(FONT_BODY).fontSize(12).text(
  "Every asset in the kit ships in two themes — Light (cream) and Dark (navy radial). Light is the default. Use Dark when the platform's surrounding UI or content trends dark.",
  M, doc.y, { width: W - 2 * M }
);
doc.moveDown(1.5);

const specs = [
  ["Facebook cover", "1200 × 630", "Light or Dark", "Page header"],
  ["X / Twitter header", "1500 × 500", "Light or Dark", "Profile banner"],
  ["LinkedIn page", "1584 × 396", "Light", "Company page header"],
  ["YouTube banner", "2560 × 1440", "Dark recommended", "Channel art"],
  ["Pinterest pin", "1000 × 1500", "Light or Dark", "Branded pin"],
  ["Etsy shop icon", "500 × 500", "Light", "Required, on listings"],
  ["Etsy big banner", "3360 × 840", "Light", "New shop layout"],
  ["Etsy mini banner", "1200 × 300", "Light", "Old shop layout"],
  ["Etsy listing template", "2000 × 2000", "Light or Dark", "Drop product photo"],
  ["Instagram square post", "1080 × 1080", "Light or Dark", "Drop product photo"],
  ["Instagram portrait", "1080 × 1350", "Light or Dark", "Drop product photo"],
  ["Instagram story / Reel", "1080 × 1920", "Light or Dark", "Drop product photo"],
  ["Profile pic (any platform)", "400+ square", "—", "logo-mark.svg or mark-512.png"],
  ["Favicon", "32 / 192", "—", "favicon.png in /public"],
];

const colWidths = [160, 80, 110, 120];
const startX = M;
let y = doc.y;
// Header row
doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(10);
let x = startX;
["ASSET", "SIZE", "THEME", "USE"].forEach((h, i) => {
  doc.text(h, x + 6, y + 6, { width: colWidths[i] - 12, characterSpacing: 2 });
  x += colWidths[i];
});
doc.moveTo(M, y + 22).lineTo(W - M, y + 22).strokeColor("#C9A84C").lineWidth(0.6).stroke();
y += 26;
// Rows
specs.forEach((row, i) => {
  if (i % 2 === 0) {
    doc.rect(M, y - 2, W - 2 * M, 18).fill("#F7F2E5");
  }
  doc.fillColor("#0C1420").font(FONT_BODY).fontSize(10);
  let xx = startX;
  row.forEach((cell, ci) => {
    doc.text(cell, xx + 6, y + 2, { width: colWidths[ci] - 12 });
    xx += colWidths[ci];
  });
  y += 18;
});

pageFooter();

// ============================================================
// PAGE 7 — PRINT (BUSINESS CARD)
// ============================================================
doc.addPage();
pageHeader("06  Print & Business Cards", "Specs for printers");

doc.fillColor("#0C1420").font(FONT_BODY).fontSize(12).text(
  "Business card files in /brand-kit/03-BUSINESS-CARD-2026-04/ are print-ready: 3.5\" × 2\" trim with 1/8\" bleed and 1/8\" safe zone, 300 DPI. Both Light and Dark variants for front and back. Crop marks are baked in.",
  M, doc.y, { width: W - 2 * M, align: "justify" }
);
doc.moveDown(1);

doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(11).text("FILE GUIDE", { characterSpacing: 3 });
doc.fillColor("#0C1420").font(FONT_BODY).fontSize(11);
[
  "card-front-light.png  →  cream/matte stock — primary brand impression",
  "card-front-dark.png   →  navy stock or premium dark finish",
  "card-back-light.png   →  contact info on cream",
  "card-back-dark.png    →  contact info on navy",
].forEach((line) => doc.font("Courier").fontSize(10).text(`  ${line}`));

doc.moveDown(1);
doc.font(FONT_BODY).fontSize(11).fillColor("#0C1420");
doc.text("Edit the SVG in any vector editor (Illustrator, Inkscape, Figma) to add a personal name or a custom phone number, then re-export.");
doc.moveDown(1);

// Try to embed business card preview
try {
  doc.image("brand-kit/03-BUSINESS-CARD-2026-04/card-front-light.png", M, doc.y, { width: (W - 2 * M) * 0.48 });
  doc.image("brand-kit/03-BUSINESS-CARD-2026-04/card-back-light.png", M + (W - 2 * M) * 0.52, doc.y - ((W - 2 * M) * 0.48 * 600 / 1050), { width: (W - 2 * M) * 0.48 });
} catch (e) {}

pageFooter();

// ============================================================
// PAGE 8 — RESOURCES
// ============================================================
doc.addPage();
pageHeader("07  Resources", "Where everything lives");

const resources = [
  ["Master logo SVGs", "brand-kit/01-LOGOS/final-2026-04/"],
  ["Logo PNG exports (all sizes)", "brand-kit/01-LOGOS/final-2026-04/png/"],
  ["Social banners + IG templates", "brand-kit/02-SOCIAL-2026-04/"],
  ["Business cards (print-ready)", "brand-kit/03-BUSINESS-CARD-2026-04/"],
  ["Full brand guide (this PDF)", "brand-kit/00-BRAND-GUIDE/"],
  ["Live previews (run dev server)", "/logo-kit.html · /social-kit.html"],
];

doc.fillColor("#0C1420").font(FONT_BODY).fontSize(12);
resources.forEach(([label, path]) => {
  doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(11).text(label.toUpperCase(), { characterSpacing: 2 });
  doc.fillColor("#8A6418").font("Courier").fontSize(10).text(`  ${path}`);
  doc.moveDown(0.6);
});

doc.moveDown(2);
doc.fillColor("#0E3A54").font(FONT_HEAD).fontSize(11).text("REGENERATE COMMANDS", { characterSpacing: 3 });
doc.fillColor("#0C1420").font("Courier").fontSize(10);
[
  "node scripts/export-logo-pngs.mjs           # logo PNGs",
  "node scripts/generate-social-kit.mjs        # banners + IG + Etsy",
  "node scripts/generate-business-card.mjs     # business cards",
  "node scripts/generate-brand-guide-pdf.mjs   # this PDF",
].forEach((cmd) => doc.text(`  ${cmd}`));

pageFooter();

doc.end();
console.log(`\nGenerated ${outPath}`);
