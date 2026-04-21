import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to checkout." },
        { status: 401 }
      );
    }

    const { address, phone, items } = await req.json();

    if (!address || !phone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid checkout data." },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    // Create the order and items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          buyerId: session.user.id,
          total,
          address,
          phone,
          status: "PAID", // Assuming paid for this mock checkout
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json(
      { message: "Order placed successfully", orderId: order.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[CHECKOUT ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong during checkout." },
      { status: 500 }
    );
  }
}
