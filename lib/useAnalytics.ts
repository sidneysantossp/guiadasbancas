"use client";

import { useCallback, useEffect, useRef } from "react";

// Gerar ID de sessão único
const getSessionId = (): string => {
  if (typeof window === "undefined") return "";
  
  let sessionId = sessionStorage.getItem("gb:analytics:session");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("gb:analytics:session", sessionId);
  }
  return sessionId;
};

// Obter identificador do usuário (anônimo ou logado)
const getUserIdentifier = (): string => {
  if (typeof window === "undefined") return "";
  
  // Tentar pegar ID do usuário logado
  const userData = localStorage.getItem("gb:user");
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user.id) return `user:${user.id}`;
    } catch {}
  }
  
  // Usar identificador anônimo persistente
  let anonId = localStorage.getItem("gb:analytics:anon");
  if (!anonId) {
    anonId = `anon:${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem("gb:analytics:anon", anonId);
  }
  return anonId;
};

export type AnalyticsEventType = 
  | "page_view"
  | "product_view"
  | "product_click"
  | "add_to_cart"
  | "remove_from_cart"
  | "whatsapp_click"
  | "checkout_start"
  | "checkout_complete"
  | "search"
  | "share";

interface TrackEventParams {
  event_type: AnalyticsEventType;
  banca_id?: string;
  product_id?: string;
  metadata?: Record<string, any>;
}

// Função standalone para tracking (pode ser usada fora de componentes)
export const trackEvent = async (params: TrackEventParams): Promise<void> => {
  try {
    const sessionId = getSessionId();
    const userIdentifier = getUserIdentifier();

    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...params,
        session_id: sessionId,
        user_identifier: userIdentifier,
      }),
    });
  } catch (error) {
    // Silenciar erros de analytics para não afetar UX
    console.warn("[Analytics] Erro ao enviar evento:", error);
  }
};

// Hook para usar em componentes React
export function useAnalytics(bancaId?: string) {
  const bancaIdRef = useRef(bancaId);
  
  useEffect(() => {
    bancaIdRef.current = bancaId;
  }, [bancaId]);

  const track = useCallback(
    (eventType: AnalyticsEventType, productId?: string, metadata?: Record<string, any>) => {
      trackEvent({
        event_type: eventType,
        banca_id: bancaIdRef.current,
        product_id: productId,
        metadata,
      });
    },
    []
  );

  // Helpers específicos para cada tipo de evento
  const trackPageView = useCallback((page?: string) => {
    track("page_view", undefined, { page });
  }, [track]);

  const trackProductView = useCallback((productId: string, productName?: string) => {
    track("product_view", productId, { product_name: productName });
  }, [track]);

  const trackProductClick = useCallback((productId: string, productName?: string) => {
    track("product_click", productId, { product_name: productName });
  }, [track]);

  const trackAddToCart = useCallback((productId: string, quantity: number, productName?: string) => {
    track("add_to_cart", productId, { quantity, product_name: productName });
  }, [track]);

  const trackRemoveFromCart = useCallback((productId: string, productName?: string) => {
    track("remove_from_cart", productId, { product_name: productName });
  }, [track]);

  const trackWhatsAppClick = useCallback((productId?: string, productName?: string) => {
    track("whatsapp_click", productId, { product_name: productName });
  }, [track]);

  const trackCheckoutStart = useCallback((cartTotal: number, itemCount: number) => {
    track("checkout_start", undefined, { cart_total: cartTotal, item_count: itemCount });
  }, [track]);

  const trackCheckoutComplete = useCallback((orderId: string, orderTotal: number, itemCount: number) => {
    track("checkout_complete", undefined, { order_id: orderId, order_total: orderTotal, item_count: itemCount });
  }, [track]);

  const trackSearch = useCallback((searchTerm: string, resultsCount?: number) => {
    track("search", undefined, { search_term: searchTerm, results_count: resultsCount });
  }, [track]);

  const trackShare = useCallback((productId?: string, platform?: string) => {
    track("share", productId, { platform });
  }, [track]);

  return {
    track,
    trackPageView,
    trackProductView,
    trackProductClick,
    trackAddToCart,
    trackRemoveFromCart,
    trackWhatsAppClick,
    trackCheckoutStart,
    trackCheckoutComplete,
    trackSearch,
    trackShare,
  };
}

export default useAnalytics;
