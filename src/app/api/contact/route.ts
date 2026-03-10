import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
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

  // If Resend is configured, send email
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "Ambar & Larimar Shop <noreply@ambarlarimarshop.com>",
        to: "sales@ambarlarimarshop.com",
        subject: `Contact Form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      });
    } catch (error) {
      console.error("Failed to send email:", error);
    }
  } else {
    console.log("Contact form submission (Resend not configured):", {
      name,
      email,
      subject,
      message,
    });
  }

  return NextResponse.json({ success: true });
}
