import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TCG NQN",
  description: "Tienda online de cartas coleccionables",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <CartProvider>
          <div className="min-h-full flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
