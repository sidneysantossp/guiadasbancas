import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ToastProvider } from "@/components/ToastProvider";
import { CartProvider } from "@/components/CartContext";
import LayoutClient from "@/components/LayoutClient";

export const metadata = {
  title: 'Guia das Bancas',
  description: 'Encontre produtos e bancas perto de você',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <AuthProvider>
            <ToastProvider>
              <CartProvider>
                <LayoutClient>{children}</LayoutClient>
              </CartProvider>
            </ToastProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
