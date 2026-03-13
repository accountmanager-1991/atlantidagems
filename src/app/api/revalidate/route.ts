import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const revalidateSecret = process.env.REVALIDATE_SECRET;

  if (!revalidateSecret || secret !== revalidateSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  const path = request.nextUrl.searchParams.get("path") || "/";

  revalidatePath(path);

  return NextResponse.json({
    revalidated: true,
    path,
    timestamp: new Date().toISOString(),
  });
}
