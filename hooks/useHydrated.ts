"use client";

import { useEffect, useState } from "react";

/**
 * Hook para verificar se o componente foi hidratado no cliente
 * Evita erros de hidratação ao renderizar conteúdo diferente no servidor vs cliente
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
