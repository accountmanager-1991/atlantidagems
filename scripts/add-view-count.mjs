import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}
const sql = neon(process.env.DATABASE_URL);
await sql.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0`);
console.log("OK: view_count column added (or already existed)");
