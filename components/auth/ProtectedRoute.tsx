"use client";

import { useAuth, UserRole } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Não autenticado
      if (!user) {
        router.push(redirectTo);
        return;
      }

      // Autenticado mas sem permissão
      if (requiredRole && profile?.role !== requiredRole) {
        // Redirecionar para dashboard apropriado
        if (profile?.role === "admin") {
          router.push("/admin/dashboard");
        } else if (profile?.role === "jornaleiro") {
          router.push("/jornaleiro/dashboard");
        } else {
          router.push("/minha-conta");
        }
      }
    }
  }, [user, profile, loading, requiredRole, redirectTo, router]);

  // Mostrar loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Não autenticado ou sem permissão
  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  // Autorizado
  return <>{children}</>;
}
