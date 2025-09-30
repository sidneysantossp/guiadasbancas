"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

type UserRole = "admin" | "jornaleiro" | "cliente";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/jornaleiro",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // Não autenticado
    if (status === "unauthenticated") {
      router.push(redirectTo as any);
      return;
    }

    const role = (session?.user as any)?.role as UserRole | undefined;
    if (requiredRole && role && role !== requiredRole) {
      // Redirecionar para dashboard apropriado
      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "jornaleiro") router.push("/jornaleiro/dashboard");
      else router.push("/minha-conta");
    }
  }, [status, session, requiredRole, redirectTo, router]);

  // Mostrar loading
  if (status === "loading") {
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
  const role = (session?.user as any)?.role as UserRole | undefined;
  if (status !== "authenticated" || (requiredRole && role !== requiredRole)) {
    return null;
  }

  // Autorizado
  return <>{children}</>;
}
