import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://rgqlncxrzwgjreggrjcq.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://arquivos.mercos.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.mercos.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//cdn-icons-png.flaticon.com" />
      </head>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
