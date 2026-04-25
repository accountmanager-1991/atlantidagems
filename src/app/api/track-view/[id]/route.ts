import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Public, unauthenticated endpoint — increments a product's view counter.
// Called from a client component on product detail-page mount.
// Per-session dedup happens client-side via sessionStorage.
export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id || typeof id !== "string" || id.length > 100) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    const sql = getDb();
    await sql`UPDATE products SET view_count = COALESCE(view_count, 0) + 1 WHERE id = ${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to track view:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
