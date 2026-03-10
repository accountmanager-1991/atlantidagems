import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { businessName, contactName, email, phone, website, location, storeType, estimatedVolume, preferredTime, message } = body;

  // Required fields
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

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Ambar & Larimar Shop <noreply@ambarlarimarshop.com>",
        to: "sales@ambarlarimarshop.com",
        subject: `Wholesale Call Request: ${businessName}`,
        text: `New wholesale call request:\n\nBusiness: ${businessName}\nContact: ${contactName}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nWebsite: ${website || "N/A"}\nLocation: ${location}\nStore Type: ${storeType}\nEstimated Volume: ${estimatedVolume}\nPreferred Call Time: ${preferredTime || "Flexible"}\n\nMessage:\n${message || "None"}`,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  } else {
    console.log("Wholesale inquiry (Resend not configured):", body);
  }

  return NextResponse.json({ success: true });
}
