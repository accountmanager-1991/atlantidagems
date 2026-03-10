import { cookies } from "next/headers";
import { createHmac, randomBytes } from "crypto";

const COOKIE_NAME = "admin_session";

/**
 * Generate an HMAC-signed session token.
 * Format: `nonce.signature` where signature = HMAC-SHA256(nonce, ADMIN_PASSWORD)
 * This way the cookie never contains the raw password.
 */
export function generateSessionToken(adminPassword: string): string {
  const nonce = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", adminPassword)
    .update(nonce)
    .digest("hex");
  return `${nonce}.${signature}`;
}

/**
 * Verify that a session token was signed with the current ADMIN_PASSWORD.
 */
function verifySessionToken(token: string, adminPassword: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [nonce, signature] = parts;
  const expected = createHmac("sha256", adminPassword)
    .update(nonce)
    .digest("hex");
  // Timing-safe comparison
  if (signature.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function isAdmin(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;

  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  if (!session?.value) return false;

  return verifySessionToken(session.value, adminPassword);
}
