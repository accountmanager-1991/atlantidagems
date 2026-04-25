import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { generateSku } from "@/lib/sku";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const sku = await generateSku(
      body.stone_type || "larimar",
      body.metal_type || "sterling-silver",
      body.category || "pendants",
    );
    return NextResponse.json({ sku });
  } catch (err) {
    console.error("Failed to preview SKU:", err);
    return NextResponse.json({ error: "Failed to preview SKU" }, { status: 500 });
  }
}
