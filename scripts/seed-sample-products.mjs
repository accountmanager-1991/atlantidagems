// Seeds 8 sample products with realistic SKUs, costs, stock, and view counts
// so the new Dashboard / Inventory / Orders views are visible.
// Re-runnable safely (uses INSERT ... ON CONFLICT DO NOTHING via slug uniqueness).

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const env = readFileSync(".env.local", "utf8");
for (const line of env.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}
const sql = neon(process.env.DATABASE_URL);

// 8 sample products spanning all stones / metals / categories with realistic margins.
// view_count seeded so "Most Viewed" works immediately.
const products = [
  {
    id: "SAMPLE-LARSS-EAR-001",
    slug: "larimar-drop-earrings-sample",
    sku: "AL-LARSS-EAR-001",
    name: "Larimar Drop Earrings",
    short_description: "Caribbean blue larimar set in sterling silver — drop earrings.",
    description: "Hand-cut larimar from Barahona, Dominican Republic, set in 925 sterling silver. Drops about 3cm.",
    price_retail: 89, price_wholesale: 65,
    material_cost: 18, labor_cost: 12, packaging_cost: 3, shipping_cost: 4,
    stock_quantity: 12, stock_status: "in-stock",
    category: "earrings", stone_type: "larimar", metal_type: "sterling-silver",
    weight_grams: 4, dimensions: "30x12x4mm",
    visible: true, featured: true, new_arrival: false, wholesale_eligible: true,
    view_count: 284,
  },
  {
    id: "SAMPLE-LARSS-PND-002",
    slug: "larimar-tear-pendant-sample",
    sku: "AL-LARSS-PND-002",
    name: "Larimar Tear Pendant",
    short_description: "Tear-shaped larimar pendant on sterling silver chain.",
    description: "A drop of the Caribbean — sky-blue larimar set in sterling silver, on a 45cm chain.",
    price_retail: 129, price_wholesale: 89,
    material_cost: 22, labor_cost: 14, packaging_cost: 3, shipping_cost: 3,
    stock_quantity: 5, stock_status: "in-stock",
    category: "pendants", stone_type: "larimar", metal_type: "sterling-silver",
    weight_grams: 6, dimensions: "25x15x8mm",
    visible: true, featured: false, new_arrival: true, wholesale_eligible: true,
    view_count: 142,
  },
  {
    id: "SAMPLE-AMBSS-EAR-003",
    slug: "amber-drop-earrings-sample",
    sku: "AL-AMBSS-EAR-003",
    name: "Amber Drop Earrings",
    short_description: "Honey-gold Dominican amber drops in sterling silver.",
    description: "Genuine Dominican amber from the mines of Puerto Plata, set in 925 sterling silver.",
    price_retail: 79, price_wholesale: 55,
    material_cost: 14, labor_cost: 10, packaging_cost: 3, shipping_cost: 3,
    stock_quantity: 8, stock_status: "in-stock",
    category: "earrings", stone_type: "amber", metal_type: "sterling-silver",
    weight_grams: 3, dimensions: "28x10x4mm",
    visible: true, featured: true, new_arrival: false, wholesale_eligible: true,
    view_count: 96,
  },
  {
    id: "SAMPLE-AMBSS-PND-004",
    slug: "amber-halo-pendant-sample",
    sku: "AL-AMBSS-PND-004",
    name: "Amber Halo Pendant",
    short_description: "Honey amber framed in a sterling silver halo.",
    description: "Dominican amber surrounded by a delicate sterling silver halo. On a 45cm chain.",
    price_retail: 99, price_wholesale: 69,
    material_cost: 18, labor_cost: 12, packaging_cost: 3, shipping_cost: 3,
    stock_quantity: 3, stock_status: "low-stock",
    category: "pendants", stone_type: "amber", metal_type: "sterling-silver",
    weight_grams: 5, dimensions: "20x20x6mm",
    visible: true, featured: false, new_arrival: false, wholesale_eligible: true,
    view_count: 67,
  },
  {
    id: "SAMPLE-LARGO-NCK-005",
    slug: "larimar-gold-necklace-sample",
    sku: "AL-LARGO-NCK-005",
    name: "Larimar Gold Necklace",
    short_description: "Premium gold setting featuring a large larimar centerpiece.",
    description: "14k gold setting with a museum-quality larimar centerpiece. Limited edition. 50cm gold chain.",
    price_retail: 279, price_wholesale: 195,
    material_cost: 65, labor_cost: 22, packaging_cost: 4, shipping_cost: 4,
    stock_quantity: 0, stock_status: "sold-out",
    category: "necklaces", stone_type: "larimar", metal_type: "gold",
    weight_grams: 12, dimensions: "20x18x10mm pendant",
    visible: true, featured: true, new_arrival: false, wholesale_eligible: true,
    view_count: 412,
  },
  {
    id: "SAMPLE-BAMSS-PND-006",
    slug: "blue-amber-pendant-sample",
    sku: "AL-BAMSS-PND-006",
    name: "Blue Amber Pendant",
    short_description: "Rare Dominican blue amber that fluoresces under sunlight.",
    description: "One of the rarest gems on Earth — blue amber found only in the Dominican Republic. Sterling silver setting, 45cm chain.",
    price_retail: 159, price_wholesale: 109,
    material_cost: 28, labor_cost: 13, packaging_cost: 3, shipping_cost: 4,
    stock_quantity: 7, stock_status: "in-stock",
    category: "pendants", stone_type: "blue-amber", metal_type: "sterling-silver",
    weight_grams: 6, dimensions: "22x18x8mm",
    visible: true, featured: true, new_arrival: true, wholesale_eligible: true,
    view_count: 178,
  },
  {
    id: "SAMPLE-LARSS-BRC-007",
    slug: "larimar-cuff-bracelet-sample",
    sku: "AL-LARSS-BRC-007",
    name: "Larimar Cuff Bracelet",
    short_description: "Adjustable sterling silver cuff with three larimar stones.",
    description: "Three Caribbean blue larimar stones set in an adjustable sterling silver cuff. Fits wrists 6.5-7.5 inches.",
    price_retail: 109, price_wholesale: 79,
    material_cost: 22, labor_cost: 12, packaging_cost: 3, shipping_cost: 3,
    stock_quantity: 14, stock_status: "in-stock",
    category: "bracelets", stone_type: "larimar", metal_type: "sterling-silver",
    weight_grams: 11, dimensions: "65x12x8mm",
    visible: true, featured: false, new_arrival: false, wholesale_eligible: true,
    view_count: 89,
  },
  {
    id: "SAMPLE-AMBSS-RNG-008",
    slug: "amber-solitaire-ring-sample",
    sku: "AL-AMBSS-RNG-008",
    name: "Amber Solitaire Ring",
    short_description: "Single amber stone in a classic sterling silver solitaire.",
    description: "Honey-gold Dominican amber in a classic solitaire setting. Sterling silver. Sizes 6-9.",
    price_retail: 89, price_wholesale: 65,
    material_cost: 16, labor_cost: 11, packaging_cost: 3, shipping_cost: 3,
    stock_quantity: 1, stock_status: "low-stock",
    category: "rings", stone_type: "amber", metal_type: "sterling-silver",
    weight_grams: 4, dimensions: "10x10x6mm",
    visible: true, featured: false, new_arrival: false, wholesale_eligible: true,
    view_count: 198,
  },
];

