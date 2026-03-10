import { NextRequest, NextResponse } from "next/server";
import {
  customerConfirmationEmail,
  ownerOrderNotificationEmail,
  shippingConfirmationEmail,
} from "@/lib/email-templates";

const SAMPLE_ITEMS = [
  {
    id: "1",
    name: "Larimar Heart Pendant - Sterling Silver",
    price: 89.99,
    quantity: 1,
    image: "https://res.cloudinary.com/dlk6s7llm/image/upload/v1/atlantidagems/products/sample-larimar.jpg",
  },
  {
    id: "2",
    name: "Dominican Blue Amber Earrings - Gold",
    price: 149.99,
    quantity: 2,
    image: "https://res.cloudinary.com/dlk6s7llm/image/upload/v1/atlantidagems/products/sample-amber.jpg",
  },
];

const SAMPLE_ORDER = {
  orderId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  customerName: "Maria Rodriguez",
  customerEmail: "maria@example.com",
  customerPhone: "+1 (305) 555-0123",
  amount: "409.96",
  subtotal: "389.97",
  shippingCost: "19.99",
  shippingAddress: "123 Ocean Drive, Miami, FL 33139, United States",
  items: SAMPLE_ITEMS,
  stripeSessionId: "cs_test_a1b2c3d4e5f6",
};

export async function GET(request: NextRequest) {
  const template = request.nextUrl.searchParams.get("template") || "confirmation";

  let html: string;

  switch (template) {
    case "confirmation":
      html = customerConfirmationEmail(SAMPLE_ORDER);
      break;
    case "owner":
      html = ownerOrderNotificationEmail(SAMPLE_ORDER);
      break;
    case "shipping":
      html = shippingConfirmationEmail({
        orderId: SAMPLE_ORDER.orderId,
        customerName: SAMPLE_ORDER.customerName,
        trackingNumber: "9400111899223456789012",
        trackingCarrier: "USPS",
        items: SAMPLE_ITEMS,
      });
      break;
    default:
      // Show index page with links to all templates
      html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Email Template Previews</title></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px;">
  <h1 style="color: #0E3A54;">Email Template Previews</h1>
  <p style="color: #666;">Click to preview each email template:</p>
  <ul style="line-height: 2.5; font-size: 16px;">
    <li><a href="?template=confirmation">Customer Order Confirmation</a></li>
    <li><a href="?template=owner">Owner Notification (with images)</a></li>
    <li><a href="?template=shipping">Shipping Confirmation (with tracking)</a></li>
  </ul>
  <p style="color: #999; font-size: 12px; margin-top: 30px;">
    These previews use sample data. Real emails will contain actual order info.
  </p>
</body>
</html>`;
  }

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
