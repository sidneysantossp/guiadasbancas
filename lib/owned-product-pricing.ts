const COST_PRICE_MARKER_REGEX = /\s*<!--\s*cost_price:([0-9]+(?:[.,][0-9]+)?)\s*-->\s*$/i;

function normalizeNumericValue(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", "."));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  return null;
}

export function extractOwnedProductPricing(specifications: unknown): {
  cleanSpecifications: string;
  costPrice: number | null;
} {
  const rawSpecifications = typeof specifications === "string" ? specifications : "";
  const match = rawSpecifications.match(COST_PRICE_MARKER_REGEX);
  const costPrice = match ? normalizeNumericValue(match[1]) : null;
  const cleanSpecifications = match
    ? rawSpecifications.replace(COST_PRICE_MARKER_REGEX, "").trim()
    : rawSpecifications;

  return {
    cleanSpecifications,
    costPrice,
  };
}

export function buildOwnedProductSpecifications(params: {
  specifications: unknown;
  costPrice?: unknown;
}) {
  const { cleanSpecifications } = extractOwnedProductPricing(params.specifications);
  const normalizedCostPrice = normalizeNumericValue(params.costPrice);

  if (!normalizedCostPrice) {
    return cleanSpecifications;
  }

  return cleanSpecifications
    ? `${cleanSpecifications}\n\n<!-- cost_price:${normalizedCostPrice} -->`
    : `<!-- cost_price:${normalizedCostPrice} -->`;
}

export function normalizeOwnedProductRecord<T extends { specifications?: unknown } & Record<string, any>>(
  product: T
): T & {
  specifications: string;
  cost_price: number | null;
} {
  const { cleanSpecifications, costPrice } = extractOwnedProductPricing(product.specifications);

  return {
    ...product,
    specifications: cleanSpecifications,
    cost_price: costPrice,
  };
}

export function getOwnedProductListPrice(product: {
  price?: unknown;
  price_original?: unknown;
}) {
  const currentPrice = normalizeNumericValue(product.price) || 0;
  const listPrice = normalizeNumericValue(product.price_original);

  return listPrice && listPrice >= currentPrice ? listPrice : currentPrice;
}
