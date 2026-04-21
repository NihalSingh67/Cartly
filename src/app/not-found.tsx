import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen pt-32 pb-16 px-6 flex flex-col items-center justify-center text-center bg-background">
      <h2 className="text-6xl font-bold tracking-tighter text-white mb-4">404</h2>
      <p className="text-xl text-zinc-400 mb-8 max-w-md">
        This page doesn't exist yet. We are currently building out the full Aura marketplace experience.
      </p>
      <Link 
        href="/"
        className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform duration-300"
      >
        Return Home
      </Link>
    </main>
  );
}
