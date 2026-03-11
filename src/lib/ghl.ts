// GoHighLevel API integration — creates/updates contacts with tags + custom fields

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  amount: string;
  shippingAddress?: string;
  items: OrderItem[];
  accessToken?: string;
}

interface ShippingData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  trackingNumber: string;
  trackingCarrier: string;
  items: OrderItem[];
}

const GHL_API_URL = "https://services.leadconnectorhq.com";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.GHL_PRIVATE_KEY}`,
    "Content-Type": "application/json",
    Version: "2021-07-28",
  };
}

async function upsertContact(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  tags: string[],
  customFields: { key: string; field_value: string }[]
) {
  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) throw new Error("GHL_LOCATION_ID not set");

  const res = await fetch(`${GHL_API_URL}/contacts/upsert`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      locationId,
      firstName,
      lastName,
      email,
      phone,
      tags,
      customFields,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GHL upsert failed: ${err}`);
  }

  const json = await res.json();
  console.log(`GHL contact upserted: ${email}`);
  return json.contact?.id as string;
}

// Called on new paid order — tags contact as "order-placed"
export async function sendOrderConfirmationGHL(data: OrderData) {
  if (!process.env.GHL_PRIVATE_KEY || !process.env.GHL_LOCATION_ID) {
    console.warn("GHL credentials not set — skipping");
    return;
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ambarlarimarshop.vercel.app";
    const trackingUrl = data.accessToken
      ? `${baseUrl}/order/${data.orderId}?token=${data.accessToken}`
      : `${baseUrl}/order/${data.orderId}`;

    const itemsSummary = data.items
      .map((i) => `${i.name} x${i.quantity} — $${i.price.toFixed(2)}`)
      .join(", ");

    const nameParts = data.customerName.trim().split(" ");
    const firstName = nameParts[0] || data.customerName;
    const lastName = nameParts.slice(1).join(" ") || "";

    await upsertContact(
      data.customerEmail,
      firstName,
      lastName,
      data.customerPhone || "",
      ["order-placed", "customer"],
      [
        { key: "order_id", field_value: data.orderId },
        { key: "order_total", field_value: `$${data.amount}` },
        { key: "order_date", field_value: new Date().toLocaleDateString("en-US") },
        { key: "order_items", field_value: itemsSummary },
        { key: "shipping_address", field_value: data.shippingAddress || "" },
        { key: "order_tracking_url", field_value: trackingUrl },
      ]
    );
  } catch (err) {
    console.error("GHL order confirmation failed:", err);
  }
}

// Called when admin adds tracking — tags contact as "order-shipped"
export async function sendShippingConfirmationGHL(data: ShippingData) {
  if (!process.env.GHL_PRIVATE_KEY || !process.env.GHL_LOCATION_ID) {
    console.warn("GHL credentials not set — skipping");
    return;
  }

  try {
    const carrierUrls: Record<string, string> = {
      USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${data.trackingNumber}`,
      UPS: `https://www.ups.com/track?tracknum=${data.trackingNumber}`,
      FedEx: `https://www.fedex.com/fedextrack/?trknbr=${data.trackingNumber}`,
      DHL: `https://www.dhl.com/en/express/tracking.html?AWB=${data.trackingNumber}`,
    };
    const trackingUrl = carrierUrls[data.trackingCarrier] || "";

    const nameParts = data.customerName.trim().split(" ");
    const firstName = nameParts[0] || data.customerName;
    const lastName = nameParts.slice(1).join(" ") || "";

    await upsertContact(
      data.customerEmail,
      firstName,
      lastName,
      "",
      ["order-shipped"],
      [
        { key: "tracking_number", field_value: data.trackingNumber },
        { key: "shipping_carrier", field_value: data.trackingCarrier },
        { key: "tracking_url", field_value: trackingUrl },
      ]
    );
  } catch (err) {
    console.error("GHL shipping confirmation failed:", err);
  }
}
