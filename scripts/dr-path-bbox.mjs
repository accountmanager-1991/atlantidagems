// Compute bounding box of the real DR SVG path data (after the potrace transform).
// Input: vector.svg with viewBox 0 0 1024 1024, transform "translate(0,1024) scale(0.1,-0.1)".
import { readFileSync } from "node:fs";

const svg = readFileSync("public/images/logos-concepts/dr-outline-raw.svg", "utf8");
const paths = [...svg.matchAll(/d="([^"]+)"/g)].map((m) => m[1]);

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

for (const d of paths) {
  // Tokenize path commands. Numbers can be negative, decimals.
  const tokens = d.match(/[MmLlCcSsQqTtAaVvHhZz]|-?\d*\.?\d+/g);
  if (!tokens) continue;

  let x = 0, y = 0;
  let cmd = "M";
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[A-Za-z]/.test(t)) {
      cmd = t;
      i++;
      continue;
    }
    // Read numbers based on current cmd
    const read = () => parseFloat(tokens[i++]);
    switch (cmd) {
      case "M": case "L":
        x = read(); y = read();
        cmd = cmd === "M" ? "L" : cmd;
        break;
      case "m": case "l":
        x += read(); y += read();
        cmd = cmd === "m" ? "l" : cmd;
        break;
      case "H": x = read(); break;
      case "h": x += read(); break;
      case "V": y = read(); break;
      case "v": y += read(); break;
      case "C":
        read(); read(); read(); read(); x = read(); y = read();
        break;
      case "c":
        read(); read(); read(); read(); x += read(); y += read();
        break;
      case "S": case "Q":
        read(); read(); x = read(); y = read();
        break;
      case "s": case "q":
        read(); read(); x += read(); y += read();
        break;
      case "T": x = read(); y = read(); break;
      case "t": x += read(); y += read(); break;
      case "Z": case "z": break;
      default:
        // skip unknown
        i++;
        continue;
    }
    // Apply transform: display_x = x * 0.1, display_y = 1024 - y * 0.1
    const dx = x * 0.1;
    const dy = 1024 - y * 0.1;
    if (dx < minX) minX = dx;
    if (dx > maxX) maxX = dx;
    if (dy < minY) minY = dy;
    if (dy > maxY) maxY = dy;
  }
}

const w = maxX - minX;
const h = maxY - minY;
console.log(`BBox (display coords):`);
console.log(`  x: ${minX.toFixed(1)}  y: ${minY.toFixed(1)}`);
console.log(`  w: ${w.toFixed(1)}     h: ${h.toFixed(1)}`);
console.log(`  aspect: ${(w/h).toFixed(2)}`);
console.log(``);
console.log(`Use as nested viewBox: "${minX.toFixed(0)} ${minY.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}"`);
