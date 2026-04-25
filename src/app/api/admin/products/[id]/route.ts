import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const sql = getDb();
    const body = await request.json();

    await sql`
      UPDATE products SET
        name = ${body.name},
        slug = ${body.slug},
        sku = ${body.sku || ""},
        description = ${body.description || ""},
        short_description = ${body.short_description || ""},
        description_es = ${body.description_es || ""},
        short_description_es = ${body.short_description_es || ""},
        description_de = ${body.description_de || ""},
        short_description_de = ${body.short_description_de || ""},
        price_retail = ${body.price_retail || 0},
        price_wholesale = ${body.price_wholesale || 0},
        min_wholesale_qty = ${body.min_wholesale_qty || 1},
        material_cost = ${body.material_cost || 0},
        labor_cost = ${body.labor_cost || 0},
        packaging_cost = ${body.packaging_cost || 0},
        shipping_cost = ${body.shipping_cost || 0},
        stock_quantity = ${body.stock_quantity || 0},
        category = ${body.category || "pendants"},
        stone_type = ${body.stone_type || "larimar"},
        metal_type = ${body.metal_type || "sterling-silver"},
        image_main = ${body.image_main || ""},
        image2 = ${body.image2 || ""},
        image3 = ${body.image3 || ""},
        image4 = ${body.image4 || ""},
        stock_status = ${body.stock_status || "in-stock"},
        featured = ${body.featured || false},
        wholesale_eligible = ${body.wholesale_eligible ?? true},
        new_arrival = ${body.new_arrival || false},
        weight_grams = ${body.weight_grams || 0},
        dimensions = ${body.dimensions || ""},
        stone_origin = ${body.stone_origin || "Dominican Republic"},
        visible = ${body.visible ?? true},
        sort_order = ${body.sort_order || 999},
        seo_title = ${body.seo_title || ""},
        seo_description = ${body.seo_description || ""}
      WHERE id = ${id}
    `;

    // Revalidate cached pages
    revalidatePath("/shop");
    revalidatePath("/api/products");
    revalidatePath(`/shop/${body.slug}`);
    revalidatePath("/");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const sql = getDb();
    await sql`DELETE FROM products WHERE id = ${id}`;
    revalidatePath("/shop");
    revalidatePath("/api/products");
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
