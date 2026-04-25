// Replace the stylized DR silhouette in each concept with the real traced outline
// from mapsicon. Also inject markers (Larimar @ Barahona, Amber @ Puerto Plata,
// Santo Domingo dot) positioned in the real coordinate space.
//
// The real path uses viewBox "0 171 1024 682" after potrace transform
// [translate(0,1024) scale(0.1,-0.1)]. We embed via nested <svg>.

import { readFileSync, writeFileSync } from "node:fs";

const raw = readFileSync("public/images/logos-concepts/dr-outline-raw.svg", "utf8");
const paths = [...raw.matchAll(/d="([^"]+)"/g)].map((m) => m[1].replace(/\s+/g, " "));
const [mainlandPath, smallIsland] = paths;

// Approximate real-world coordinate locations in the nested viewBox (0 171 1024 682):
// The map is oriented standard (north up). We computed:
//   x: 0 -> Haiti border west, x: 1024 -> Cabo Engaño east (Punta Cana)
//   y: 171 -> top (north coast ~Samaná peak), y: 853 -> bottom (Barahona tip)
// Real city approximate pixel positions in this viewBox:
//   Santo Domingo  ~  680, 570   (center-south coast)
//   Puerto Plata   ~  450, 260   (north coast)
//   Barahona city  ~  430, 620   (south-west coast)
//   Samaná tip     ~  780, 230
//   Cabo Engaño    ~ 1010, 430

// SVG snippet builder. Accepts positional args:
//   cx, cy  — center of the island in the parent logo
//   w, h    — display width / height (should maintain 1.50:1 aspect)
//   fill    — path fill (gradient ref or color)
//   halo    — optional halo ellipse (rx,ry,fill,opacity) or null to skip
function drIslandSnippet({ cx, cy, w, h, fill = "url(#goldG)", stroke = "#5A3D10", strokeWidth = 90, halo, withMarkers = true, withStars = true }) {
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;

  const haloEl = halo
    ? `<ellipse cx="${cx}" cy="${cy}" rx="${halo.rx}" ry="${halo.ry}" fill="${halo.fill}" opacity="${halo.opacity}"/>`
    : "";

  // Markers are placed in the nested-SVG coordinate space.
  // The nested SVG has viewBox "0 171 1024 682" so marker coords are in that space.
  // Marker radius needs to scale with the map — use absolute radius around ~28 (of 1024).
  const markerSnippet = withMarkers
    ? `
      <!-- Larimar at Barahona (SW coast) -->
      <circle cx="430" cy="620" r="34" fill="url(#larimarG)" stroke="${stroke}" stroke-width="4"/>
      <!-- Amber at Puerto Plata (N coast) -->
      <circle cx="450" cy="260" r="34" fill="url(#ambarG)" stroke="${stroke}" stroke-width="4"/>
      <!-- Santo Domingo (capital) gold star -->
      <g transform="translate(680,570)">
        <circle r="22" fill="${stroke}"/>
        <circle r="13" fill="#F5E5B5"/>
      </g>`
    : "";

  return `
<svg x="${x0}" y="${y0}" width="${w}" height="${h}" viewBox="0 171 1024 682" preserveAspectRatio="xMidYMid meet">
  ${haloEl}
  <g transform="translate(0,1024) scale(0.1,-0.1)" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linejoin="round">
    <path d="${mainlandPath}"/>
    <path d="${smallIsland}"/>
  </g>
  ${markerSnippet}
</svg>`.trim();
}

// Per-concept replacement: find the existing "<!-- Dominican Republic island...-->" block
// and replace with the real one. We identify each block by the opening comment.

const concepts = [
  {
    file: "brand-kit/01-LOGOS/concepts-2026-04/concept-A-caribbean-sun.svg",
    startMarker: "<!-- Dominican Republic island silhouette at center -->",
    endMarker: "</svg>",
    replacement: drIslandSnippet({ cx: 120, cy: 120, w: 96, h: 64, fill: "url(#goldG)" }) + "\n</svg>",
  },
  {
    file: "brand-kit/01-LOGOS/concepts-2026-04/concept-A2-dominican-seal.svg",
    startMarker: "<!-- Dominican Republic island silhouette at center -->",
    endMarker: "</svg>",
    replacement: drIslandSnippet({ cx: 130, cy: 130, w: 108, h: 72, fill: "url(#goldG)" }) + "\n</svg>",
  },
  {
    file: "brand-kit/01-LOGOS/concepts-2026-04/concept-A3-dr-island.svg",
    startMarker: "<!-- Dominican Republic island silhouette at the center (hero element) -->",
    endMarker: "</svg>",
    replacement: drIslandSnippet({
      cx: 130, cy: 130, w: 120, h: 80, fill: "url(#islandG)",
      halo: { rx: 68, ry: 24, fill: "#0C1420", opacity: 0.35 },
    }) + "\n</svg>",
  },
  {
    file: "brand-kit/01-LOGOS/concepts-2026-04/concept-B-drop-monogram.svg",
    startMarker: "<!-- Dominican Republic island silhouette on the gold seam -->",
    endMarker: "<!-- Tiny A and L marks inside drops -->",
    replacement: drIslandSnippet({ cx: 120, cy: 120, w: 84, h: 56, fill: "#0C1420", stroke: "#8A6418", strokeWidth: 70 }),
  },
  {
    file: "brand-kit/01-LOGOS/concepts-2026-04/concept-C-taino-sun.svg",
    startMarker: "<!-- Dominican Republic island silhouette inside the inner disc -->",
    endMarker: "</svg>",
    replacement: drIslandSnippet({ cx: 120, cy: 120, w: 96, h: 64, fill: "url(#goldG)" }) + "\n</svg>",
  },
];

for (const c of concepts) {
  const src = readFileSync(c.file, "utf8");
  const startIdx = src.indexOf(c.startMarker);
  if (startIdx === -1) {
    console.log(`SKIP ${c.file} — start marker not found`);
    continue;
  }
  const endIdx = src.indexOf(c.endMarker, startIdx);
  if (endIdx === -1) {
    console.log(`SKIP ${c.file} — end marker not found`);
    continue;
  }
  const before = src.slice(0, startIdx);
  const after = src.slice(endIdx + c.endMarker.length);
  const newContent = before + c.replacement + after;
  writeFileSync(c.file, newContent, "utf8");
  console.log(`WROTE ${c.file}`);
}

// Also copy updated files to public/
const { copyFileSync } = await import("node:fs");
for (const c of concepts) {
  const dest = "public/images/logos-concepts/" + c.file.split("/").pop();
  copyFileSync(c.file, dest);
}
console.log("Copied to public/.");
