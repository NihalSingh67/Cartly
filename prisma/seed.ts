import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding realistic database...");

  // Create sellers
  const passwordHash = await bcrypt.hash("password123", 10);

  const sellersData = [
    {
      email: "techhaven@cartly.in",
      name: "Tech Haven",
      role: "SELLER",
      password: passwordHash,
    },
    {
      email: "cartlydesigns@cartly.in",
      name: "Cartly Designs",
      role: "SELLER",
      password: passwordHash,
    },
    {
      email: "luxehome@cartly.in",
      name: "Luxe Home",
      role: "SELLER",
      password: passwordHash,
    },
    {
      email: "digitalmasters@cartly.in",
      name: "Digital Masters",
      role: "SELLER",
      password: passwordHash,
    },
  ];

  const sellers = await Promise.all(
    sellersData.map((data) =>
      prisma.user.upsert({
        where: { email: data.email },
        update: {},
        create: data,
      })
    )
  );

  const techHaven = sellers[0];
  const cartlyDesigns = sellers[1];
  const luxeHome = sellers[2];
  const digitalMasters = sellers[3];

  // Create products
  const productsData = [
    {
      title: "Sony WH-1000XM5 Wireless Headphones",
      description: "Industry leading noise cancellation, optimized for High-Resolution Audio.",
      price: 29990.0,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=80"],
      sellerId: techHaven.id,
    },
    {
      title: "Apple MacBook Pro M3 Max",
      description: "The most advanced Mac ever built. 16-inch Liquid Retina XDR display.",
      price: 319900.0,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"],
      sellerId: techHaven.id,
    },
    {
      title: "Keychron K2 Wireless Mechanical Keyboard",
      description: "A versatile wireless mechanical keyboard engineered to maximize your workspace.",
      price: 8499.0,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80"],
      sellerId: techHaven.id,
    },
    {
      title: "Minimalist Ceramic Vase",
      description: "Handcrafted ceramic vase with a matte finish. Perfect for dried flowers.",
      price: 1299.0,
      category: "Home Decor",
      images: ["https://images.unsplash.com/photo-1578500494198-246f612b3b6d?w=800&auto=format&fit=crop&q=80"],
      sellerId: luxeHome.id,
    },
    {
      title: "Mid-Century Modern Lounge Chair",
      description: "Premium leather lounge chair with solid walnut wood framing.",
      price: 45999.0,
      category: "Furniture",
      images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&auto=format&fit=crop&q=80"],
      sellerId: luxeHome.id,
    },
    {
      title: "Abstract Canvas Wall Art",
      description: "Large 40x40 abstract canvas art. Original acrylic painting.",
      price: 5999.0,
      category: "Art",
      images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop&q=80"],
      sellerId: cartlyDesigns.id,
    },
    {
      title: "Onyx Dark UI Kit",
      description: "Premium Figma UI kit with 500+ dark mode components.",
      price: 2499.0,
      category: "Digital Assets",
      images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80"],
      sellerId: cartlyDesigns.id,
    },
    {
      title: "Matte Black Coffee Mug",
      description: "Insulated 12oz coffee mug with a sleek matte black finish.",
      price: 799.0,
      category: "Home Decor",
      images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop&q=80"],
      sellerId: luxeHome.id,
    },
    {
      title: "Logitech MX Master 3S",
      description: "Advanced wireless mouse with ultra-fast scrolling and ergonomic design.",
      price: 8999.0,
      category: "Electronics",
      images: ["https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80"],
      sellerId: digitalMasters.id,
    },
    {
      title: "Handwoven Jute Rug",
      description: "Eco-friendly 5x8ft jute rug, perfect for adding texture to any room.",
      price: 3499.0,
      category: "Home Decor",
      images: ["https://images.unsplash.com/photo-1581539250439-c96689b516da?w=800&auto=format&fit=crop&q=80"],
      sellerId: luxeHome.id,
    },
    {
      title: "Premium SaaS Website Template",
      description: "Next.js & Tailwind CSS template optimized for high conversions.",
      price: 4999.0,
      category: "Digital Assets",
      images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"],
      sellerId: digitalMasters.id,
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
