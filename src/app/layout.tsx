import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cartly | Premium Marketplace",
  description: "A high-end, full-stack marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} font-sans dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
