"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 bg-background flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-white mb-4">Your Cart is Empty</h1>
        <p className="text-zinc-400 mb-8 max-w-md">Looks like you haven't added any premium assets to your cart yet.</p>
        <Link href="/" className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform duration-300">
          Continue Exploring
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 bg-background">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tighter text-white mb-12">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl bg-card border border-white/5">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                  <Image src={item.images[0] || "/images/bg.png"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-zinc-400 text-sm mb-2">{item.category}</p>
                  <div className="text-white font-bold">₹{item.price.toLocaleString("en-IN")}</div>
                </div>
                <div className="text-right flex flex-col items-end gap-2 pr-4">
                  <div className="flex items-center bg-secondary rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-white text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-400 p-2 transition-colors mt-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-card rounded-2xl border border-white/5 p-8 h-fit">
            <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
            <div className="flex justify-between mb-4 text-zinc-300">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between mb-6 text-zinc-300 pb-6 border-b border-white/10">
              <span>Taxes (0%)</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between mb-8 text-white text-2xl font-bold">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              Checkout Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
