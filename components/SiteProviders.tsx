"use client";

import { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ToastProvider";
import { CartProvider } from "@/components/CartContext";
import SessionValidator from "@/components/SessionValidator";

export default function SiteProviders({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthProvider>
        <SessionValidator>
          <ToastProvider>
            <CartProvider>{children}</CartProvider>
          </ToastProvider>
        </SessionValidator>
      </AuthProvider>
    </Providers>
  );
}
