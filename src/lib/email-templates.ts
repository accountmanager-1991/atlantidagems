// Email HTML templates for order notifications

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: string;
  subtotal: string;
  shippingCost: string;
  shippingAddress: string;
  items: OrderItem[];
  stripeSessionId: string;
  accessToken?: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const BRAND_COLORS = {
  gold: "#C9A84C",
  goldLight: "#EDD8A0",
  ocean: "#0E3A54",
  cream: "#FAF7F0",
  navy: "#0C1420",
  larimar: "#3AADCC",
};

function itemRowsHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        ${
          item.image
            ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="60" height="60" style="border-radius: 4px; object-fit: cover;" />`
            : `<div style="width:60px;height:60px;background:#f0f0f0;border-radius:4px;"></div>`
        }
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-family: 'Georgia', serif;">
        ${escapeHtml(item.name)}<br/>
        <span style="color: #999; font-size: 13px;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-family: 'Georgia', serif;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>`
    )
    .join("");
}

export function customerConfirmationEmail(order: OrderData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0; padding:0; background-color: ${BRAND_COLORS.cream}; font-family: 'Georgia', 'Times New Roman', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND_COLORS.cream};">
    <tr><td align="center" style="padding: 40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background: ${BRAND_COLORS.ocean}; padding: 30px; text-align: center;">
            <h1 style="color: ${BRAND_COLORS.goldLight}; font-size: 24px; margin: 0; letter-spacing: 3px; font-family: 'Georgia', serif;">
              AMBAR & LARIMAR SHOP
            </h1>
            <p style="color: ${BRAND_COLORS.larimar}; font-size: 12px; margin: 8px 0 0; letter-spacing: 2px;">
              FINE CARIBBEAN JEWELRY
            </p>
          </td>
        </tr>

        <!-- Thank You -->
        <tr>
          <td style="padding: 40px 30px 20px; text-align: center;">
            <div style="width: 60px; height: 60px; background: ${BRAND_COLORS.goldLight}; border-radius: 50%; margin: 0 auto 20px; line-height: 60px; font-size: 28px;">
              ✓
            </div>
            <h2 style="color: ${BRAND_COLORS.ocean}; margin: 0 0 10px; font-size: 22px;">Thank You for Your Order!</h2>
            <p style="color: #666; margin: 0; font-size: 15px;">
              Hi ${escapeHtml(order.customerName)}, your order has been confirmed.
            </p>
          </td>
        </tr>

        <!-- Order ID -->
        <tr>
          <td style="padding: 0 30px 20px; text-align: center;">
            <div style="background: ${BRAND_COLORS.cream}; border-radius: 6px; padding: 12px; display: inline-block;">
              <span style="color: #999; font-size: 12px; letter-spacing: 1px;">ORDER ID</span><br/>
              <span style="color: ${BRAND_COLORS.ocean}; font-size: 16px; font-weight: bold;">${order.orderId}</span>
            </div>
          </td>
        </tr>

        <!-- Gold divider -->
        <tr>
          <td style="padding: 0 30px;">
            <div style="height: 2px; background: linear-gradient(to right, transparent, ${BRAND_COLORS.gold}, transparent);"></div>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding: 20px 30px;">
            <h3 style="color: ${BRAND_COLORS.ocean}; margin: 0 0 15px; font-size: 16px; letter-spacing: 1px;">YOUR ITEMS</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemRowsHtml(order.items)}
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding: 0 30px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background: ${BRAND_COLORS.cream}; border-radius: 6px; padding: 15px;">
              <tr>
                <td style="padding: 8px 15px; color: #666;">Subtotal</td>
                <td style="padding: 8px 15px; text-align: right; color: #333;">$${order.subtotal} USD</td>
              </tr>
              <tr>
                <td style="padding: 8px 15px; color: #666;">Shipping</td>
                <td style="padding: 8px 15px; text-align: right; color: #333;">
                  ${parseFloat(order.shippingCost) === 0 ? '<span style="color: #27ae60;">FREE</span>' : `$${order.shippingCost} USD`}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 15px; border-top: 2px solid ${BRAND_COLORS.gold}; color: ${BRAND_COLORS.ocean}; font-weight: bold; font-size: 18px;">Total</td>
                <td style="padding: 8px 15px; border-top: 2px solid ${BRAND_COLORS.gold}; text-align: right; color: ${BRAND_COLORS.ocean}; font-weight: bold; font-size: 18px;">$${order.amount} USD</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Shipping Address -->
        <tr>
          <td style="padding: 0 30px 20px;">
            <h3 style="color: ${BRAND_COLORS.ocean}; margin: 0 0 10px; font-size: 14px; letter-spacing: 1px;">SHIPPING TO</h3>
            <p style="color: #555; margin: 0; line-height: 1.6; font-size: 14px;">
              ${escapeHtml(order.shippingAddress).replace(/, /g, "<br/>")}
            </p>
          </td>
        </tr>

        <!-- What's Next -->
        <tr>
          <td style="padding: 0 30px 30px;">
            <div style="background: ${BRAND_COLORS.cream}; border-radius: 6px; padding: 20px; border-left: 3px solid ${BRAND_COLORS.gold};">
              <h4 style="color: ${BRAND_COLORS.ocean}; margin: 0 0 10px;">What's Next?</h4>
              <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.6;">
                Your handcrafted jewelry will be carefully packaged and shipped within <strong>2-3 business days</strong>.
                We'll send you a tracking number once your order ships.
              </p>
              <p style="margin: 12px 0 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://ambarlarimarshop.vercel.app"}/order/${order.orderId}${order.accessToken ? `?token=${order.accessToken}` : ""}" style="color: ${BRAND_COLORS.larimar}; font-size: 14px;">
                  Track your order →
                </a>
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: ${BRAND_COLORS.navy}; padding: 25px 30px; text-align: center;">
            <p style="color: ${BRAND_COLORS.goldLight}; margin: 0 0 5px; font-size: 14px;">
              Ambar & Larimar Shop
            </p>
            <p style="color: #888; margin: 0; font-size: 12px;">
              Fine Caribbean Jewelry · Dominican Republic
            </p>
            <p style="color: #666; margin: 10px 0 0; font-size: 11px;">
              Questions? Reply to this email or contact us at sales@ambarlarimarshop.com
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function ownerOrderNotificationEmail(order: OrderData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0; padding:0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr><td align="center" style="padding: 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden;">

        <!-- Header -->
        <tr>
          <td style="background: #27ae60; padding: 20px; text-align: center;">
            <h1 style="color: white; font-size: 22px; margin: 0;">💰 New Order — $${order.amount} USD</h1>
          </td>
        </tr>

        <!-- Customer Info -->
        <tr>
          <td style="padding: 25px;">
            <h3 style="margin: 0 0 15px; color: #333; border-bottom: 2px solid ${BRAND_COLORS.gold}; padding-bottom: 8px;">
              Customer Details
            </h3>
            <table width="100%" cellpadding="4" cellspacing="0">
              <tr><td style="color:#666; width:120px;">Name:</td><td style="color:#333; font-weight:bold;">${escapeHtml(order.customerName)}</td></tr>
              <tr><td style="color:#666;">Email:</td><td><a href="mailto:${escapeHtml(order.customerEmail)}" style="color: ${BRAND_COLORS.larimar};">${escapeHtml(order.customerEmail)}</a></td></tr>
              <tr><td style="color:#666;">Phone:</td><td><a href="tel:${escapeHtml(order.customerPhone || "")}" style="color: ${BRAND_COLORS.larimar};">${escapeHtml(order.customerPhone || "Not provided")}</a></td></tr>
              <tr><td style="color:#666;">Address:</td><td style="color:#333;">${escapeHtml(order.shippingAddress)}</td></tr>
            </table>
          </td>
        </tr>

        <!-- Items with images -->
        <tr>
          <td style="padding: 0 25px 25px;">
            <h3 style="margin: 0 0 15px; color: #333; border-bottom: 2px solid ${BRAND_COLORS.gold}; padding-bottom: 8px;">
              Items Ordered
            </h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${order.items
                .map(
                  (item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; vertical-align: top;">
                  ${
                    item.image
                      ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" width="80" height="80" style="border-radius: 6px; object-fit: cover; border: 1px solid #eee;" />`
                      : `<div style="width:80px;height:80px;background:#f0f0f0;border-radius:6px;"></div>`
                  }
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; vertical-align: top;">
                  <strong style="color: #333;">${escapeHtml(item.name)}</strong><br/>
                  <span style="color: #666;">Qty: ${item.quantity} × $${item.price.toFixed(2)}</span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; vertical-align: top;">
                  <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                </td>
              </tr>`
                )
                .join("")}
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding: 0 25px 25px;">
            <table width="100%" cellpadding="6" cellspacing="0" style="background: #f9f9f9; border-radius: 6px;">
              <tr><td style="color:#666;">Subtotal:</td><td style="text-align:right;">$${order.subtotal}</td></tr>
              <tr><td style="color:#666;">Shipping:</td><td style="text-align:right;">${parseFloat(order.shippingCost) === 0 ? "FREE" : "$" + order.shippingCost}</td></tr>
              <tr style="font-size: 18px; font-weight: bold;">
                <td style="color: #27ae60; border-top: 2px solid #27ae60; padding-top: 12px;">TOTAL:</td>
                <td style="text-align: right; color: #27ae60; border-top: 2px solid #27ae60; padding-top: 12px;">$${order.amount} USD</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Quick Actions -->
        <tr>
          <td style="padding: 0 25px 25px;">
            <table width="100%" cellpadding="0" cellspacing="8">
              <tr>
                <td style="text-align: center;">
                  <a href="https://dashboard.stripe.com" style="display: inline-block; background: ${BRAND_COLORS.ocean}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px;">
                    View in Stripe
                  </a>
                </td>
                <td style="text-align: center;">
                  <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://ambarlarimarshop.vercel.app"}/admin" style="display: inline-block; background: ${BRAND_COLORS.gold}; color: #333; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-size: 14px;">
                    Admin Panel
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: #333; padding: 15px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">
              Order ID: ${order.orderId} | Stripe: ${order.stripeSessionId}
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function shippingConfirmationEmail(order: {
  orderId: string;
  customerName: string;
  trackingNumber: string;
  trackingCarrier: string;
  items: OrderItem[];
}): string {
  const trackingUrl = getTrackingUrl(order.trackingCarrier, order.trackingNumber);

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0; padding:0; background-color: ${BRAND_COLORS.cream}; font-family: 'Georgia', 'Times New Roman', serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND_COLORS.cream};">
    <tr><td align="center" style="padding: 40px 20px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background: ${BRAND_COLORS.ocean}; padding: 30px; text-align: center;">
            <h1 style="color: ${BRAND_COLORS.goldLight}; font-size: 24px; margin: 0; letter-spacing: 3px;">
              AMBAR & LARIMAR SHOP
            </h1>
          </td>
        </tr>

        <!-- Shipped! -->
        <tr>
          <td style="padding: 40px 30px 20px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
            <h2 style="color: ${BRAND_COLORS.ocean}; margin: 0 0 10px; font-size: 22px;">Your Order Has Shipped!</h2>
            <p style="color: #666; margin: 0; font-size: 15px;">
              Hi ${escapeHtml(order.customerName)}, great news — your jewelry is on its way!
            </p>
          </td>
        </tr>

        <!-- Tracking Info -->
        <tr>
          <td style="padding: 0 30px 30px;">
            <div style="background: ${BRAND_COLORS.cream}; border-radius: 8px; padding: 25px; text-align: center; border: 1px solid ${BRAND_COLORS.goldLight};">
              <p style="color: #999; font-size: 12px; letter-spacing: 2px; margin: 0 0 8px;">TRACKING NUMBER</p>
              <p style="color: ${BRAND_COLORS.ocean}; font-size: 20px; font-weight: bold; margin: 0 0 5px; letter-spacing: 1px;">
                ${escapeHtml(order.trackingNumber)}
              </p>
              <p style="color: #666; font-size: 14px; margin: 0 0 15px;">
                Carrier: ${escapeHtml(order.trackingCarrier || "Standard Shipping")}
              </p>
              ${
                trackingUrl
                  ? `<a href="${trackingUrl}" style="display: inline-block; background: ${BRAND_COLORS.gold}; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-size: 14px; letter-spacing: 1px;">
                  TRACK YOUR PACKAGE
                </a>`
                  : ""
              }
            </div>
          </td>
        </tr>

        <!-- Items -->
        <tr>
          <td style="padding: 0 30px 20px;">
            <h3 style="color: ${BRAND_COLORS.ocean}; margin: 0 0 15px; font-size: 14px; letter-spacing: 1px;">ITEMS IN THIS SHIPMENT</h3>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${itemRowsHtml(order.items)}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background: ${BRAND_COLORS.navy}; padding: 25px 30px; text-align: center;">
            <p style="color: ${BRAND_COLORS.goldLight}; margin: 0 0 5px; font-size: 14px;">
              Ambar & Larimar Shop
            </p>
            <p style="color: #666; margin: 10px 0 0; font-size: 11px;">
              Questions? Contact us at sales@ambarlarimarshop.com
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function getTrackingUrl(carrier: string, trackingNumber: string): string {
  const c = carrier.toLowerCase();
  if (c.includes("usps")) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  if (c.includes("ups")) return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  if (c.includes("fedex")) return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
  if (c.includes("dhl")) return `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${trackingNumber}`;
  return "";
}
