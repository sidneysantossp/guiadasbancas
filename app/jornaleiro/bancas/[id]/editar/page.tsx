"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

export default function EditarBancaPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bancaId = params.id as string;

  useEffect(() => {
    const setActiveBancaAndRedirect = async () => {
      try {
        // Definir esta banca como ativa
        const res = await fetch("/api/jornaleiro/bancas/active", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ banca_id: bancaId }),
        });

        const json = await res.json();
        if (!res.ok || !json?.success) {
          throw new Error(json?.error || "Erro ao ativar banca");
        }

        // Buscar dados da banca para salvar no cache
        const bancaRes = await fetch("/api/jornaleiro/bancas", {
          cache: "no-store",
          credentials: "include",
        });
        const bancaJson = await bancaRes.json();
        
        if (bancaJson?.success && bancaJson?.items) {
          const banca = bancaJson.items.find((b: any) => b.id === bancaId);
          if (banca && user?.id) {
            sessionStorage.setItem(`gb:banca:${user.id}`, JSON.stringify(banca));
          }
        }

        // Disparar evento de atualização
        window.dispatchEvent(new Event("banca-updated"));

        // Redirecionar para a página de edição principal
        router.push("/jornaleiro/banca-v2");
      } catch (error) {
        console.error("Erro ao ativar banca:", error);
        router.push("/jornaleiro/bancas");
      }
    };

    if (bancaId) {
      setActiveBancaAndRedirect();
    }
  }, [bancaId, router, user?.id]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff5c00] mx-auto"></div>
        <p className="mt-4 text-sm text-gray-600">Carregando dados da banca...</p>
      </div>
    </div>
  );
}
