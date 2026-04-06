import logger from "@/lib/logger";
import { MercosAPI } from "@/lib/mercos-api";
import {
  chooseDistribuidorProductCategoryId,
  loadDistribuidorCategorySyncState,
} from "@/lib/modules/distribuidor/category-mapping";
import { supabaseAdmin } from "@/lib/supabase";

const DEFAULT_MERCOS_BASE_URL = "https://app.mercos.com/api/v1";

type DistribuidorMercosRow = {
  id: string;
  nome: string;
  ativo: boolean | null;
  application_token: string | null;
  company_token: string | null;
  mercos_application_token?: string | null;
  mercos_company_token?: string | null;
  base_url: string | null;
  ultima_sincronizacao?: string | null;
};

type DistribuidorMercosReady = DistribuidorMercosRow & {
  baseUrl: string;
  applicationToken: string;
  companyToken: string;
};

type DistribuidorIntegrationState =
  | { kind: "not_found" }
  | { kind: "disabled"; distribuidor: DistribuidorMercosRow }
  | { kind: "needs_setup"; distribuidor: DistribuidorMercosRow }
  | { kind: "ready"; distribuidor: DistribuidorMercosReady };

type MercosHealthResponse = {
  distribuidor: string;
  success: boolean;
  error?: string;
  latency_ms?: number;
  needsSetup?: boolean;
  isDisabled?: boolean;
  sample?: {
    id: number;
    nome: string;
    ultima_alteracao?: string;
    saldo_estoque?: number;
    ativo?: boolean;
    excluido?: boolean;
  } | null;
};

type SyncResponse =
  | { success: false; error: string; isDisabled?: boolean; needsSetup?: boolean }
  | {
      success: true;
      data: {
        produtos_novos: number;
        produtos_atualizados: number;
        erros: number;
        total_produtos: number;
        categorias_sincronizadas: number;
        categorias_desativadas: number;
        categorias_total_mercos: number;
        sincronizado_em: string;
        warning: string | null;
      };
    };

async function getDistribuidorMercosState(distribuidorId: string): Promise<DistribuidorIntegrationState> {
  const { data, error } = await supabaseAdmin
    .from("distribuidores")
    .select(
      "id, nome, ativo, application_token, company_token, mercos_application_token, mercos_company_token, base_url, ultima_sincronizacao"
    )
    .eq("id", distribuidorId)
    .maybeSingle();

  if (error || !data) {
    return { kind: "not_found" };
  }

  if (!data.ativo) {
    return { kind: "disabled", distribuidor: data };
  }

  const applicationToken = data.mercos_application_token || data.application_token;
  const companyToken = data.mercos_company_token || data.company_token;

  if (!applicationToken || !companyToken) {
    return { kind: "needs_setup", distribuidor: data };
  }

  return {
    kind: "ready",
    distribuidor: {
      ...data,
      baseUrl: data.base_url?.trim() || DEFAULT_MERCOS_BASE_URL,
      applicationToken,
      companyToken,
    },
  };
}

async function loadExistingDistribuidorProducts(distribuidorId: string) {
  const pageSize = 1000;
  const allRows: Array<{
    id: string;
    mercos_id: number;
    images: any;
    category_id: string | null;
  }> = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id, mercos_id, images, category_id")
      .eq("distribuidor_id", distribuidorId)
      .not("mercos_id", "is", null)
      .range(from, from + pageSize - 1);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    allRows.push(...(data as any));

    if (data.length < pageSize) {
      break;
    }
  }

  return allRows;
}

