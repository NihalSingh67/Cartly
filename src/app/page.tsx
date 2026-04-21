import { ParallaxHero } from "@/components/ParallaxHero";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { AnimatedProductCard } from "@/components/AnimatedProductCard";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: {
      seller: true,
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen">
      <ParallaxHero />
      
      {/* Marketplace Section */}
      <section className="relative z-30 bg-background min-h-screen py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-white">Trending Assets</h2>
            <Link href="/explore" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              View all &rarr;
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <AnimatedProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="relative z-30 bg-background/50 border-y border-white/5 py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-12 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["Electronics", "Home Decor", "Digital Assets", "Art"].map((cat) => (
              <Link 
                href={`/explore?category=${encodeURIComponent(cat)}`} 
                key={cat}
                className="group relative h-48 rounded-2xl bg-secondary border border-white/5 overflow-hidden flex items-center justify-center hover:border-white/20 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl font-bold text-white relative z-10 group-hover:scale-110 transition-transform duration-300">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Aura Section */}
      <section className="relative z-30 bg-background py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-16">Why Choose Cartly</h2>
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Verified Sellers</h3>
              <p className="text-zinc-400 leading-relaxed">Every seller on our platform is hand-picked and verified to ensure you only get the highest quality premium assets.</p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Secure Transactions</h3>
              <p className="text-zinc-400 leading-relaxed">Your payments are fully encrypted and secure. We ensure a smooth and safe checkout process for every single order.</p>
            </div>
            <div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Instant Delivery</h3>
              <p className="text-zinc-400 leading-relaxed">Get immediate access to your digital purchases or lightning-fast shipping for physical items right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
