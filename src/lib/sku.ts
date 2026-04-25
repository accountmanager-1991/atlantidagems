import { getDb } from "./db";

const STONE_CODES: Record<string, string> = {
  larimar: "LAR",
  amber: "AMB",
  "blue-amber": "BAM",
};

const METAL_CODES: Record<string, string> = {
  "sterling-silver": "SS",
  gold: "GO",
  "gold-plated": "GP",
};

const CATEGORY_CODES: Record<string, string> = {
  earrings: "EAR",
  pendants: "PND",
  necklaces: "NCK",
  rings: "RNG",
  bracelets: "BRC",
};

export function buildSkuPrefix(stoneType: string, metalType: string, category: string): string {
  const stone = STONE_CODES[stoneType] || "XXX";
  const metal = METAL_CODES[metalType] || "XX";
  const cat = CATEGORY_CODES[category] || "XXX";
  return `AL-${stone}${metal}-${cat}`;
}

export async function generateSku(stoneType: string, metalType: string, category: string): Promise<string> {
  const prefix = buildSkuPrefix(stoneType, metalType, category);
  const sql = getDb();
  const rows = await sql`
    SELECT sku FROM products
    WHERE sku LIKE ${prefix + "-%"}
    ORDER BY sku DESC
    LIMIT 1
  `;
  let next = 1;
  if (rows[0]?.sku) {
    const match = String(rows[0].sku).match(/-(\d+)$/);
    if (match) next = parseInt(match[1], 10) + 1;
  }
  return `${prefix}-${String(next).padStart(3, "0")}`;
}