async function persistNewProductsBatch(batch: any[]) {
  if (batch.length === 0) {
    return { inserted: 0, updated: 0, errors: 0 };
  }

  const { error } = await supabaseAdmin.from("products").insert(batch);

  if (!error) {
    return { inserted: batch.length, updated: 0, errors: 0 };
  }

  logger.error("[Sync] Erro ao inserir batch de produtos, executando fallback item a item:", error.message);

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const row of batch) {
    const { error: itemInsertError } = await supabaseAdmin.from("products").insert(row);

    if (!itemInsertError) {
      inserted++;
      continue;
    }

    const isDuplicate =
      itemInsertError.code === "23505" ||
      itemInsertError.message?.includes("idx_products_distribuidor_mercos_id") ||
      itemInsertError.message?.toLowerCase().includes("duplicate key value");

    if (!isDuplicate) {
      logger.error("[Sync] Erro ao inserir produto individual:", itemInsertError.message);
      errors++;
      continue;
    }

    const { data: existingRow, error: existingLookupError } = await supabaseAdmin
      .from("products")
      .select("id, images")
      .eq("distribuidor_id", row.distribuidor_id)
      .eq("mercos_id", row.mercos_id)
      .maybeSingle();

    if (existingLookupError || !existingRow?.id) {
      logger.error(
        "[Sync] Não foi possível localizar produto existente após conflito de chave única:",
        existingLookupError?.message || `mercos_id=${row.mercos_id}`
      );
      errors++;
      continue;
    }

    const mergedImages =
      Array.isArray(existingRow.images) && existingRow.images.length > 0
        ? existingRow.images
        : row.images;

    const { error: updateError } = await supabaseAdmin
      .from("products")
      .update({
        ...row,
        images: mergedImages,
      })
      .eq("id", existingRow.id);

    if (updateError) {
      logger.error("[Sync] Erro ao atualizar produto existente após conflito:", updateError.message);
      errors++;
      continue;
    }

    updated++;
  }

  return { inserted, updated, errors };
}

export async function getDistribuidorMercosHealth(distribuidorId: string): Promise<MercosHealthResponse> {
  const state = await getDistribuidorMercosState(distribuidorId);

  if (state.kind === "not_found") {
    return {
      distribuidor: "Desconhecido",
      success: false,
      error: "Distribuidor não encontrado",
    };
  }

  if (state.kind === "disabled") {
    return {
      distribuidor: state.distribuidor.nome,
      success: false,
      error: "Integração desativada pelo administrador.",
      isDisabled: true,
    };
  }

  if (state.kind === "needs_setup") {
    return {
      distribuidor: state.distribuidor.nome,
      success: false,
      error: "Integração não configurada. Entre em contato com o suporte para ativar.",
      needsSetup: true,
    };
  }

  const { distribuidor } = state;
  const startTime = Date.now();

  try {
    const mercosRes = await fetch(
      `${distribuidor.baseUrl}/produtos?limit=1&order_by=ultima_alteracao&order_direction=desc`,
      {
        headers: {
          ApplicationToken: distribuidor.applicationToken,
          CompanyToken: distribuidor.companyToken,
          "Content-Type": "application/json",
        },
      }
    );

    const latency = Date.now() - startTime;

    if (!mercosRes.ok) {
      return {
        distribuidor: distribuidor.nome,
        success: false,
        error: `Erro na API Mercos: ${mercosRes.status} ${mercosRes.statusText}`,
        latency_ms: latency,
      };
    }

    const mercosData = await mercosRes.json();
    const mercosItems = Array.isArray(mercosData)
      ? mercosData
      : Array.isArray(mercosData?.data)
        ? mercosData.data
        : [];
    const sample = mercosItems.length > 0 ? mercosItems[0] : null;

    return {
      distribuidor: distribuidor.nome,
      success: true,
      latency_ms: latency,
      sample: sample
        ? {
            id: sample.id,
            nome: sample.nome,
            ultima_alteracao: sample.ultima_alteracao,
            saldo_estoque: sample.saldo_estoque,
            ativo: sample.ativo,
            excluido: sample.excluido,
          }
        : null,
    };
  } catch (error: any) {
    return {
      distribuidor: distribuidor.nome,
      success: false,
      error: `Erro de conexão: ${error.message}`,
      latency_ms: Date.now() - startTime,
    };
  }
}

