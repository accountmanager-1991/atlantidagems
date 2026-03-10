import { getSheetData } from "./google-sheets";
import type {
  Product,
  ProductCategory,
  StoneType,
  MetalType,
  StockStatus,
} from "@/types/product";

// Column indices matching the Google Sheet structure
const COL = {
  id: 0, name: 1, slug: 2, description: 3, shortDescription: 4,
  priceRetail: 5, priceWholesale: 6, minWholesaleQty: 7,
  category: 8, stoneType: 9, metalType: 10,
  imageMain: 11, image2: 12, image3: 13, image4: 14,
  stockStatus: 15, featured: 16, wholesaleEligible: 17, newArrival: 18,
  weightGrams: 19, dimensions: 20, stoneOrigin: 21,
  visible: 22, sortOrder: 23, dateAdded: 24, seoTitle: 25, seoDescription: 26,
};

function parseBoolean(val: string | undefined): boolean {
  return val?.toUpperCase() === "TRUE";
}

function parseNumber(val: string | undefined, fallback = 0): number {
  const n = Number(val);
  return isNaN(n) ? fallback : n;
}

function rowToProduct(row: string[]): Product {
  return {
    id: row[COL.id] || "",
    name: row[COL.name] || "",
    slug: row[COL.slug] || "",
    description: row[COL.description] || "",
    shortDescription: row[COL.shortDescription] || "",
    descriptionEs: "",
    shortDescriptionEs: "",
    descriptionDe: "",
    shortDescriptionDe: "",
    priceRetail: parseNumber(row[COL.priceRetail]),
    priceWholesale: parseNumber(row[COL.priceWholesale]),
    minWholesaleQty: parseNumber(row[COL.minWholesaleQty], 1),
    category: (row[COL.category] || "pendants") as ProductCategory,
    stoneType: (row[COL.stoneType] || "larimar") as StoneType,
    metalType: (row[COL.metalType] || "sterling-silver") as MetalType,
    imageMain: row[COL.imageMain] || "",
    image2: row[COL.image2] || "",
    image3: row[COL.image3] || "",
    image4: row[COL.image4] || "",
    stockStatus: (row[COL.stockStatus] || "in-stock") as StockStatus,
    featured: parseBoolean(row[COL.featured]),
    wholesaleEligible: parseBoolean(row[COL.wholesaleEligible]),
    newArrival: parseBoolean(row[COL.newArrival]),
    weightGrams: parseNumber(row[COL.weightGrams]),
    dimensions: row[COL.dimensions] || "",
    stoneOrigin: row[COL.stoneOrigin] || "Dominican Republic",
    visible: row[COL.visible] !== undefined ? parseBoolean(row[COL.visible]) : true,
    sortOrder: parseNumber(row[COL.sortOrder], 999),
    dateAdded: row[COL.dateAdded] || "",
    seoTitle: row[COL.seoTitle] || "",
    seoDescription: row[COL.seoDescription] || "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbRowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description || "",
    shortDescription: row.short_description || "",
    descriptionEs: row.description_es || "",
    shortDescriptionEs: row.short_description_es || "",
    descriptionDe: row.description_de || "",
    shortDescriptionDe: row.short_description_de || "",
    priceRetail: Number(row.price_retail) || 0,
    priceWholesale: Number(row.price_wholesale) || 0,
    minWholesaleQty: Number(row.min_wholesale_qty) || 1,
    category: (row.category || "pendants") as ProductCategory,
    stoneType: (row.stone_type || "larimar") as StoneType,
    metalType: (row.metal_type || "sterling-silver") as MetalType,
    imageMain: row.image_main || "",
    image2: row.image2 || "",
    image3: row.image3 || "",
    image4: row.image4 || "",
    stockStatus: (row.stock_status || "in-stock") as StockStatus,
    featured: Boolean(row.featured),
    wholesaleEligible: Boolean(row.wholesale_eligible),
    newArrival: Boolean(row.new_arrival),
    weightGrams: Number(row.weight_grams) || 0,
    dimensions: row.dimensions || "",
    stoneOrigin: row.stone_origin || "Dominican Republic",
    visible: row.visible !== false,
    sortOrder: Number(row.sort_order) || 999,
    dateAdded: row.date_added ? String(row.date_added).split("T")[0] : "",
    seoTitle: row.seo_title || "",
    seoDescription: row.seo_description || "",
  };
}

