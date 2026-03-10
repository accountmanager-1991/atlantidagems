import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { initDatabase } from "@/lib/db";

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDatabase();
    return NextResponse.json({ success: true, message: "Database initialized" });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 });
  }
}
