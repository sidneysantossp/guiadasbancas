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
        console.log('🔄 [EditarBanca] Ativando banca:', bancaId);
        
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

        console.log('✅ [EditarBanca] Banca ativada com sucesso:', bancaId);

        // Aguardar um pouco para garantir que o banco foi atualizado
        await new Promise(resolve => setTimeout(resolve, 300));

        // Buscar dados da banca para salvar no cache
        const bancaRes = await fetch("/api/jornaleiro/bancas", {
          cache: "no-store",
          credentials: "include",
        });
        const bancaJson = await bancaRes.json();
        
        if (bancaJson?.success && bancaJson?.items) {
          const banca = bancaJson.items.find((b: any) => b.id === bancaId);
          if (banca) {
            console.log('📦 [EditarBanca] Salvando banca no cache:', banca.name, 'ID:', banca.id);
            if (user?.id) {
              sessionStorage.setItem(`gb:banca:${user.id}`, JSON.stringify(banca));
            }
          } else {
            console.warn('⚠️ [EditarBanca] Banca não encontrada na lista:', bancaId);
          }
        }

        // Disparar evento de atualização
        console.log('🔔 [EditarBanca] Disparando evento banca-updated');
        window.dispatchEvent(new Event("banca-updated"));

        // Aguardar mais um pouco antes de redirecionar
        await new Promise(resolve => setTimeout(resolve, 200));

        // Redirecionar para a página de edição principal na aba "Banca"
        console.log('🚀 [EditarBanca] Redirecionando para banca-v2...');
        router.push("/jornaleiro/banca-v2?tab=banca");
      } catch (error) {
        console.error("❌ [EditarBanca] Erro ao ativar banca:", error);
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
