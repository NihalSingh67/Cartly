import { prisma } from "@/lib/prisma";

export default async function SellersPage() {
  const sellers = await prisma.user.findMany({
    where: { role: "SELLER" },
    include: {
      products: true,
    },
  });

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">Our Sellers</h1>
          <p className="text-xl text-zinc-400 max-w-2xl">
            Meet the verified creators powering the Aura marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sellers.map((seller) => (
            <div
              key={seller.id}
              className="group rounded-2xl bg-card border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500 p-8 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-bold text-white mb-4">
                {seller.name?.[0]?.toUpperCase() || "S"}
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{seller.name}</h3>
              <p className="text-sm text-zinc-500 mb-4">{seller.email}</p>
              <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium">
                {seller.products.length} assets listed
              </div>
            </div>
          ))}

          {sellers.length === 0 && (
            <div className="col-span-3 text-center py-24">
              <p className="text-zinc-500 text-lg">No sellers yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
