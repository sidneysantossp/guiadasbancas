import { getDistribuidorAccessibleBancas } from "@/lib/distribuidor-access";
import { supabaseAdmin } from "@/lib/supabase";

type DistribuidorRecentCategory = {
  id: string;
  nome: string | null;
  updated_at: string | null;
};

type DistribuidorRecentProduct = {
  id: string;
  name: string | null;
  price: number | null;
  active: boolean | null;
  sincronizado_em: string | null;
  mercos_id: number | null;
  codigo_mercos?: string | null;
  created_at: string | null;
};

function resolveSyncStatus(ultimaSincronizacao: string | null | undefined) {
  if (!ultimaSincronizacao) {
    return {
      codigo: "warning",
      mensagem: "Nunca sincronizado",
      tempo_ultima_sincronizacao: null as string | null,
    };
  }

  const agora = new Date();
  const ultimaSync = new Date(ultimaSincronizacao);
  const diffMs = agora.getTime() - ultimaSync.getTime();
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffHorasDecimal = diffMs / (1000 * 60 * 60);

  const tempoUltimaSincronizacao =
    diffHoras > 0 ? `${diffHoras}h ${diffMinutos}m atrás` : `${diffMinutos}m atrás`;

  if (diffHorasDecimal > 24) {
    return {
      codigo: "error",
      mensagem: "Sincronização atrasada (>24h)",
      tempo_ultima_sincronizacao: tempoUltimaSincronizacao,
    };
  }

  if (diffHorasDecimal > 6) {
    return {
      codigo: "warning",
      mensagem: "Sincronização pode estar atrasada (>6h)",
      tempo_ultima_sincronizacao: tempoUltimaSincronizacao,
    };
  }

  return {
    codigo: "ok",
    mensagem: "Sincronização em dia",
    tempo_ultima_sincronizacao: tempoUltimaSincronizacao,
  };
}

async function findDistribuidorById(distribuidorId: string) {
  const { data, error } = await supabaseAdmin
    .from("distribuidores")
    .select("*")
    .eq("id", distribuidorId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

async function loadCategoryNameMap(distribuidorId: string) {
  const { data, error } = await supabaseAdmin
    .from("distribuidor_categories")
    .select("id, nome")
    .eq("distribuidor_id", distribuidorId);

  if (error) {
    throw error;
  }

  return new Map((data || []).map((category) => [category.id, category.nome || "Sem Categoria"]));
}

export async function getAdminDistribuidoresList() {
  const { data: distribuidores, error } = await supabaseAdmin
    .from("distribuidores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  if (!distribuidores || distribuidores.length === 0) {
    return [];
  }

  const distribuidorIds = distribuidores.map((item) => item.id);
  const { data: produtosAtivos, error: productsError } = await supabaseAdmin
    .from("products")
    .select("distribuidor_id")
    .in("distribuidor_id", distribuidorIds)
    .eq("active", true);

  if (productsError) {
    throw productsError;
  }

  const counts = new Map<string, number>();
  for (const product of produtosAtivos || []) {
    const distribuidorId = String(product.distribuidor_id || "");
    if (!distribuidorId) continue;
    counts.set(distribuidorId, (counts.get(distribuidorId) || 0) + 1);
  }

  return distribuidores.map((distribuidor) => ({
    ...distribuidor,
    total_produtos: counts.get(distribuidor.id) || 0,
  }));
}

export async function getAdminDistribuidorDetail(distribuidorId: string) {
  const distribuidor = await findDistribuidorById(distribuidorId);

  if (!distribuidor) {
    return null;
  }

  const syncedSince = new Date();
  syncedSince.setDate(syncedSince.getDate() - 1);

  const [
    { count: totalProdutos, error: totalProdutosError },
    { count: totalCategorias, error: totalCategoriasError },
    { count: produtos24h, error: produtos24hError },
    categoriasRecentesResponse,
    produtosRecentesResponse,
    accessibleBancas,
  ] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("distribuidor_id", distribuidorId)
      .eq("active", true),
    supabaseAdmin
      .from("distribuidor_categories")
      .select("*", { count: "exact", head: true })
      .eq("distribuidor_id", distribuidorId),
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("distribuidor_id", distribuidorId)
      .gte("sincronizado_em", syncedSince.toISOString()),
    supabaseAdmin
      .from("distribuidor_categories")
      .select("id, nome, updated_at")
      .eq("distribuidor_id", distribuidorId)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(8),
    supabaseAdmin
      .from("products")
      .select("id, name, price, active, sincronizado_em, mercos_id, codigo_mercos, created_at")
      .eq("distribuidor_id", distribuidorId)
      .order("created_at", { ascending: false })
      .limit(8),
    getDistribuidorAccessibleBancas(),
  ]);

  if (totalProdutosError) throw totalProdutosError;
  if (totalCategoriasError) throw totalCategoriasError;
  if (produtos24hError) throw produtos24hError;
  if (categoriasRecentesResponse.error) throw categoriasRecentesResponse.error;
  if (produtosRecentesResponse.error) throw produtosRecentesResponse.error;

  return {
    ...distribuidor,
    total_produtos: totalProdutos || 0,
    total_categorias: totalCategorias || 0,
    bancas_com_acesso: accessibleBancas.length,
    produtos_sincronizados_24h: produtos24h || 0,
    categorias_recentes: (categoriasRecentesResponse.data || []) as DistribuidorRecentCategory[],
    produtos_recentes: (produtosRecentesResponse.data || []) as DistribuidorRecentProduct[],
    bancas_relevantes: accessibleBancas.slice(0, 8).map((banca) => ({
      id: banca.id,
      name: banca.name,
      plan_type: banca.plan_type,
      is_legacy_cotista_linked: banca.is_legacy_cotista_linked,
    })),
  };
}

