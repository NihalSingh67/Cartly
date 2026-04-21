"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "signup") {
      // --- REGISTER ---
      try {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Registration failed.");
          setLoading(false);
          return;
        }

        setSuccess("Account created! Signing you in…");

        // Auto sign-in after registration
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/");
          router.refresh();
        } else {
          setSuccess("");
          setError("Account created but sign-in failed. Please log in.");
          setMode("login");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      // --- LOGIN ---
      try {
        const result = await signIn("credentials", {
          email: form.email,
          password: form.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/");
          router.refresh();
        } else {
          setError("Invalid email or password.");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-3xl font-bold tracking-tighter text-white">
            CARTLY
          </Link>
          <p className="text-zinc-400 mt-2 text-sm">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <div className="bg-card border border-white/5 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          {/* Mode Toggle */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8">
            <button
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "login" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "signup" ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error / Success banners */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="checkbox"
                    id="role"
                    checked={form.role === "SELLER"}
                    onChange={(e) => setForm({ ...form, role: e.target.checked ? "SELLER" : "USER" })}
                    className="w-4 h-4 rounded bg-secondary border-white/10 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <label htmlFor="role" className="text-sm text-zinc-300">
                    Register as a Seller
                  </label>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors disabled:opacity-60 mt-2"
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                ? "Log In"
                : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-zinc-500">
              <span className="bg-card px-3">Or continue with</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full py-3 rounded-xl bg-secondary border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2a10.34 10.34 0 0 0-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </main>
  );
}
