"use client";

import "./globals.css";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AppFooter from "@/components/AppFooter";
import FloatingCart from "@/components/FloatingCart";
import { CartProvider } from "@/components/CartContext";
import { ToastProvider } from "@/components/ToastProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isJornaleiroRoute = pathname?.startsWith('/jornaleiro');
  const shouldHideNavbar = isAdminRoute || isJornaleiroRoute;

  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          <CartProvider>
            {!shouldHideNavbar && <Navbar />}
            <main>{children}</main>
            {!shouldHideNavbar && <AppFooter />}
            {!shouldHideNavbar && <FloatingCart />}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
