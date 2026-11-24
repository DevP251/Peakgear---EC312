import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { ToastContainer } from "@/components/ui/ToastContainer";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PeakGear - Trang bị Dã ngoại & Thể thao Chuyên nghiệp",
  description: "Trang bị trekking, hiking, camping chính hãng Decathlon & FanFan. Bền bỉ, an toàn, tối ưu hiệu suất dã ngoại.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#111827] antialiased selection:bg-[#F97316]/20 selection:text-[#111827]">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ToastContainer />
        </CartProvider>
      </body>
    </html>
  );
}
