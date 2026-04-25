#!/usr/bin/env node
// One-shot: apply Session 14 migration (sku, stock_quantity, costs).

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}

const sql = neon(process.env.DATABASE_URL);

const migrations = [
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS sku TEXT DEFAULT ''`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS material_cost NUMERIC(10,2) DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS labor_cost NUMERIC(10,2) DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS packaging_cost NUMERIC(10,2) DEFAULT 0`,
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC(10,2) DEFAULT 0`,
  `CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON products (sku) WHERE sku != ''`,
];

for (const m of migrations) {
  await sql.query(m);
  console.log("OK:", m.slice(0, 70));
}
console.log("Migration complete.");
