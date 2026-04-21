import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Unauthorized. Only sellers can upload images." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    
    // Ensure public/uploads exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadDir, filename);

    // Write file locally
    await writeFile(filepath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (err: any) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong during upload." },
      { status: 500 }
    );
  }
}
