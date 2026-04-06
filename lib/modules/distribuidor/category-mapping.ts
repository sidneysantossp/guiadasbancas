import { supabaseAdmin } from "@/lib/supabase";

export type DistribuidorCategorySyncState = {
  categoryMap: Map<number, string>;
  validCategoryIds: Set<string>;
};

export function normalizeMercosCategoryId(value: unknown): number | null {
  const mercosId = Number(value);
  return Number.isFinite(mercosId) ? mercosId : null;
}

export async function loadDistribuidorCategorySyncState(
  distribuidorId: string
): Promise<DistribuidorCategorySyncState> {
  const { data, error } = await supabaseAdmin
    .from("distribuidor_categories")
    .select("id, mercos_id")
    .eq("distribuidor_id", distribuidorId)
    .eq("ativo", true);

  if (error) {
    throw new Error(
      `Falha ao carregar categorias do distribuidor (${distribuidorId}): ${error.message}`
    );
  }

  const categoryMap = new Map<number, string>();
  const validCategoryIds = new Set<string>();

  for (const row of data || []) {
    if (typeof row?.id === "string" && row.id) {
      validCategoryIds.add(row.id);
    }
    const mercosId = normalizeMercosCategoryId(row?.mercos_id);
    if (mercosId !== null && typeof row?.id === "string" && row.id) {
      categoryMap.set(mercosId, row.id);
    }
  }

  return { categoryMap, validCategoryIds };
}

export function isValidDistribuidorCategoryId(
  categoryId: string | null | undefined,
  validCategoryIds: Set<string>
): boolean {
  return typeof categoryId === "string" && validCategoryIds.has(categoryId);
}

export function resolveDistribuidorCategoryIdFromMercos(
  mercosCategoryId: unknown,
  categoryMap: Map<number, string>
): string | null {
  const normalizedMercosId = normalizeMercosCategoryId(mercosCategoryId);
  if (normalizedMercosId === null) return null;
  return categoryMap.get(normalizedMercosId) || null;
}

export function chooseDistribuidorProductCategoryId(params: {
  mercosCategoryId: unknown;
  categoryMap: Map<number, string>;
  existingCategoryId?: string | null;
  validCategoryIds: Set<string>;
  fallbackCategoryId?: string | null;
}): string | null {
  const mappedCategoryId = resolveDistribuidorCategoryIdFromMercos(
    params.mercosCategoryId,
    params.categoryMap
  );

  if (mappedCategoryId) return mappedCategoryId;

  if (isValidDistribuidorCategoryId(params.existingCategoryId, params.validCategoryIds)) {
    return params.existingCategoryId!;
  }

  return params.fallbackCategoryId ?? null;
}

export async function repairDistribuidorProductCategoryIds(distribuidorId: string): Promise<{
  scanned: number;
  repaired: number;
  alreadyCorrect: number;
  unresolved: number;
}> {
  const { categoryMap, validCategoryIds } = await loadDistribuidorCategorySyncState(distribuidorId);

  if (categoryMap.size === 0) {
    return { scanned: 0, repaired: 0, alreadyCorrect: 0, unresolved: 0 };
  }

  const batchSize = 1000;
  let from = 0;
  let scanned = 0;
  let repaired = 0;
  let alreadyCorrect = 0;
  let unresolved = 0;

  while (true) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, category_id, categoria_mercos, origem, banca_id")
      .eq("distribuidor_id", distribuidorId)
      .eq("origem", "mercos")
      .is("banca_id", null)
      .range(from, from + batchSize - 1);

    if (error) {
      throw new Error(
        `Falha ao carregar produtos do distribuidor (${distribuidorId}): ${error.message}`
      );
    }

    if (!data || data.length === 0) break;

    const updates: Array<{ id: string; category_id: string }> = [];

    for (const row of data) {
      scanned++;
      const mappedCategoryId = resolveDistribuidorCategoryIdFromMercos(
        row?.categoria_mercos,
        categoryMap
      );

      if (mappedCategoryId) {
        if (row.category_id === mappedCategoryId) {
          alreadyCorrect++;
        } else {
          updates.push({ id: row.id as string, category_id: mappedCategoryId });
        }
        continue;
      }

      if (isValidDistribuidorCategoryId(row?.category_id as string | null | undefined, validCategoryIds)) {
        alreadyCorrect++;
      } else {
        unresolved++;
      }
    }

    for (let index = 0; index < updates.length; index += 100) {
      const batch = updates.slice(index, index + 100);
      const responses = await Promise.all(
        batch.map((item) =>
          supabaseAdmin.from("products").update({ category_id: item.category_id }).eq("id", item.id)
        )
      );

      for (const response of responses) {
        if (response.error) {
          throw new Error(`Falha ao reparar categorias do distribuidor (${distribuidorId}): ${response.error.message}`);
        }
        repaired++;
      }
    }

    if (data.length < batchSize) break;
    from += batchSize;
  }

  return {
    scanned,
    repaired,
    alreadyCorrect,
    unresolved,
  };
}