export async function getAdminDistribuidorStatus(distribuidorId: string) {
  const distribuidor = await findDistribuidorById(distribuidorId);

  if (!distribuidor) {
    return null;
  }

  const syncedSince = new Date();
  syncedSince.setDate(syncedSince.getDate() - 1);

  const [{ count: totalProdutos, error: totalProdutosError }, { count: produtosRecentes, error: produtosRecentesError }] =
    await Promise.all([
      supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("distribuidor_id", distribuidorId)
        .eq("origem", "mercos"),
      supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("distribuidor_id", distribuidorId)
        .eq("origem", "mercos")
        .gte("sincronizado_em", syncedSince.toISOString()),
    ]);

  if (totalProdutosError) throw totalProdutosError;
  if (produtosRecentesError) throw produtosRecentesError;

  const syncStatus = resolveSyncStatus(distribuidor.ultima_sincronizacao);

  return {
    distribuidor: {
      id: distribuidor.id,
      nome: distribuidor.nome,
      ativo: distribuidor.ativo,
      ultima_sincronizacao: distribuidor.ultima_sincronizacao,
      tempo_ultima_sincronizacao: syncStatus.tempo_ultima_sincronizacao,
    },
    estatisticas: {
      total_produtos: totalProdutos || 0,
      produtos_recentes_24h: produtosRecentes || 0,
    },
    status: {
      codigo: syncStatus.codigo,
      mensagem: syncStatus.mensagem,
    },
  };
}

export async function updateAdminDistribuidor(distribuidorId: string, payload: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from("distribuidores")
    .update(payload)
    .eq("id", distribuidorId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteAdminDistribuidor(distribuidorId: string) {
  const { error } = await supabaseAdmin
    .from("distribuidores")
    .delete()
    .eq("id", distribuidorId);

  if (error) {
    throw error;
  }
}

export async function getAdminDistribuidorProductsPage(params: {
  distribuidorId: string;
  limit: number;
  offset: number;
}) {
  const [{ count: totalCount, error: totalCountError }, produtosResponse, categoryNameMap] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("distribuidor_id", params.distribuidorId),
    supabaseAdmin
      .from("products")
      .select(
        "id,name,description,price,stock_qty,images,mercos_id,distribuidor_id,created_at,sincronizado_em,origem,category_id,codigo_mercos"
      )
      .eq("distribuidor_id", params.distribuidorId)
      .order("created_at", { ascending: false })
      .range(params.offset, params.offset + params.limit - 1),
    loadCategoryNameMap(params.distribuidorId),
  ]);

  if (totalCountError) throw totalCountError;
  if (produtosResponse.error) throw produtosResponse.error;

  return {
    data: (produtosResponse.data || []).map((product) => ({
      ...product,
      categoria_nome: product.category_id
        ? categoryNameMap.get(product.category_id) || "Sem Categoria"
        : "Sem Categoria",
    })),
    total: totalCount || 0,
    limit: params.limit,
    offset: params.offset,
  };
}

export async function getAdminDistribuidorCategories(distribuidorId: string) {
  const { data, error, count } = await supabaseAdmin
    .from("distribuidor_categories")
    .select("id, mercos_id, nome, categoria_pai_id, ativo, created_at", { count: "exact" })
    .eq("distribuidor_id", distribuidorId)
    .order("nome", { ascending: true })
    .limit(1000);

  if (error) {
    throw error;
  }

  return {
    data: data || [],
    total: count || 0,
  };
}

export async function getAdminDistribuidorSyncStatus(distribuidorId: string) {
  const [{ data: syncStatus, error: syncError }, { count: totalProdutos, error: totalProdutosError }, produtosExemploResponse] =
    await Promise.all([
      supabaseAdmin
        .from("sync_status")
        .select("*")
        .eq("distribuidor_id", distribuidorId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("distribuidor_id", distribuidorId),
      supabaseAdmin
        .from("products")
        .select("id, name, price, stock_qty, active, updated_at")
        .eq("distribuidor_id", distribuidorId)
        .order("updated_at", { ascending: false })
        .limit(5),
    ]);

  if (syncError) throw syncError;
  if (totalProdutosError) throw totalProdutosError;
  if (produtosExemploResponse.error) throw produtosExemploResponse.error;

  return {
    syncStatus,
    totalProdutos: totalProdutos || 0,
    produtosExemplo: produtosExemploResponse.data || [],
  };
}
