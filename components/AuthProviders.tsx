"use client";

import { ReactNode } from "react";
import { Providers } from "@/components/Providers";
import { AuthProvider } from "@/lib/auth/AuthContext";

export default function AuthProviders({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthProvider>{children}</AuthProvider>
    </Providers>
  );
}
