import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT
        id, customer_name, status, tracking_number, tracking_carrier,
        items_json, subtotal, shipping_cost, total,
        shipped_at, paid_at, created_at
      FROM orders
      WHERE id = ${id}
    `;

    if (!rows[0]) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = rows[0];
    return NextResponse.json({
      id: order.id,
      customerName: order.customer_name,
      status: order.status,
      trackingNumber: order.tracking_number,
      trackingCarrier: order.tracking_carrier,
      items: JSON.parse(order.items_json || "[]"),
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      total: order.total,
      shippedAt: order.shipped_at,
      paidAt: order.paid_at,
      createdAt: order.created_at,
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
