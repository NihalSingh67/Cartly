import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "SELLER") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    if (product.sellerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own products." },
        { status: 403 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Product deleted successfully." }, { status: 200 });
  } catch (err: any) {
    console.error("[PRODUCT DELETION ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong while deleting the product." },
      { status: 500 }
    );
  }
}
