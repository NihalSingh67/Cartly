import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Unauthorized. Only sellers can create products." },
        { status: 403 }
      );
    }

    const { title, description, price, category, images } = await req.json();

    if (!title || !description || !price || !category || !images || images.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        images,
        sellerId: session.user.id,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    console.error("[PRODUCT CREATION ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong while creating the product." },
      { status: 500 }
    );
  }
}