console.log(`Seeding ${products.length} sample products...`);
let inserted = 0, skipped = 0;
for (const p of products) {
  try {
    const result = await sql`
      INSERT INTO products (
        id, slug, sku, name, short_description, description,
        price_retail, price_wholesale,
        material_cost, labor_cost, packaging_cost, shipping_cost,
        stock_quantity, stock_status,
        category, stone_type, metal_type,
        weight_grams, dimensions,
        visible, featured, new_arrival, wholesale_eligible,
        view_count, stone_origin
      ) VALUES (
        ${p.id}, ${p.slug}, ${p.sku}, ${p.name}, ${p.short_description}, ${p.description},
        ${p.price_retail}, ${p.price_wholesale},
        ${p.material_cost}, ${p.labor_cost}, ${p.packaging_cost}, ${p.shipping_cost},
        ${p.stock_quantity}, ${p.stock_status},
        ${p.category}, ${p.stone_type}, ${p.metal_type},
        ${p.weight_grams}, ${p.dimensions},
        ${p.visible}, ${p.featured}, ${p.new_arrival}, ${p.wholesale_eligible},
        ${p.view_count}, 'Dominican Republic'
      )
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    `;
    if (result.length > 0) {
      inserted++;
      console.log(`  + ${p.sku}  ${p.name}  (${p.view_count} views)`);
    } else {
      skipped++;
    }
  } catch (err) {
    console.error(`  ! ${p.sku} failed:`, err.message);
  }
}

console.log(`\nInserted: ${inserted}  ·  Skipped (already existed): ${skipped}`);
console.log(`\nNext: open https://ambarlarimarshop.com/admin → Dashboard tab to see the data populate.`);
console.log(`To remove these later: node scripts/delete-all-products.mjs`);
