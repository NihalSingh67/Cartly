"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type ProductProps = {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    seller: { name: string | null } | null;
  };
  index: number;
};

export function AnimatedProductCard({ product, index }: ProductProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <div className="group relative rounded-3xl bg-zinc-900/40 backdrop-blur-md border border-white/10 overflow-hidden hover:border-white/30 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 hover:-translate-y-2 cursor-pointer flex flex-col h-full">
          <div className="aspect-[4/5] bg-zinc-900 w-full relative">
            <Image
              src={product.images[0] || "/images/bg.png"}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          </div>
          <div className="absolute bottom-0 inset-x-0 p-6 z-20">
            <h3 className="text-xl font-heading font-semibold text-white mb-2 truncate group-hover:text-primary transition-colors">{product.title}</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400 truncate mr-2">By {product.seller?.name || "Unknown"}</span>
              <span className="text-lg font-bold text-white tracking-tight">₹{product.price.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
