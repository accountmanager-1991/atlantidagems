import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { isAdmin } from "@/lib/admin-auth";
import { sendShippingConfirmationGHL, updateOpportunityStageByStatus } from "@/lib/ghl";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const {
    status,
    tracking_number,
    tracking_carrier,
    notes,
    send_shipping_email,
  } = body;

  try {
    const sql = getDb();

    await sql`
      UPDATE orders SET
        status = COALESCE(${status || null}, status),
        tracking_number = COALESCE(${tracking_number ?? null}, tracking_number),
        tracking_carrier = COALESCE(${tracking_carrier ?? null}, tracking_carrier),
        notes = COALESCE(${notes ?? null}, notes),
        shipped_at = ${status === "shipped" ? sql`NOW()` : sql`shipped_at`}
      WHERE id = ${id}
    `;

    // Move the GHL Opportunity to the corresponding pipeline stage
    // (no-op if GHL_PIPELINE_ID + stage IDs aren't configured)
    if (status) {
      const orderRowsForStage = await sql`SELECT customer_email, total FROM orders WHERE id = ${id}`;
      const o = orderRowsForStage[0];
      if (o?.customer_email) {
        await updateOpportunityStageByStatus(
          o.customer_email,
          status as "pending" | "paid" | "shipped" | "delivered" | "cancelled",
          id,
          String(o.total ?? "0"),
        );
      }
    }

    // Send shipping confirmation if tracking number was added
    if (send_shipping_email && tracking_number) {
      const orderRows = await sql`
        SELECT * FROM orders WHERE id = ${id}
      `;
      const order = orderRows[0];
      if (order) {
        const items = JSON.parse(order.items_json || "[]");

        // GHL shipping confirmation workflow
        await sendShippingConfirmationGHL({
          orderId: id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          trackingNumber: tracking_number,
          trackingCarrier: tracking_carrier || "",
          items,
        });

        // n8n webhook for WhatsApp shipping notification
        if (process.env.N8N_ORDER_WEBHOOK_URL) {
          fetch(process.env.N8N_ORDER_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: "order_shipped",
              orderId: id,
              customerName: order.customer_name,
              customerEmail: order.customer_email,
              trackingNumber: tracking_number,
              trackingCarrier: tracking_carrier || "",
              message: `Package Shipped!\n\nOrder: ${id}\nCustomer: ${order.customer_name}\nTracking: ${tracking_number}\nCarrier: ${tracking_carrier || "Standard"}`,
            }),
          }).catch((err) => {
            console.error("Failed to call n8n webhook:", err);
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