export async function syncDistribuidorMercosCategories(params: {
  distribuidorId: string;
  applicationToken: string;
  companyToken: string;
  baseUrl?: string | null;
}) {
  const mercosApi = new MercosAPI({
    applicationToken: params.applicationToken,
    companyToken: params.companyToken,
    baseUrl: params.baseUrl || DEFAULT_MERCOS_BASE_URL,
  });

  const categories = await mercosApi.getAllCategorias();
  const categoriesToUpsert = categories
    .filter((category: any) => !category.excluido)
    .map((category: any) => ({
      distribuidor_id: params.distribuidorId,
      mercos_id: category.id,
      nome: category.nome,
      categoria_pai_id: category.categoria_pai_id || null,
      ativo: true,
      updated_at: new Date().toISOString(),
    }));

  const { data: existingCategories, error: existingCategoriesError } = await supabaseAdmin
    .from("distribuidor_categories")
    .select("id, mercos_id, ativo")
    .eq("distribuidor_id", params.distribuidorId);

  if (existingCategoriesError) {
    throw existingCategoriesError;
  }

  if (categoriesToUpsert.length > 0) {
    const { error: upsertError } = await supabaseAdmin
      .from("distribuidor_categories")
      .upsert(categoriesToUpsert, {
        onConflict: "distribuidor_id,mercos_id",
      });

    if (upsertError) {
      throw upsertError;
    }
  }

  const mercosActiveIds = new Set(
    categoriesToUpsert
      .map((category) => Number(category.mercos_id))
      .filter((mercosId) => Number.isFinite(mercosId))
  );
  const mercosExcludedIds = new Set(
    categories
      .filter((category: any) => category.excluido)
      .map((category: any) => Number(category.id))
      .filter((mercosId) => Number.isFinite(mercosId))
  );

  const idsToDisable = (existingCategories || [])
    .filter((category: any) => {
      const mercosId = Number(category.mercos_id);
      if (!Number.isFinite(mercosId)) return false;
      return mercosExcludedIds.has(mercosId) || !mercosActiveIds.has(mercosId);
    })
    .map((category: any) => category.id);

  if (idsToDisable.length > 0) {
    const { error: deactivateError } = await supabaseAdmin
      .from("distribuidor_categories")
      .update({
        ativo: false,
        updated_at: new Date().toISOString(),
      })
      .in("id", idsToDisable);

    if (deactivateError) {
      throw deactivateError;
    }
  }

  return {
    synced: categoriesToUpsert.length,
    deactivated: idsToDisable.length,
    total: categories.length,
  };
}

