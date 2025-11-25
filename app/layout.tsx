"use client";

import "./globals.css";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import AppFooter from "@/components/AppFooter";
import FloatingCart from "@/components/FloatingCart";
import CookieConsent from "@/components/CookieConsent";
import { CartProvider } from "@/components/CartContext";
import { ToastProvider } from "@/components/ToastProvider";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/lib/auth/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isJornaleiroRoute = pathname?.startsWith('/jornaleiro');
  const isLoginPage = pathname === '/entrar';
  const shouldHideNavbar = isAdminRoute || isJornaleiroRoute || isLoginPage;

  return (
    <html lang="pt-BR">
      <body>
        <ErrorBoundary>
          <Providers>
            <AuthProvider>
              <ToastProvider>
                <CartProvider>
                  {!shouldHideNavbar && <Navbar />}
                  <main className={!shouldHideNavbar ? "pt-[140px] md:pt-[80px]" : ""}>{children}</main>
                  {!shouldHideNavbar && <AppFooter />}
                  {!shouldHideNavbar && <FloatingCart />}
                  {!shouldHideNavbar && <CookieConsent />}
                </CartProvider>
              </ToastProvider>
            </AuthProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
