import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`SELECT id, slug, name, view_count FROM products ORDER BY view_count DESC NULLS LAST`;
console.log(`Found ${rows.length} products. Current view counts:`);
for (const r of rows) {
  console.log(`  view_count=${r.view_count ?? "NULL"}  id=${r.id}  slug=${r.slug}  name=${r.name || "(no name)"}`);
}
