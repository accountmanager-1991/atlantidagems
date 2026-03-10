import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe, calculateShipping } from "@/lib/stripe";
import { getDb } from "@/lib/db";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment processing is not configured yet. Please contact us to place your order." },
        { status: 503 }
      );
    }

    const body: CheckoutBody = await request.json();
    const { items, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = calculateShipping(subtotal);

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          ...(item.image && item.image !== "" ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping (Flat Rate)",
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Validate shipping fields
    if (!shipping || !shipping.email || !shipping.firstName || !shipping.lastName || !shipping.address || !shipping.city || !shipping.country) {
      return NextResponse.json({ error: "Missing required shipping information" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shipping.email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Validate items
    for (const item of items) {
      if (!item.name || typeof item.price !== "number" || item.price <= 0 || !item.quantity || item.quantity < 1) {
        return NextResponse.json({ error: "Invalid item in cart" }, { status: 400 });
      }
    }

    // Save order to database — must succeed before creating Stripe session
    let orderId: string;
    try {
      const sql = getDb();
      const result = await sql`
        INSERT INTO orders (
          customer_email, customer_name, customer_phone,
          shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country,
          items_json, subtotal, shipping_cost, total, status
        ) VALUES (
          ${shipping.email},
          ${shipping.firstName + " " + shipping.lastName},
          ${shipping.phone || ""},
          ${shipping.address},
          ${shipping.city},
          ${shipping.state || ""},
          ${shipping.zip || ""},
          ${shipping.country},
          ${JSON.stringify(items)},
          ${subtotal},
          ${shippingCost},
          ${subtotal + shippingCost},
          'pending'
        )
        RETURNING id
      `;
      orderId = result[0]?.id;
      if (!orderId) throw new Error("No order ID returned");
    } catch (dbError) {
      console.error("Failed to save order to DB:", dbError);
      return NextResponse.json(
        { error: "Unable to create order. Please try again." },
        { status: 500 }
      );
    }

    // Create Stripe Checkout Session
    const session = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: shipping.email,
      metadata: {
        orderId,
        customerName: `${shipping.firstName} ${shipping.lastName}`,
        customerPhone: shipping.phone,
        shippingAddress: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ambarlarimarshop.vercel.app"}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://ambarlarimarshop.vercel.app"}/checkout`,
    });

    return NextResponse.json({ url: session.url, orderId });
  } catch (error) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
