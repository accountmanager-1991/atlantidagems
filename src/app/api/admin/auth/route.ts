import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { generateSessionToken } from "@/lib/admin-auth";
import { rateLimit } from "@/lib/rate-limit";

const MAX_LOGIN_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success, remaining, resetIn } = rateLimit(`login:${ip}`, MAX_LOGIN_ATTEMPTS, WINDOW_MS);

  if (!success) {
    const retryAfter = Math.ceil(resetIn / 1000);
    return NextResponse.json(
      { error: "Too many login attempts. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  const { password } = await request.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { error: `Invalid password. ${remaining} attempts remaining.` },
      { status: 401 }
    );
  }

  const token = generateSessionToken(adminPassword);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  return NextResponse.json({ success: true });
}
