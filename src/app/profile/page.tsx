import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Package } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen pt-32 pb-16 px-6 md:px-12 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-white mb-2">My Profile</h1>
            <p className="text-zinc-400">Welcome back, {user.name || user.email}</p>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 font-medium hover:bg-red-500/20 transition-colors w-fit"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            Order History
          </h2>

          {user.orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-zinc-400 mb-6">You haven't placed any orders yet.</p>
              <Link
                href="/explore"
                className="px-8 py-3 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {user.orders.map((order) => (
                <div key={order.id} className="border border-white/10 rounded-2xl overflow-hidden">
                  <div className="bg-secondary/50 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10">
                    <div>
                      <div className="text-zinc-400 text-sm mb-1">
                        Order <span className="font-mono text-white">#{order.id.slice(-8).toUpperCase()}</span>
                      </div>
                      <div className="text-zinc-500 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-zinc-400 text-sm mb-1">Total Amount</div>
                        <div className="text-white font-bold">₹{order.total.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-zinc-400 text-sm mb-1">Status</div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold tracking-wide">
                          {order.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-white font-medium mb-4">Items</h4>
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0">
                                <Image
                                  src={item.product.images[0] || "/images/bg.png"}
                                  alt={item.product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="text-white text-sm font-medium line-clamp-1">
                                  {item.product.title}
                                </h5>
                                <div className="text-zinc-400 text-xs mt-1">Qty: {item.quantity}</div>
                                <div className="text-white text-sm font-bold mt-1">
                                  ₹{item.price.toLocaleString("en-IN")}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-secondary/30 rounded-xl p-6 h-fit">
                        <h4 className="text-white font-medium mb-4">Delivery Details</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="text-zinc-500 block mb-1">Address</span>
                            <span className="text-zinc-300">{order.address || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 block mb-1">Phone</span>
                            <span className="text-zinc-300">{order.phone || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