export async function runDistribuidorMercosSync(params: {
  distribuidorId: string;
  full: boolean;
}): Promise<SyncResponse> {
  const state = await getDistribuidorMercosState(params.distribuidorId);

  if (state.kind === "not_found") {
    return { success: false, error: "Distribuidor não encontrado" };
  }

  if (state.kind === "disabled") {
    return {
      success: false,
      error: "Integração desativada pelo administrador.",
      isDisabled: true,
    };
  }

  if (state.kind === "needs_setup") {
    return {
      success: false,
      error: "Integração não configurada. Entre em contato com o suporte para ativar.",
      needsSetup: true,
    };
  }

  const { distribuidor } = state;
  let categoriesSyncSummary: { synced: number; deactivated: number; total: number } | null = null;
  let categoriesSyncWarning: string | null = null;

  try {
    categoriesSyncSummary = await syncDistribuidorMercosCategories({
      distribuidorId: params.distribuidorId,
      applicationToken: distribuidor.applicationToken,
      companyToken: distribuidor.companyToken,
      baseUrl: distribuidor.baseUrl,
    });
  } catch (error: any) {
    categoriesSyncWarning =
      error?.message || "Não foi possível atualizar as categorias da Mercos nesta sincronização.";
    logger.error("[Sync] Falha ao sincronizar categorias da Mercos:", error);
  }

  const batchSize = 200;
  const maxPages = 100;
  const mercosApi = new MercosAPI({
    applicationToken: distribuidor.applicationToken,
    companyToken: distribuidor.companyToken,
    baseUrl: distribuidor.baseUrl,
  });
  const allProdutos: any[] = [];
  const seenMercosIds = new Set<number>();
  const bumpIsoSecond = (iso: string) => {
    try {
      const date = new Date(iso);
      if (!Number.isNaN(date.getTime())) {
        return new Date(date.getTime() + 1000).toISOString();
      }
    } catch {}
    return iso;
  };

  let alteradoApos =
    !params.full && distribuidor.ultima_sincronizacao
      ? distribuidor.ultima_sincronizacao
      : "2020-01-01T00:00:00";
  let afterId: number | null = null;
  let hasMore = true;
  let pageCount = 0;
  let lastSeenKey: string | null = null;
  let repeatCount = 0;

  while (hasMore && pageCount < maxPages) {
    pageCount++;

    let produtosPage: any[] = [];
    let limitouRegistros = false;

    try {
      const batch = await mercosApi.getBatchProdutosByAlteracao({
        alteradoApos,
        afterId,
        limit: batchSize,
        orderDirection: "asc",
      });
      produtosPage = Array.isArray(batch.produtos) ? batch.produtos : [];
      limitouRegistros = batch.limited;
    } catch (error: any) {
      return {
        success: false,
        error: `Erro na API Mercos (page ${pageCount}): ${error?.message || error}`,
      };
    }

    if (produtosPage.length === 0) {
      hasMore = false;
      break;
    }

    produtosPage.sort((a: any, b: any) => {
      const ta = (a.ultima_alteracao || "").toString();
      const tb = (b.ultima_alteracao || "").toString();
      if (ta < tb) return -1;
      if (ta > tb) return 1;
      return Number(a.id || 0) - Number(b.id || 0);
    });

    for (const produto of produtosPage) {
      const mercosId = Number(produto?.id);
      if (Number.isFinite(mercosId) && seenMercosIds.has(mercosId)) {
        continue;
      }
      if (Number.isFinite(mercosId)) {
        seenMercosIds.add(mercosId);
      }
      allProdutos.push(produto);
    }

    const ultimoProduto = produtosPage[produtosPage.length - 1];
    const ultimaAlteracao = ultimoProduto?.ultima_alteracao?.toString() || null;
    const ultimoMercosId = Number(ultimoProduto?.id || 0) || null;

    if (!limitouRegistros || !ultimaAlteracao) {
      hasMore = false;
      break;
    }

    const currentKey = `${ultimaAlteracao}#${ultimoMercosId || 0}`;
    if (currentKey === lastSeenKey) {
      repeatCount++;
      alteradoApos = bumpIsoSecond(ultimaAlteracao);
      afterId = null;
    } else {
      repeatCount = 0;
      if (ultimaAlteracao === alteradoApos && ultimoMercosId) {
        afterId = ultimoMercosId;
      } else {
        alteradoApos = ultimaAlteracao;
        afterId = null;
      }
    }
    lastSeenKey = currentKey;

    if (repeatCount >= 3) {
      hasMore = false;
      break;
    }
  }

  const categoryState = await loadDistribuidorCategorySyncState(params.distribuidorId);

  const now = new Date().toISOString();
  let latestMercosTimestamp: string | null = null;
  let produtosNovos = 0;
  let produtosAtualizados = 0;
  let erros = 0;

  const existingProducts = await loadExistingDistribuidorProducts(params.distribuidorId);

  const existentes = new Map<number, { id: string; images: any; category_id: string | null }>(
    (existingProducts || []).map((record: any) => [
      record.mercos_id as number,
      { id: record.id, images: record.images, category_id: record.category_id },
    ])
  );

  const novosPayload: any[] = [];
  const updatesPayload: { id: string; data: any }[] = [];

  for (const produto of allProdutos) {
    const isExcluido = !!produto.excluido;
    const existing = existentes.get(produto.id);

    if (isExcluido) {
      if (existing) {
        await supabaseAdmin.from("products").delete().eq("id", existing.id);
      }
      continue;
    }

    const existingImages = existing?.images || [];
    const hasExistingImages = Array.isArray(existingImages) && existingImages.length > 0;
    if (produto.ultima_alteracao) {
      const timestamp = produto.ultima_alteracao.toString();
      if (!latestMercosTimestamp || timestamp > latestMercosTimestamp) {
        latestMercosTimestamp = timestamp;
      }
    }

    const produtoData: any = {
      name: produto.nome || "Sem nome",
      description: produto.descricao || produto.observacoes || "",
      price: parseFloat(produto.preco_tabela) || 0,
      stock_qty: produto.saldo_estoque || 0,
      active: produto.ativo !== false,
      mercos_id: produto.id,
      codigo_mercos: produto.codigo || null,
      distribuidor_id: params.distribuidorId,
      sincronizado_em: now,
      origem: "mercos",
      track_stock: true,
      sob_encomenda: false,
      pre_venda: false,
      pronta_entrega: true,
      category_id: chooseDistribuidorProductCategoryId({
        mercosCategoryId: produto.categoria_id,
        categoryMap: categoryState.categoryMap,
        existingCategoryId: existing?.category_id,
        validCategoryIds: categoryState.validCategoryIds,
      }),
      categoria_mercos: produto.categoria_id ? String(produto.categoria_id) : null,
    };

    if (existing) {
      if (hasExistingImages) {
        produtoData.images = existingImages;
      }
      updatesPayload.push({ id: existing.id, data: produtoData });
    } else {
      produtoData.images = [];
      novosPayload.push(produtoData);
    }
  }

  const insertBatchSize = 200;
  for (let index = 0; index < novosPayload.length; index += insertBatchSize) {
    const batch = novosPayload.slice(index, index + insertBatchSize);
    const batchResult = await persistNewProductsBatch(batch);
    produtosNovos += batchResult.inserted;
    produtosAtualizados += batchResult.updated;
    erros += batchResult.errors;
  }

  const updateConcurrency = 10;
  for (let index = 0; index < updatesPayload.length; index += updateConcurrency) {
    const slice = updatesPayload.slice(index, index + updateConcurrency);
    const results = await Promise.allSettled(
      slice.map(async (payload) => {
        const { error } = await supabaseAdmin
          .from("products")
          .update(payload.data)
          .eq("id", payload.id);
        if (error) throw error;
      })
    );

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        produtosAtualizados++;
      } else {
        erros++;
      }
    });
  }

  if (params.full && allProdutos.length > 0) {
    const mercosIdsSet = new Set(allProdutos.map((produto: any) => produto.id));
    const toDeactivate = (existingProducts || [])
      .filter((product: any) => !mercosIdsSet.has(product.mercos_id))
      .map((product: any) => product.id);

    for (let index = 0; index < toDeactivate.length; index += 500) {
      const chunk = toDeactivate.slice(index, index + 500);
      await supabaseAdmin.from("products").update({ active: false }).in("id", chunk);
    }
  }

  const syncTimestamp = latestMercosTimestamp || distribuidor.ultima_sincronizacao || now;
  await supabaseAdmin
    .from("distribuidores")
    .update({ ultima_sincronizacao: syncTimestamp })
    .eq("id", params.distribuidorId);

  const { count: totalProdutos } = await supabaseAdmin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("distribuidor_id", params.distribuidorId)
    .eq("active", true);

  return {
    success: true,
    data: {
      produtos_novos: produtosNovos,
      produtos_atualizados: produtosAtualizados,
      erros,
      total_produtos: totalProdutos || 0,
      categorias_sincronizadas: categoriesSyncSummary?.synced || 0,
      categorias_desativadas: categoriesSyncSummary?.deactivated || 0,
      categorias_total_mercos: categoriesSyncSummary?.total || 0,
      sincronizado_em: new Date().toISOString(),
      warning: categoriesSyncWarning,
    },
  };
}
