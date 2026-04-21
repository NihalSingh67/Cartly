"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SellerProductForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let uploadedImageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json();
          throw new Error(uploadData.error || "Failed to upload image");
        }

        const uploadData = await uploadRes.json();
        uploadedImageUrl = uploadData.url;
      }

      if (!uploadedImageUrl) {
        throw new Error("Please select an image to upload.");
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: form.price,
          category: form.category,
          images: [uploadedImageUrl],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create product");
      }

      setSuccess("Product created successfully!");
      setForm({
        title: "",
        description: "",
        price: "",
        category: "",
      });
      setImageFile(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
          {success}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Product Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. Minimalist Ceramic Vase"
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe your product..."
          className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            placeholder="1499.00"
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            placeholder="e.g. Home Decor"
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Product Image</label>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
            className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-colors focus:outline-none focus:border-white/30 cursor-pointer"
          />
        </div>
        {imageFile && (
          <p className="mt-2 text-sm text-zinc-400">Selected: {imageFile.name}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}
