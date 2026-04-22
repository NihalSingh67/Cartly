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
      <section className="relative z-30 bg-background min-h-screen py-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-5xl font-heading font-bold tracking-tighter text-white mb-4">Trending Assets</h2>
              <p className="text-zinc-400 text-lg">Discover the most sought-after premium items.</p>
            </div>
            <Link href="/explore" className="group flex items-center text-sm font-medium text-white hover:text-primary transition-colors">
              <span className="mr-2">Explore All</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product, idx) => (
              <AnimatedProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="relative z-30 bg-background/80 border-y border-white/5 py-32 px-6 md:px-12 backdrop-blur-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-5xl font-heading font-bold tracking-tighter text-white">Popular Categories</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {["Electronics", "Home Decor", "Digital Assets", "Art"].map((cat) => (
              <Link 
                href={`/explore?category=${encodeURIComponent(cat)}`} 
                key={cat}
                className="group relative h-56 rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden flex items-center justify-center hover:border-white/20 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-zinc-950/40 group-hover:bg-transparent transition-colors duration-500" />
                <h3 className="text-2xl font-heading font-bold text-white/90 relative z-10 group-hover:scale-110 group-hover:text-white tracking-tight transition-all duration-500">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Aura Section */}
      <section className="relative z-30 bg-background py-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.03)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-5xl font-heading font-bold tracking-tighter text-white mb-20">Why Choose Cartly</h2>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16 text-left">
            <div className="group p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4 tracking-tight">Verified Sellers</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">Every seller on our platform is hand-picked and verified to ensure you only get the highest quality premium assets.</p>
            </div>
            <div className="group p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4 tracking-tight">Secure Transactions</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">Your payments are fully encrypted and secure. We ensure a smooth and safe checkout process for every single order.</p>
            </div>
            <div className="group p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-4 tracking-tight">Instant Delivery</h3>
              <p className="text-zinc-400 leading-relaxed text-lg">Get immediate access to your digital purchases or lightning-fast shipping for physical items right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
