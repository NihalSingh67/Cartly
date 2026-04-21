import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";
import { ProductReviews } from "@/components/ProductReviews";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      seller: true,
      reviews: {
        include: {
          user: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return notFound();

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Product Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-card border border-white/5">
          <Image 
            src={product.images[0] || "/images/bg.png"} 
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <div className="mb-2 text-sm text-primary font-medium">{product.category}</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            {product.title}
          </h1>
          <div className="text-2xl font-bold text-white mb-8">₹{product.price.toLocaleString("en-IN")}</div>
          
          <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold">
              {product.seller?.name?.[0] || "S"}
            </div>
            <div>
              <div className="text-white font-medium">{product.seller?.name || "Unknown Seller"}</div>
              <div className="text-zinc-500 text-sm">Verified Creator</div>
            </div>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>

      <ProductReviews productId={product.id} initialReviews={product.reviews as any} />
    </main>
  );
}
