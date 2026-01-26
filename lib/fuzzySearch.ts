import Fuse, { IFuseOptions } from 'fuse.js';

/**
 * Configuração padrão para busca fuzzy de produtos
 * - threshold: 0.4 = tolerância alta para erros de digitação (0 = match exato, 1 = match qualquer coisa)
 * - distance: 100 = distância máxima de caracteres para considerar um match
 * - includeScore: true = retorna o score de similaridade
 * - ignoreLocation: true = busca em qualquer posição do texto
 * - useExtendedSearch: true = permite operadores de busca avançada
 */
export const PRODUCT_SEARCH_OPTIONS: IFuseOptions<any> = {
  threshold: 0.4, // Tolerância para erros de digitação
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  useExtendedSearch: false,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 0.7 },
    { name: 'codigo_mercos', weight: 0.3 },
  ],
};

/**
 * Configuração para busca fuzzy de bancas
 */
export const BANCA_SEARCH_OPTIONS: IFuseOptions<any> = {
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 0.8 },
    { name: 'address', weight: 0.2 },
  ],
};

/**
 * Normaliza string para busca: remove acentos, converte para lowercase
 */
export function normalizeForSearch(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Gera variações comuns de erros de digitação para o português brasileiro
 * Isso ajuda a encontrar matches mesmo com erros comuns
 */
export function generateSearchVariants(term: string): string[] {
  const normalized = normalizeForSearch(term);
  const variants = new Set<string>([term.toLowerCase(), normalized]);
  
  // Substituições comuns de erros de digitação em português
  const replacements: [RegExp, string][] = [
    // Vogais com acentos
    [/a/g, 'á'], [/a/g, 'ã'], [/a/g, 'â'],
    [/e/g, 'é'], [/e/g, 'ê'],
    [/i/g, 'í'],
    [/o/g, 'ó'], [/o/g, 'ô'], [/o/g, 'õ'],
    [/u/g, 'ú'],
    // Confusões comuns
    [/ss/g, 'ç'], [/c/g, 'ç'],
    [/s/g, 'z'], [/z/g, 's'],
    [/x/g, 'ch'], [/ch/g, 'x'],
    [/g/g, 'j'], [/j/g, 'g'],
    [/m$/g, 'n'], [/n$/g, 'm'], // final m/n
    [/am$/g, 'ão'], [/ao$/g, 'ão'],
    // Letras duplicadas vs simples
    [/rr/g, 'r'], [/r/g, 'rr'],
    [/ss/g, 's'], [/s/g, 'ss'],
    // y/i confusão
    [/y/g, 'i'], [/i/g, 'y'],
    // th comum em nomes estrangeiros
    [/th/g, 't'], [/t/g, 'th'],
    // ph/f
    [/ph/g, 'f'], [/f/g, 'ph'],
  ];
  
  // Gerar algumas variações (limitado para não explodir)
  for (const [pattern, replacement] of replacements.slice(0, 10)) {
    if (pattern.test(normalized)) {
      variants.add(normalized.replace(pattern, replacement));
    }
  }
  
  return Array.from(variants).slice(0, 5);
}

/**
 * Cria uma instância do Fuse para produtos
 */
export function createProductSearcher<T extends { name: string; codigo_mercos?: string }>(
  products: T[],
  customOptions?: Partial<IFuseOptions<T>>
): Fuse<T> {
  return new Fuse(products, {
    ...PRODUCT_SEARCH_OPTIONS,
    ...customOptions,
  } as IFuseOptions<T>);
}

/**
 * Cria uma instância do Fuse para bancas
 */
export function createBancaSearcher<T extends { name: string; address?: string }>(
  bancas: T[],
  customOptions?: Partial<IFuseOptions<T>>
): Fuse<T> {
  return new Fuse(bancas, {
    ...BANCA_SEARCH_OPTIONS,
    ...customOptions,
  } as IFuseOptions<T>);
}

/**
 * Realiza busca fuzzy em produtos
 * Retorna os produtos ordenados por relevância (mais relevante primeiro)
 */
export function fuzzySearchProducts<T extends { name: string; codigo_mercos?: string }>(
  products: T[],
  searchTerm: string,
  limit: number = 50
): T[] {
  if (!searchTerm || searchTerm.length < 2) {
    return products.slice(0, limit);
  }
  
  const fuse = createProductSearcher(products);
  const results = fuse.search(searchTerm, { limit });
  
  return results.map(r => r.item);
}

/**
 * Realiza busca fuzzy em bancas
 */
export function fuzzySearchBancas<T extends { name: string; address?: string }>(
  bancas: T[],
  searchTerm: string,
  limit: number = 10
): T[] {
  if (!searchTerm || searchTerm.length < 2) {
    return bancas.slice(0, limit);
  }
  
  const fuse = createBancaSearcher(bancas);
  const results = fuse.search(searchTerm, { limit });
  
  return results.map(r => r.item);
}

/**
 * Verifica se um termo tem match fuzzy com um texto
 * Útil para filtros simples onde não precisamos de ranking
 */
export function fuzzyMatch(text: string, searchTerm: string, threshold: number = 0.4): boolean {
  if (!text || !searchTerm) return false;
  
  const normalizedText = normalizeForSearch(text);
  const normalizedSearch = normalizeForSearch(searchTerm);
  
  // Match exato ou substring
  if (normalizedText.includes(normalizedSearch)) {
    return true;
  }
  
  // Usar Fuse para match fuzzy
  const fuse = new Fuse([{ text }], {
    threshold,
    keys: ['text'],
    includeScore: true,
  });
  
  const results = fuse.search(searchTerm);
  return results.length > 0;
}

/**
 * Busca fuzzy para uso no frontend (BancaPageClient)
 * Filtra produtos localmente com tolerância a erros de digitação
 */
export function filterProductsFuzzy<T extends { name: string; codigo_mercos?: string; category?: string }>(
  products: T[],
  searchTerm: string
): T[] {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return products;
  }
  
  const term = searchTerm.trim();
  
  // Primeiro, verificar match exato/substring (prioridade máxima)
  const normalizedTerm = normalizeForSearch(term);
  const exactMatches: T[] = [];
  const remainingProducts: T[] = [];
  
  for (const product of products) {
    const normalizedName = normalizeForSearch(product.name || '');
    const normalizedCode = normalizeForSearch(product.codigo_mercos || '');
    const normalizedCategory = normalizeForSearch(product.category || '');
    
    if (
      normalizedName.includes(normalizedTerm) ||
      normalizedCode.includes(normalizedTerm) ||
      normalizedCategory.includes(normalizedTerm)
    ) {
      exactMatches.push(product);
    } else {
      remainingProducts.push(product);
    }
  }
  
  // Usar Fuse.js para busca fuzzy nos restantes
  if (remainingProducts.length > 0) {
    const fuse = new Fuse(remainingProducts, {
      threshold: 0.45, // Um pouco mais tolerante para busca local
      distance: 100,
      includeScore: true,
      ignoreLocation: true,
      minMatchCharLength: 2,
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'codigo_mercos', weight: 0.25 },
        { name: 'category', weight: 0.15 },
      ],
    });
    
    const fuzzyResults = fuse.search(term, { limit: 100 });
    const fuzzyMatches = fuzzyResults.map(r => r.item);
    
    // Combinar: matches exatos primeiro, depois fuzzy
    return [...exactMatches, ...fuzzyMatches];
  }
  
  return exactMatches;
}
