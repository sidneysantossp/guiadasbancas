// Cache em memória para otimização de performance
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlSeconds: number = 300) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  // Limpar entradas expiradas
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Limpar cache a cada 5 minutos
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup();
  }, 5 * 60 * 1000);
}

// Hook para fetch com cache
export async function cachedFetch(url: string, options?: RequestInit, ttlSeconds: number = 300) {
  const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
  
  // Tentar cache primeiro
  const cached = memoryCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Fetch real
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    memoryCache.set(cacheKey, data, ttlSeconds);
    return data;
  } catch (error) {
    console.warn(`Cache fetch failed for ${url}:`, error);
    throw error;
  }
}
