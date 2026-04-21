import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be logged in to leave a review." },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Valid product ID and rating (1-5) are required." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        userId: session.user.id,
        rating,
        comment,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err: any) {
    console.error("[REVIEW CREATION ERROR]", err);
    return NextResponse.json(
      { error: "Something went wrong while submitting the review." },
      { status: 500 }
    );
  }
}