async function getProductsFromNeon(): Promise<Product[] | null> {
  if (!process.env.DATABASE_URL) return null;
  try {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT * FROM products WHERE visible = true ORDER BY sort_order ASC, date_added DESC`;
    if (rows.length === 0) return null;
    return rows.map(dbRowToProduct);
  } catch {
    return null;
  }
}

// Mock data for development
function getMockProducts(): Product[] {
  return [
    { id: "LAR-PEN-001", name: "Ocean Wave Larimar Pendant", slug: "ocean-wave-larimar-pendant", description: "A stunning sterling silver pendant featuring a premium AAA-grade Larimar stone, hand-selected from the mountains of Barahona, Dominican Republic.", shortDescription: "Premium Larimar pendant in sterling silver, handcrafted in the Dominican Republic.", priceRetail: 165, priceWholesale: 72, minWholesaleQty: 10, category: "pendants", stoneType: "larimar", metalType: "sterling-silver", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "in-stock", featured: true, wholesaleEligible: true, newArrival: true, weightGrams: 8, dimensions: "2.5cm x 1.8cm", stoneOrigin: "Barahona, Dominican Republic", visible: true, sortOrder: 1, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
    { id: "LAR-EAR-001", name: "Caribbean Drop Larimar Earrings", slug: "caribbean-drop-larimar-earrings", description: "Elegant teardrop earrings featuring matched pair of Larimar stones in sterling silver settings.", shortDescription: "Matched Larimar teardrop earrings in sterling silver.", priceRetail: 125, priceWholesale: 55, minWholesaleQty: 10, category: "earrings", stoneType: "larimar", metalType: "sterling-silver", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "in-stock", featured: true, wholesaleEligible: true, newArrival: false, weightGrams: 6, dimensions: "3.2cm x 1.2cm", stoneOrigin: "Barahona, Dominican Republic", visible: true, sortOrder: 2, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
    { id: "AMB-PEN-001", name: "Golden Amber Sun Pendant", slug: "golden-amber-sun-pendant", description: "A warm golden Dominican Amber pendant with natural inclusions visible under light.", shortDescription: "Dominican Amber pendant in sterling silver with natural inclusions.", priceRetail: 140, priceWholesale: 60, minWholesaleQty: 10, category: "pendants", stoneType: "amber", metalType: "sterling-silver", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "in-stock", featured: true, wholesaleEligible: true, newArrival: true, weightGrams: 10, dimensions: "3.0cm x 2.0cm", stoneOrigin: "La Cumbre, Dominican Republic", visible: true, sortOrder: 3, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
    { id: "LAR-RNG-001", name: "Atlantis Larimar Ring", slug: "atlantis-larimar-ring", description: "A bold statement ring featuring an oval AAA Larimar stone set in a wide sterling silver band.", shortDescription: "Bold oval Larimar ring in sterling silver with wave engravings.", priceRetail: 195, priceWholesale: 85, minWholesaleQty: 5, category: "rings", stoneType: "larimar", metalType: "sterling-silver", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "in-stock", featured: true, wholesaleEligible: true, newArrival: false, weightGrams: 14, dimensions: "Ring face: 1.8cm x 1.4cm", stoneOrigin: "Barahona, Dominican Republic", visible: true, sortOrder: 4, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
    { id: "AMB-EAR-001", name: "Amber Honey Drop Earrings", slug: "amber-honey-drop-earrings", description: "Delicate honey-colored Dominican Amber earrings in sterling silver.", shortDescription: "Honey Dominican Amber drop earrings in sterling silver.", priceRetail: 95, priceWholesale: 42, minWholesaleQty: 10, category: "earrings", stoneType: "amber", metalType: "sterling-silver", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "in-stock", featured: false, wholesaleEligible: true, newArrival: false, weightGrams: 5, dimensions: "2.8cm x 1.0cm", stoneOrigin: "La Cumbre, Dominican Republic", visible: true, sortOrder: 5, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
    { id: "LAR-NCK-001", name: "Tidal Gold Larimar Necklace", slug: "tidal-gold-larimar-necklace", description: "A luxurious gold-plated necklace featuring three graduated Larimar stones in bezel settings.", shortDescription: "Three-stone Larimar necklace in gold-plated sterling silver.", priceRetail: 345, priceWholesale: 150, minWholesaleQty: 5, category: "necklaces", stoneType: "larimar", metalType: "gold-plated", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "low-stock", featured: true, wholesaleEligible: true, newArrival: true, weightGrams: 18, dimensions: "Chain: 45cm, Center stone: 1.5cm", stoneOrigin: "Barahona, Dominican Republic", visible: true, sortOrder: 6, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
    { id: "LAR-BRC-001", name: "Ocean Breeze Larimar Bracelet", slug: "ocean-breeze-larimar-bracelet", description: "A stunning cuff bracelet featuring five polished Larimar stones set in sterling silver.", shortDescription: "Five-stone Larimar cuff bracelet in sterling silver.", priceRetail: 225, priceWholesale: 98, minWholesaleQty: 5, category: "bracelets", stoneType: "larimar", metalType: "sterling-silver", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "in-stock", featured: false, wholesaleEligible: true, newArrival: false, weightGrams: 28, dimensions: "Width: 2cm, Adjustable 16-19cm", stoneOrigin: "Barahona, Dominican Republic", visible: true, sortOrder: 7, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
    { id: "BAMB-PEN-001", name: "Blue Amber Mystique Pendant", slug: "blue-amber-mystique-pendant", description: "An extraordinarily rare Dominican Blue Amber pendant. Glows blue under UV light.", shortDescription: "Rare Dominican Blue Amber pendant in sterling silver — glows blue under UV light.", priceRetail: 480, priceWholesale: 210, minWholesaleQty: 3, category: "pendants", stoneType: "blue-amber", metalType: "sterling-silver", imageMain: "/images/placeholder.jpg", image2: "", image3: "", image4: "", stockStatus: "low-stock", featured: true, wholesaleEligible: true, newArrival: true, weightGrams: 12, dimensions: "3.5cm x 2.5cm", stoneOrigin: "La Cumbre, Dominican Republic", visible: true, sortOrder: 8, dateAdded: "2026-03-09", descriptionEs: "", shortDescriptionEs: "", descriptionDe: "", shortDescriptionDe: "", seoTitle: "", seoDescription: "" },
  ];
}

export async function getAllProducts(): Promise<Product[]> {
  // Try Neon Postgres first
  const neonProducts = await getProductsFromNeon();
  if (neonProducts) return neonProducts;

  // Then try Google Sheets
  const data = await getSheetData("products!A2:AA");
  if (data) {
    return data.map(rowToProduct).filter((p) => p.visible && p.id).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Fallback to mock data
  return getMockProducts();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.featured);
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.category === category);
}

export async function getWholesaleProducts(): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.wholesaleEligible);
}

export async function getProductSlugs(): Promise<string[]> {
  const products = await getAllProducts();
  return products.map((p) => p.slug);
}
