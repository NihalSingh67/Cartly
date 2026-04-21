import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Plus, Package } from "lucide-react";
import { SellerProductForm } from "@/components/SellerProductForm";
import { SellerInventory } from "@/components/SellerInventory";

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "SELLER") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    where: { sellerId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Seller Dashboard</h1>
          <p className="text-zinc-400">Manage your inventory and add new products.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Add Product Form */}
          <div className="bg-card border border-white/5 rounded-3xl p-8 h-fit">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Plus className="w-6 h-6 text-primary" />
              Add New Product
            </h2>
            <SellerProductForm />
          </div>

          {/* Inventory Management */}
          <div className="bg-card border border-white/5 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <Package className="w-6 h-6 text-primary" />
              Your Inventory
            </h2>
            <SellerInventory initialProducts={products} />
          </div>
        </div>
      </div>
    </main>
  );
}
