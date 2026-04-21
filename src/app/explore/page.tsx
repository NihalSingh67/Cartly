import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ExploreFilter } from "@/components/ExploreFilter";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const query = typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "";

  const whereClause: any = {};
  if (query) {
    whereClause.title = { contains: query, mode: "insensitive" };
  }
  if (category) {
    whereClause.category = category;
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: {
      seller: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Extract unique categories from all products to pass to the filter
  const allProducts = await prisma.product.findMany({
    select: { category: true },
  });
  const categories = Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean))) as string[];

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Explore Products</h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Discover premium items created by top verified sellers on Cartly.
          </p>
        </div>

        <ExploreFilter categories={categories} />
        
        {products.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-3xl border border-white/5">
            <h3 className="text-2xl font-bold text-white mb-2">No products found</h3>
            <p className="text-zinc-400">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id}>
                <div className="group relative rounded-2xl bg-card border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full">
                  <div className="aspect-[4/5] bg-zinc-900 w-full relative">
                    <Image
                      src={product.images[0] || "/images/bg.png"}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-5 z-20">
                    <h3 className="text-lg font-semibold text-white mb-1 truncate">{product.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400 truncate mr-2">By {product.seller?.name || "Unknown"}</span>
                      <span className="text-md font-bold text-white">₹{product.price.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
