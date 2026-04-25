#!/usr/bin/env node
// One-shot: clear all products so the new admin UI starts clean.
// Reads DATABASE_URL from .env.local.

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}

const sql = neon(process.env.DATABASE_URL);

const before = await sql`SELECT count(*)::int AS n FROM products`;
console.log(`Products before: ${before[0].n}`);

await sql`DELETE FROM products`;

const after = await sql`SELECT count(*)::int AS n FROM products`;
console.log(`Products after:  ${after[0].n}`);
console.log("Done.");
