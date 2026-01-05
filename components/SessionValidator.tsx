"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

/**
 * SessionValidator - Componente que valida e limpa dados órfãos do localStorage
 * 
 * Problemas que resolve:
 * 1. Produtos no carrinho de sessões anteriores
 * 2. Usuários aparecendo logados sem ter conta válida
 * 3. Dados de sessão expirados ou inválidos
 * 
 * Regras:
 * - Se gb:user existe mas não tem email válido → limpa
 * - Se gb:user existe há mais de 30 dias sem atividade → limpa
 * - Se gb:cart tem produtos de mais de 7 dias → limpa
 * - Se há conflito entre NextAuth e localStorage → prioriza NextAuth
 */
export default function SessionValidator({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    // Só validar no cliente e após carregar status da sessão
    if (typeof window === "undefined") return;
    if (status === "loading") return;

    try {
      validateSession();
    } catch (e) {
      console.error("[SessionValidator] Erro na validação:", e);
    } finally {
      setValidated(true);
    }
  }, [status, session]);

  function validateSession() {
    const now = Date.now();

    // 1. Validar gb:user (usuário comum)
    try {
      const rawUser = localStorage.getItem("gb:user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        
        // Verificar se tem email válido
        if (!user?.email || typeof user.email !== "string" || !user.email.includes("@")) {
          console.log("[SessionValidator] Limpando gb:user inválido (sem email)");
          clearLocalUserSession();
        }
        
        // Verificar se sessão NextAuth está ativa (conflito)
        // Se NextAuth está autenticado como jornaleiro/admin, limpar localStorage
        if (session?.user && (session.user as any)?.role && (session.user as any).role !== "cliente") {
          console.log("[SessionValidator] Conflito: NextAuth ativo, limpando localStorage");
          clearLocalUserSession();
        }
        
        // Verificar idade da sessão (máximo 30 dias)
        const createdAt = localStorage.getItem("gb:userCreatedAt");
        if (createdAt) {
          const createdDate = new Date(createdAt).getTime();
          const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 dias
          if (now - createdDate > maxAge) {
            console.log("[SessionValidator] Sessão expirada (>30 dias), limpando");
            clearLocalUserSession();
          }
        }
      }
    } catch (e) {
      // Se erro ao parsear, limpar dados corrompidos
      console.log("[SessionValidator] Erro ao validar gb:user, limpando dados corrompidos");
      clearLocalUserSession();
    }

    // 2. Validar gb:cart (carrinho)
    try {
      const rawCart = localStorage.getItem("gb:cart");
      if (rawCart) {
        const cart = JSON.parse(rawCart);
        
        // Se não é array válido, limpar
        if (!Array.isArray(cart)) {
          console.log("[SessionValidator] Carrinho inválido (não é array), limpando");
          localStorage.removeItem("gb:cart");
        }
        
        // Verificar timestamp do carrinho (máximo 7 dias)
        const cartTimestamp = localStorage.getItem("gb:cartUpdatedAt");
        if (cartTimestamp) {
          const cartDate = new Date(cartTimestamp).getTime();
          const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dias
          if (now - cartDate > maxAge) {
            console.log("[SessionValidator] Carrinho expirado (>7 dias), limpando");
            localStorage.removeItem("gb:cart");
            localStorage.removeItem("gb:cartUpdatedAt");
          }
        } else if (cart.length > 0) {
          // Se tem itens mas não tem timestamp, adicionar agora
          localStorage.setItem("gb:cartUpdatedAt", new Date().toISOString());
        }
      }
    } catch (e) {
      // Se erro ao parsear, limpar dados corrompidos
      console.log("[SessionValidator] Erro ao validar gb:cart, limpando dados corrompidos");
      localStorage.removeItem("gb:cart");
    }

    // 3. Limpar dados órfãos de sessões antigas
    try {
      // Se não há usuário logado (nem NextAuth nem localStorage), limpar dados relacionados
      const hasLocalUser = !!localStorage.getItem("gb:user");
      const hasNextAuthSession = !!session?.user;
      
      if (!hasLocalUser && !hasNextAuthSession) {
        // Limpar dados que dependem de sessão
        const orphanKeys = [
          "gb:userProfile",
          "gb:addresses",
          "gb:wishlist",
          "gb:orders"
        ];
        
        orphanKeys.forEach(key => {
          if (localStorage.getItem(key)) {
            console.log(`[SessionValidator] Limpando dado órfão: ${key}`);
            localStorage.removeItem(key);
          }
        });
      }
    } catch (e) {
      console.error("[SessionValidator] Erro ao limpar dados órfãos:", e);
    }
  }

  function clearLocalUserSession() {
    const keysToRemove = [
      "gb:user",
      "gb:userProfile",
      "gb:userCreatedAt",
      "gb:orders",
      "gb:addresses",
      "gb:wishlist"
    ];
    
    keysToRemove.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });
    
    // Disparar evento para atualizar componentes
    try {
      window.dispatchEvent(new Event("gb:user:changed"));
    } catch {}
  }

  // Renderizar children imediatamente (não bloquear UI)
  return <>{children}</>;
}
