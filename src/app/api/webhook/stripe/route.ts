import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { sendOrderConfirmationGHL } from "@/lib/ghl";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId || "";
    const customerName = session.metadata?.customerName || "Unknown";
    const customerEmail = session.customer_email || "";
    const customerPhone = session.metadata?.customerPhone || "";
    const amount = session.amount_total
      ? (session.amount_total / 100).toFixed(2)
      : "0.00";
    const shippingAddress = session.metadata?.shippingAddress || "";

    // Fetch order items from database
    let items: OrderItem[] = [];
    let subtotal = "0.00";
    let shippingCost = "0.00";
    let accessToken = "";

    if (orderId) {
      try {
        const sql = getDb();

        // Update order status
        await sql`
          UPDATE orders SET
            status = 'paid',
            stripe_session_id = ${session.id},
            stripe_payment_intent = ${typeof session.payment_intent === "string" ? session.payment_intent : ""},
            paid_at = NOW()
          WHERE id = ${orderId}
        `;

        // Fetch order details for emails
        const orderRows = await sql`
          SELECT items_json, subtotal, shipping_cost, access_token FROM orders WHERE id = ${orderId}
        `;
        if (orderRows[0]) {
          items = JSON.parse(orderRows[0].items_json || "[]");
          subtotal = parseFloat(orderRows[0].subtotal || "0").toFixed(2);
          shippingCost = parseFloat(
            orderRows[0].shipping_cost || "0"
          ).toFixed(2);
          accessToken = orderRows[0].access_token || "";
        }

        // Decrement stock for each line item (prevents overselling — TD012)
        for (const item of items) {
          try {
            await sql`
              UPDATE products
              SET
                stock_quantity = GREATEST(0, stock_quantity - ${item.quantity}),
                stock_status = CASE
                  WHEN GREATEST(0, stock_quantity - ${item.quantity}) = 0 THEN 'sold-out'
                  WHEN GREATEST(0, stock_quantity - ${item.quantity}) <= 3 THEN 'low-stock'
                  ELSE stock_status
                END
              WHERE id = ${item.id}
            `;
          } catch (stockErr) {
            console.error(`Failed to decrement stock for ${item.id}:`, stockErr);
          }
        }
      } catch (dbError) {
        console.error("Failed to update/fetch order:", dbError);
      }
    }

    const orderData = {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      subtotal,
      shippingCost,
      shippingAddress,
      items,
      stripeSessionId: session.id,
      accessToken,
    };

    // Send notifications in parallel
    const promises: Promise<void>[] = [];

    // 1. GHL — create/update contact + trigger order confirmation email workflow
    promises.push(
      sendOrderConfirmationGHL(orderData)
    );

    // 2. n8n webhook for WhatsApp notification
    if (process.env.N8N_ORDER_WEBHOOK_URL) {
      promises.push(
        fetch(process.env.N8N_ORDER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "order_paid",
            orderId,
            customerName,
            customerEmail,
            customerPhone,
            amount,
            shippingAddress,
            items: items.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price,
              image: i.image,
            })),
            stripeSessionId: session.id,
            message: `New Order!\n\nCustomer: ${customerName}\nAmount: $${amount} USD\nItems: ${items.map((i) => `${i.name} x${i.quantity}`).join(", ")}\nShipping: ${shippingAddress}\n\nOrder ID: ${orderId}`,
          }),
        })
          .then(() => {
            console.log("n8n webhook triggered for WhatsApp");
          })
          .catch((err) => {
            console.error("Failed to call n8n webhook:", err);
          })
      );
    }

    await Promise.allSettled(promises);

    console.log(
      `Payment received for order ${orderId}: $${amount} from ${customerName}`
    );
  }

  return NextResponse.json({ received: true });
}
