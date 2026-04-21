"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShoppingCart, User, PlusCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { items } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-white/10 shadow-xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
          CARTLY
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <Link href="/" className="hover:text-white transition-colors">Explore</Link>
          <Link href="/sellers" className="hover:text-white transition-colors">Sellers</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-6 text-zinc-300">
          <button className="hover:text-white transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/cart" className="hover:text-white transition-colors relative">
            <ShoppingCart className="w-5 h-5" />
            {mounted && items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </Link>
          {session?.user?.role === "SELLER" && (
            <Link href="/seller" className="hover:text-white transition-colors">
              <PlusCircle className="w-5 h-5" />
            </Link>
          )}
          <Link href="/profile" className="hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
