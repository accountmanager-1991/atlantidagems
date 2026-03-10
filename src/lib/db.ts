import { neon } from "@neondatabase/serverless";

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

export async function initDatabase() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      short_description TEXT DEFAULT '',
      description_es TEXT DEFAULT '',
      short_description_es TEXT DEFAULT '',
      description_de TEXT DEFAULT '',
      short_description_de TEXT DEFAULT '',
      price_retail NUMERIC(10,2) NOT NULL DEFAULT 0,
      price_wholesale NUMERIC(10,2) NOT NULL DEFAULT 0,
      min_wholesale_qty INTEGER DEFAULT 1,
      category TEXT DEFAULT 'pendants',
      stone_type TEXT DEFAULT 'larimar',
      metal_type TEXT DEFAULT 'sterling-silver',
      image_main TEXT DEFAULT '',
      image2 TEXT DEFAULT '',
      image3 TEXT DEFAULT '',
      image4 TEXT DEFAULT '',
      stock_status TEXT DEFAULT 'in-stock',
      featured BOOLEAN DEFAULT false,
      wholesale_eligible BOOLEAN DEFAULT true,
      new_arrival BOOLEAN DEFAULT false,
      weight_grams NUMERIC(10,2) DEFAULT 0,
      dimensions TEXT DEFAULT '',
      stone_origin TEXT DEFAULT 'Dominican Republic',
      visible BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 999,
      date_added DATE DEFAULT CURRENT_DATE,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT ''
    )
  `;

  // Add multilingual columns to existing tables (safe migration)
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS description_es TEXT DEFAULT ''`; } catch { /* exists */ }
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description_es TEXT DEFAULT ''`; } catch { /* exists */ }
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS description_de TEXT DEFAULT ''`; } catch { /* exists */ }
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS short_description_de TEXT DEFAULT ''`; } catch { /* exists */ }

  // Orders table
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT DEFAULT '',
      shipping_address TEXT DEFAULT '',
      shipping_city TEXT DEFAULT '',
      shipping_state TEXT DEFAULT '',
      shipping_zip TEXT DEFAULT '',
      shipping_country TEXT DEFAULT '',
      items_json TEXT DEFAULT '[]',
      subtotal NUMERIC(10,2) DEFAULT 0,
      shipping_cost NUMERIC(10,2) DEFAULT 0,
      total NUMERIC(10,2) DEFAULT 0,
      status TEXT DEFAULT 'pending',
      stripe_session_id TEXT DEFAULT '',
      stripe_payment_intent TEXT DEFAULT '',
      tracking_number TEXT DEFAULT '',
      tracking_carrier TEXT DEFAULT '',
      shipped_at TIMESTAMPTZ,
      notes TEXT DEFAULT '',
      paid_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Safe migration for tracking columns on existing orders table
  try { await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT DEFAULT ''`; } catch { /* exists */ }
  try { await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_carrier TEXT DEFAULT ''`; } catch { /* exists */ }
  try { await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ`; } catch { /* exists */ }
  try { await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT ''`; } catch { /* exists */ }

  // Indexes for frequently queried columns
  await sql`CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_visible ON products (visible)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_products_category ON products (category)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders (customer_email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON orders (stripe_session_id)`;
}
