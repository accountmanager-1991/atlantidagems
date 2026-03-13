import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`wholesale:${ip}`, MAX_SUBMISSIONS, WINDOW_MS);

  if (!success) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { businessName, contactName, email, phone, website, location, storeType, estimatedVolume, preferredTime, message } = body;

  if (!businessName || !contactName || !email || !location || !storeType || !estimatedVolume) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (typeof businessName !== "string" || businessName.length > 200) {
    return NextResponse.json({ error: "Invalid business name" }, { status: 400 });
  }
  if (typeof contactName !== "string" || contactName.length > 200) {
    return NextResponse.json({ error: "Invalid contact name" }, { status: 400 });
  }
  if (message && (typeof message !== "string" || message.length > 5000)) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // Send wholesale lead to GHL
  const ghlKey = process.env.GHL_PRIVATE_KEY;
  const ghlLocationId = process.env.GHL_LOCATION_ID;

  if (ghlKey && ghlLocationId) {
    try {
      const nameParts = contactName.trim().split(" ");
      const firstName = nameParts[0] || contactName;
      const lastName = nameParts.slice(1).join(" ") || "";

      await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ghlKey}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify({
          locationId: ghlLocationId,
          firstName,
          lastName,
          email,
          phone: phone || "",
          companyName: businessName,
          website: website || "",
          tags: ["wholesale-inquiry"],
          customFields: [
            { key: "wholesale_location", field_value: location },
            { key: "wholesale_store_type", field_value: storeType },
            { key: "wholesale_volume", field_value: estimatedVolume },
            { key: "wholesale_preferred_time", field_value: preferredTime || "Flexible" },
            { key: "wholesale_message", field_value: message || "" },
            { key: "wholesale_date", field_value: new Date().toLocaleDateString("en-US") },
          ],
        }),
      });
    } catch (err) {
      console.error("GHL wholesale inquiry failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
