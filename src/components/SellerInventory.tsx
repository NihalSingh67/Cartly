"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  title: string;
  price: number;
  category: string | null;
  images: string[];
};

export function SellerInventory({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");
      
      setProducts(products.filter(p => p.id !== id));
      router.refresh();
    } catch (error) {
      alert(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return <div className="text-zinc-500 py-8 text-center bg-secondary/30 rounded-2xl border border-white/5">You haven't listed any products yet.</div>;
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product.id} className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-white/5 hover:border-white/10 transition-colors">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0">
            <Image src={product.images[0] || "/images/bg.png"} alt={product.title} fill className="object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{product.title}</h3>
            <p className="text-zinc-400 text-sm">{product.category}</p>
          </div>
          <div className="text-right">
            <div className="text-white font-bold mb-2">₹{product.price.toLocaleString("en-IN")}</div>
            <button
              onClick={() => handleDelete(product.id)}
              disabled={deletingId === product.id}
              className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              {deletingId === product.id ? "Deleting..." : <Trash2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
