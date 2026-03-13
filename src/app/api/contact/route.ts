import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = rateLimit(`contact:${ip}`, MAX_SUBMISSIONS, WINDOW_MS);

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

  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  if (typeof name !== "string" || name.length > 200) {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }
  if (typeof subject !== "string" || subject.length > 300) {
    return NextResponse.json({ error: "Invalid subject" }, { status: 400 });
  }
  if (typeof message !== "string" || message.length > 5000) {
    return NextResponse.json({ error: "Message too long (max 5000 characters)" }, { status: 400 });
  }
  if (typeof email !== "string" || !EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Send contact to GHL as a lead
  const ghlKey = process.env.GHL_PRIVATE_KEY;
  const ghlLocationId = process.env.GHL_LOCATION_ID;

  if (ghlKey && ghlLocationId) {
    try {
      const nameParts = name.trim().split(" ");
      const firstName = nameParts[0] || name;
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
          tags: ["contact-form"],
          customFields: [
            { key: "contact_subject", field_value: subject },
            { key: "contact_message", field_value: message },
            { key: "contact_date", field_value: new Date().toLocaleDateString("en-US") },
          ],
        }),
      });
    } catch (err) {
      console.error("GHL contact form submission failed:", err);
    }
  }

  return NextResponse.json({ success: true });
}
