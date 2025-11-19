/**
 * Distribui produtos de forma equilibrada entre bancas
 * Garante que cada seção mostre produtos de diferentes bancas
 */

interface Product {
  id: string;
  name: string;
  banca_id?: string;
  [key: string]: any;
}

interface Banca {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Distribui produtos de forma equilibrada entre bancas
 * @param products Lista de produtos
 * @param bancas Lista de bancas ativas
 * @param limit Número total de produtos a retornar
 * @returns Lista de produtos distribuídos equilibradamente
 */
export function distributeProductsByBanca(
  products: Product[],
  bancas: Banca[],
  limit: number = 12
): Product[] {
  if (!products.length || !bancas.length) return products.slice(0, limit);

  // Agrupar produtos por banca
  const productsByBanca: Record<string, Product[]> = {};
  
  products.forEach(product => {
    const bancaId = product.banca_id;
    if (!bancaId) return; // Ignorar produtos sem banca
    
    if (!productsByBanca[bancaId]) {
      productsByBanca[bancaId] = [];
    }
    productsByBanca[bancaId].push(product);
  });

  // Bancas que têm produtos
  const bancasComProdutos = Object.keys(productsByBanca);
  
  if (bancasComProdutos.length === 0) {
    return products.slice(0, limit);
  }

  // Calcular quantos produtos por banca
  const productsPerBanca = Math.ceil(limit / bancasComProdutos.length);
  
  // Distribuir produtos de forma equilibrada
  const distributed: Product[] = [];
  let currentIndex = 0;
  
  // Round-robin: pegar produtos alternadamente de cada banca
  while (distributed.length < limit && currentIndex < 100) { // max 100 iterations para evitar loop infinito
    for (const bancaId of bancasComProdutos) {
      if (distributed.length >= limit) break;
      
      const bancaProducts = productsByBanca[bancaId];
      const startIndex = Math.floor(currentIndex / bancasComProdutos.length);
      
      if (startIndex < bancaProducts.length) {
        distributed.push(bancaProducts[startIndex]);
      }
    }
    currentIndex += bancasComProdutos.length;
  }

  return distributed.slice(0, limit);
}

/**
 * Embaralha produtos mantendo distribuição por banca
 * @param products Lista de produtos já distribuídos
 * @returns Lista embaralhada
 */
export function shuffleDistributedProducts(products: Product[]): Product[] {
  // Agrupar por banca
  const byBanca: Record<string, Product[]> = {};
  
  products.forEach(p => {
    const bancaId = p.banca_id || 'unknown';
    if (!byBanca[bancaId]) byBanca[bancaId] = [];
    byBanca[bancaId].push(p);
  });

  // Embaralhar produtos dentro de cada banca
  Object.keys(byBanca).forEach(bancaId => {
    byBanca[bancaId] = byBanca[bancaId].sort(() => Math.random() - 0.5);
  });

  // Reconstruir lista alternando bancas
  const result: Product[] = [];
  const bancaIds = Object.keys(byBanca);
  let maxLength = Math.max(...Object.values(byBanca).map(arr => arr.length));
  
  for (let i = 0; i < maxLength; i++) {
    for (const bancaId of bancaIds) {
      if (byBanca[bancaId][i]) {
        result.push(byBanca[bancaId][i]);
      }
    }
  }

  return result;
}

/**
 * Filtra produtos que têm banca_id válido
 */
export function filterProductsWithBanca(products: Product[]): Product[] {
  return products.filter(p => p.banca_id && p.banca_id.trim() !== '');
}
