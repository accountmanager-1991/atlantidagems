import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getDb, initDatabase } from "@/lib/db";
import { generateSku } from "@/lib/sku";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    const rows = await sql`SELECT * FROM products ORDER BY sort_order ASC, date_added DESC`;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sql = getDb();
    await initDatabase();
    const body = await request.json();

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const id = body.id || `${body.stone_type?.toUpperCase().slice(0, 3) || "PRD"}-${Date.now()}`;

    const sku = body.sku?.trim()
      ? body.sku.trim()
      : await generateSku(
          body.stone_type || "larimar",
          body.metal_type || "sterling-silver",
          body.category || "pendants",
        );

    await sql`
      INSERT INTO products (
        id, name, slug, sku, description, short_description,
        description_es, short_description_es,
        description_de, short_description_de,
        price_retail, price_wholesale, min_wholesale_qty,
        material_cost, labor_cost, packaging_cost, shipping_cost,
        stock_quantity,
        category, stone_type, metal_type,
        image_main, image2, image3, image4,
        stock_status, featured, wholesale_eligible, new_arrival,
        weight_grams, dimensions, stone_origin,
        visible, sort_order, date_added, seo_title, seo_description
      ) VALUES (
        ${id}, ${body.name}, ${slug}, ${sku}, ${body.description || ""},
        ${body.short_description || ""},
        ${body.description_es || ""}, ${body.short_description_es || ""},
        ${body.description_de || ""}, ${body.short_description_de || ""},
        ${body.price_retail || 0}, ${body.price_wholesale || 0},
        ${body.min_wholesale_qty || 1},
        ${body.material_cost || 0}, ${body.labor_cost || 0},
        ${body.packaging_cost || 0}, ${body.shipping_cost || 0},
        ${body.stock_quantity || 0},
        ${body.category || "pendants"}, ${body.stone_type || "larimar"},
        ${body.metal_type || "sterling-silver"},
        ${body.image_main || ""}, ${body.image2 || ""}, ${body.image3 || ""}, ${body.image4 || ""},
        ${body.stock_status || "in-stock"},
        ${body.featured || false}, ${body.wholesale_eligible ?? true}, ${body.new_arrival || false},
        ${body.weight_grams || 0}, ${body.dimensions || ""},
        ${body.stone_origin || "Dominican Republic"},
        ${body.visible ?? true}, ${body.sort_order || 999},
        ${body.date_added || new Date().toISOString().split("T")[0]},
        ${body.seo_title || ""}, ${body.seo_description || ""}
      )
    `;

    // Revalidate cached pages
    revalidatePath("/shop");
    revalidatePath("/api/products");
    revalidatePath(`/shop/${slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true, id, slug, sku });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
