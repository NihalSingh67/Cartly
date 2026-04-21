"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: form.address,
          phone: form.phone,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Checkout failed");
      }

      clearCart();
      router.push("/profile");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 bg-background">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-8">Checkout</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Delivery Address</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="123 Main St, City, Country"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+1 234 567 890"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-2xl border border-white/5 p-8 h-fit">
          <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
                  <Image src={item.images[0] || "/images/bg.png"} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-zinc-400 text-xs">Qty: {item.quantity}</p>
                </div>
                <div className="text-white font-medium text-sm">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between mb-4 text-zinc-300">
              <span>Subtotal</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between mb-4 text-zinc-300">
              <span>Taxes (0%)</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between text-white text-2xl font-bold pt-4 border-t border-white/10">
              <span>Total</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
