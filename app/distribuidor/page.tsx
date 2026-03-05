"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DistribuidorIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar se está autenticado
    const auth = localStorage.getItem("gb:distribuidorAuth");
    
    if (auth === "1") {
      router.replace("/distribuidor/dashboard");
    } else {
      router.replace("/entrar");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
}
