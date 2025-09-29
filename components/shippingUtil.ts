import { CartItem } from "@/components/CartContext";

export type ItemDims = {
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

// Heurística simples baseada no nome do produto
export function heuristicDimsByName(name: string): ItemDims {
  const n = (name || "").toLowerCase();
  // Pequeno: revistas, jornal, HQ, gibi
  if (/(revista|jornal|hq|gibi)/.test(n)) {
    return { weightKg: 0.3, lengthCm: 15, widthCm: 10, heightCm: 4 };
  }
  // Médio: caderno, chocolate, kit, pilha
  if (/(caderno|chocolate|kit|pilha|pilhas)/.test(n)) {
    return { weightKg: 0.8, lengthCm: 25, widthCm: 18, heightCm: 10 };
  }
  // Grande (fallback para itens volumosos genéricos)
  return { weightKg: 2.0, lengthCm: 40, widthCm: 30, heightCm: 20 };
}

// Agregar dimensões para o carrinho
// - Peso: soma dos pesos (kg * qty)
// - Dimensões: caixa mínima que comporta itens empilhados: comprimento=max, largura=max, altura=soma
// - Aplicar mínimos dos Correios: C>=16, L>=11, A>=2
export function aggregateCartDims(items: CartItem[]): ItemDims {
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  for (const it of items) {
    const dims = heuristicDimsByName(it.name);
    const qty = Math.max(0, it.qty);
    totalWeight += dims.weightKg * qty;
    maxLength = Math.max(maxLength, dims.lengthCm);
    maxWidth = Math.max(maxWidth, dims.widthCm);
    totalHeight += dims.heightCm * qty;
  }

  // Mínimos dos Correios
  maxLength = Math.max(maxLength, 16);
  maxWidth = Math.max(maxWidth, 11);
  totalHeight = Math.max(totalHeight, 2);

  // Evitar zeros
  if (totalWeight <= 0) totalWeight = 1;

  return {
    weightKg: Number(totalWeight.toFixed(2)),
    lengthCm: Math.round(maxLength),
    widthCm: Math.round(maxWidth),
    heightCm: Math.round(totalHeight),
  };
}
