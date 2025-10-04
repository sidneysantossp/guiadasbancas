import { useCallback } from 'react';

/**
 * Hook para fazer requisições autenticadas à API
 * As APIs server-side usam NextAuth auth() para validar automaticamente
 * Este hook apenas adiciona o Content-Type header
 */
export function useFetchAuth() {
  const fetchAuth = useCallback(async (url: string, options: RequestInit = {}) => {
    // Apenas adicionar Content-Type
    // A autenticação é feita automaticamente via cookies do NextAuth
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Fazer requisição
    return fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Incluir cookies (necessário para NextAuth)
    });
  }, []);

  return fetchAuth;
}
