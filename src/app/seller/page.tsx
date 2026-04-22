import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Plus, Package, IndianRupee, TrendingUp } from "lucide-react";
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

  const orderItems = await prisma.orderItem.findMany({
    where: {
      product: {
        sellerId: session.user.id,
      },
      order: {
        status: "PAID",
      },
    },
  });

  const totalRevenue = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalSales = orderItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">Seller Dashboard</h1>
          <p className="text-zinc-400">Manage your inventory and monitor your earnings.</p>
        </div>

        {/* Revenue Overview Stats */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-white/5 rounded-3xl p-8 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <IndianRupee className="w-24 h-24 text-primary" />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 mb-2 relative z-10">
              <IndianRupee className="w-5 h-5 text-primary" />
              <span className="font-medium text-lg">Total Revenue</span>
            </div>
            <div className="text-5xl font-bold text-white relative z-10">
              ₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div className="bg-card border border-white/5 rounded-3xl p-8 flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingUp className="w-24 h-24 text-green-500" />
            </div>
            <div className="flex items-center gap-2 text-zinc-400 mb-2 relative z-10">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="font-medium text-lg">Total Sales</span>
            </div>
            <div className="text-5xl font-bold text-white relative z-10">
              {totalSales} <span className="text-2xl text-zinc-500 font-medium">Items</span>
            </div>
          </div>
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
