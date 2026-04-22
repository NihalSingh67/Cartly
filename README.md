# Cartly (Aura) - Premium E-Commerce Marketplace

Cartly is a modern, high-end e-commerce marketplace platform built with Next.js. It features a stunning glassmorphic UI, smooth framer-motion animations, and a comprehensive full-stack architecture for buyers and sellers.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Frontend/UI**: React 19, Tailwind CSS v4, Framer Motion, shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (v4)
- **File Uploads**: UploadThing
- **Payments**: Stripe (Integration Ready)

## 🌟 Key Features

- **Multi-Role System**: Users can act as regular buyers or upgrade to a `SELLER` role to list their own products.
- **Premium Aesthetics**: Features a fully custom dark mode, glassmorphism (`backdrop-blur`), and `Outfit` / `Inter` typography for a luxurious feel.
- **Dynamic Animations**: Implements a Parallax Hero section and animated product cards using Framer Motion.
- **Cart & Checkout Flow**: Context-based shopping cart management.
- **Order Management & Tracking**: Database schema supports order tracking, statuses (PENDING, PAID, SHIPPED, DELIVERED), and integrated product reviews.

## 🗄️ Database Architecture

The application relies on a robust relational structure managed by Prisma:

- `User` / `Account` / `Session`: Authentication and authorization. Roles include `USER` and `SELLER`.
- `Product`: Owned by a seller, containing title, price, images array, and category.
- `Order` & `OrderItem`: Tracks purchases, buyer relations, and the total cost.
- `Tracking`: Enables geographic or status tracking of shipped orders.
- `Review`: Allows buyers to leave 1-5 star ratings and comments on products.

## 📂 Project Structure

```
src/
├── app/
│   ├── api/          # Next.js API Routes (products, upload, checkout, etc.)
│   ├── cart/         # Shopping cart page
│   ├── checkout/     # Checkout flow
│   ├── explore/      # Product exploration / filtering
│   ├── login/        # User authentication
│   ├── product/      # Individual product details (`[id]`)
│   ├── profile/      # User profile management
│   ├── seller/       # Seller dashboard (adding products, etc.)
│   ├── sellers/      # Public seller profiles
│   ├── layout.tsx    # Root layout with global providers and custom fonts
│   └── page.tsx      # Landing page with Parallax Hero and Trending sections
├── components/       # Reusable UI components (Navbar, ProductCard, Reviews)
├── context/          # React Context (e.g., CartProvider)
└── lib/              # Utility functions and Prisma client setup
```

## 🛠️ Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Ensure your `.env` file is configured with the following:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `NEXTAUTH_SECRET` & `NEXTAUTH_URL`
   - UploadThing keys
   - Stripe keys

3. **Database Setup:**
   ```bash
   npx prisma generate
   npx prisma db push
   # Optional: Seed the database
   npm run prisma:seed
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
