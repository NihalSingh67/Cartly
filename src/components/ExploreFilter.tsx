"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export function ExploreFilter({ categories }: { categories: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      
      router.push(`/explore?${params.toString()}`);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, category, router]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-12">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>
      <div className="w-full md:w-64">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
