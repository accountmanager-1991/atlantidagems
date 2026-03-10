import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";

const CLOUD_NAME = "dlk6s7llm";
const UPLOAD_PRESET = "atlantida_unsigned";

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Unsigned upload — no API key/secret needed
    const uploadForm = new FormData();
    uploadForm.append("file", base64);
    uploadForm.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadForm }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("Cloudinary error:", data);
      return NextResponse.json(
        { error: `Cloudinary: ${data.error?.message || JSON.stringify(data)}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.secure_url,
      public_id: data.public_id,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("Upload failed:", msg);
    return NextResponse.json({ error: `Upload failed: ${msg}` }, { status: 500 });
  }
}
