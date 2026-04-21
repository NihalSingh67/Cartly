"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
};

export function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Review[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setComment("");
      setRating(5);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    initialReviews.length > 0
      ? initialReviews.reduce((sum, r) => sum + r.rating, 0) / initialReviews.length
      : 0;

  return (
    <div className="mt-24 pt-12 border-t border-white/10">
      <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
        Customer Reviews
        <span className="text-lg font-normal text-zinc-400 bg-secondary px-3 py-1 rounded-full">
          {initialReviews.length} {initialReviews.length === 1 ? "review" : "reviews"}
        </span>
      </h2>

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <div className="text-5xl font-bold text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex text-yellow-500 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating) ? "fill-yellow-500" : "text-zinc-600"
                  }`}
                />
              ))}
            </div>
            <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-sm text-red-400">{error}</div>}
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-1 transition-colors ${
                        star <= rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-600"
                      }`}
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? "fill-yellow-500" : ""}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-secondary border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary transition-colors text-sm"
                  rows={4}
                  placeholder="What did you think about this product?"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {initialReviews.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 bg-secondary/30 rounded-2xl border border-white/5">
              No reviews yet. Be the first to share your thoughts!
            </div>
          ) : (
            initialReviews.map((review) => (
              <div key={review.id} className="p-6 rounded-2xl bg-secondary/50 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium text-white">{review.user.name || "Anonymous"}</div>
                  <div className="text-sm text-zinc-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex text-yellow-500 mb-3 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? "fill-yellow-500" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-zinc-300 text-sm leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
