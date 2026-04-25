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

// Move a contact's Opportunity through the GHL sales pipeline by status.
// Requires GHL_PIPELINE_ID + 5 stage IDs configured in env vars.
// Silently skips if env vars are missing — the app still works without it.
export async function updateOpportunityStageByStatus(
  contactEmail: string,
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled",
  orderId: string,
  amount: string,
): Promise<void> {
  const pipelineId = process.env.GHL_PIPELINE_ID;
  const stageMap: Record<string, string | undefined> = {
    pending: process.env.GHL_STAGE_PENDING,
    paid: process.env.GHL_STAGE_PAID,
    shipped: process.env.GHL_STAGE_SHIPPED,
    delivered: process.env.GHL_STAGE_DELIVERED,
    cancelled: process.env.GHL_STAGE_CANCELLED,
  };
  const stageId = stageMap[status];
  const locationId = process.env.GHL_LOCATION_ID;
  const apiKey = process.env.GHL_PRIVATE_KEY;

  if (!apiKey || !locationId || !pipelineId || !stageId) {
    // Pipeline sync not configured — that's OK, contact tagging still happens
    return;
  }

  try {
    // 1. Find the contact by email to get its contactId
    const contactRes = await fetch(
      `${GHL_API_URL}/contacts/search?locationId=${locationId}&query=${encodeURIComponent(contactEmail)}`,
      { headers: getHeaders() },
    );
    if (!contactRes.ok) return;
    const contactJson = await contactRes.json();
    const contactId = contactJson.contacts?.[0]?.id;
    if (!contactId) return;

    // 2. Find the contact's Opportunity in this pipeline (or create one)
    const oppSearchRes = await fetch(
      `${GHL_API_URL}/opportunities/search?location_id=${locationId}&pipeline_id=${pipelineId}&contact_id=${contactId}`,
      { headers: getHeaders() },
    );
    let opportunityId: string | undefined;
    if (oppSearchRes.ok) {
      const oppJson = await oppSearchRes.json();
      opportunityId = oppJson.opportunities?.[0]?.id;
    }

    if (opportunityId) {
      // Update existing opportunity's stage
      await fetch(`${GHL_API_URL}/opportunities/${opportunityId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({
          pipelineId,
          pipelineStageId: stageId,
          status: status === "cancelled" ? "lost" : status === "delivered" ? "won" : "open",
          name: `Order ${orderId}`,
          monetaryValue: parseFloat(amount) || 0,
        }),
      });
      console.log(`GHL pipeline: opp ${opportunityId} → stage ${status}`);
    } else {
      // Create a new opportunity in the pipeline
      await fetch(`${GHL_API_URL}/opportunities/`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          pipelineId,
          locationId,
          pipelineStageId: stageId,
          status: status === "cancelled" ? "lost" : status === "delivered" ? "won" : "open",
          name: `Order ${orderId}`,
          contactId,
          monetaryValue: parseFloat(amount) || 0,
        }),
      });
      console.log(`GHL pipeline: created opp for ${contactEmail} at stage ${status}`);
    }
  } catch (err) {
    console.error("GHL pipeline sync failed:", err);
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
