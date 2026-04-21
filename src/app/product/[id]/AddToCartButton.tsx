"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => setQuantity((prev) => prev + 1);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center bg-secondary rounded-xl p-1">
        <button
          onClick={handleDecrease}
          className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="w-12 text-center text-white font-medium">
          {quantity}
        </span>
        <button
          onClick={handleIncrease}
          className="p-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      <button 
        onClick={() => addToCart(product, quantity)}
        className="flex-1 flex items-center justify-center gap-3 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors"
      >
        <ShoppingCart className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  );
}
