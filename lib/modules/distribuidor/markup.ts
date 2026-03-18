import { supabaseAdmin } from "@/lib/supabase";

type MarkupScope = "global" | "categoria" | "produto";
type CalculationType = "markup" | "margem";

function normalizeNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeCalculationType(value: unknown): CalculationType {
  return value === "margem" ? "margem" : "markup";
}

function normalizeGlobalMarkupPayload(input: {
  markup_percentual?: unknown;
  markup_fixo?: unknown;
  margem_percentual?: unknown;
  margem_divisor?: unknown;
  tipo_calculo?: unknown;
}) {
  return {
    markup_global_percentual: normalizeNumber(input.markup_percentual, 0),
    markup_global_fixo: normalizeNumber(input.markup_fixo, 0),
    margem_percentual: normalizeNumber(input.margem_percentual, 0),
    margem_divisor: normalizeNumber(input.margem_divisor, 1),
    tipo_calculo: normalizeCalculationType(input.tipo_calculo),
  };
}

export async function getDistribuidorMarkupOverview(distribuidorId: string) {
  const [{ data: distribuidor, error: distError }, { data: markupCategorias, error: markupCategoriasError }, { data: markupProdutos, error: markupProdutosError }, { data: distCatsMarkup, error: distCatsError }, { data: bancaCatsMarkup, error: bancaCatsError }, { count: totalProdutos, error: totalProdutosError }] = await Promise.all([
    supabaseAdmin
      .from("distribuidores")
      .select("id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo")
      .eq("id", distribuidorId)
      .single(),
    supabaseAdmin
      .from("distribuidor_markup_categorias")
      .select("id, category_id, markup_percentual, markup_fixo")
      .eq("distribuidor_id", distribuidorId),
    supabaseAdmin
      .from("distribuidor_markup_produtos")
      .select(`
        id,
        product_id,
        markup_percentual,
        markup_fixo,
        products(id, name, codigo_mercos, price)
      `)
      .eq("distribuidor_id", distribuidorId),
    supabaseAdmin
      .from("distribuidor_categories")
      .select("id, nome")
      .eq("distribuidor_id", distribuidorId),
    supabaseAdmin
      .from("categories")
      .select("id, name")
      .eq("active", true)
      .order("name"),
    supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("distribuidor_id", distribuidorId),
  ]);

  if (distError) {
    throw distError;
  }

  if (markupCategoriasError || markupProdutosError || distCatsError || bancaCatsError || totalProdutosError) {
    throw markupCategoriasError || markupProdutosError || distCatsError || bancaCatsError || totalProdutosError;
  }

  const catNameMap = new Map<string, string>();
  for (const category of distCatsMarkup || []) catNameMap.set(category.id, category.nome);
  for (const category of bancaCatsMarkup || []) catNameMap.set(category.id, category.name);

  const categoriasDisponiveis = [
    ...((distCatsMarkup || []).map((category: any) => ({ id: category.id, name: category.nome }))),
    ...((bancaCatsMarkup || []).map((category: any) => ({ id: category.id, name: category.name }))),
  ].sort((a, b) => a.name.localeCompare(b.name));

  return {
    global: {
      markup_percentual: normalizeNumber(distribuidor.markup_global_percentual, 0),
      markup_fixo: normalizeNumber(distribuidor.markup_global_fixo, 0),
      margem_percentual: normalizeNumber(distribuidor.margem_percentual, 0),
      margem_divisor: normalizeNumber(distribuidor.margem_divisor, 1),
      tipo_calculo: normalizeCalculationType(distribuidor.tipo_calculo),
    },
    categorias: (markupCategorias || []).map((markup: any) => ({
      id: markup.id,
      category_id: markup.category_id,
      category_name: catNameMap.get(markup.category_id) || "Categoria",
      markup_percentual: normalizeNumber(markup.markup_percentual, 0),
      markup_fixo: normalizeNumber(markup.markup_fixo, 0),
    })),
    produtos: (markupProdutos || []).map((markup: any) => ({
      id: markup.id,
      product_id: markup.product_id,
      product_name: markup.products?.name || "Produto",
      product_codigo: markup.products?.codigo_mercos || "",
      product_price: markup.products?.price ?? null,
      markup_percentual: normalizeNumber(markup.markup_percentual, 0),
      markup_fixo: normalizeNumber(markup.markup_fixo, 0),
    })),
    categoriasDisponiveis,
    totalProdutos: totalProdutos || 0,
  };
}

export async function saveDistribuidorMarkup(params: {
  distribuidorId: string;
  tipo: MarkupScope;
  dados: Record<string, unknown>;
}) {
  const { distribuidorId, tipo, dados } = params;

  if (tipo === "global") {
    const { error } = await supabaseAdmin
      .from("distribuidores")
      .update(normalizeGlobalMarkupPayload(dados))
      .eq("id", distribuidorId);

    if (error) throw error;
    return;
  }

  if (tipo === "categoria") {
    const { error } = await supabaseAdmin
      .from("distribuidor_markup_categorias")
      .upsert(
        {
          distribuidor_id: distribuidorId,
          category_id: String(dados.category_id || "").trim(),
          markup_percentual: normalizeNumber(dados.markup_percentual, 0),
          markup_fixo: normalizeNumber(dados.markup_fixo, 0),
        },
        { onConflict: "distribuidor_id,category_id" }
      );

    if (error) throw error;
    return;
  }

  if (tipo === "produto") {
    const { error } = await supabaseAdmin
      .from("distribuidor_markup_produtos")
      .upsert(
        {
          distribuidor_id: distribuidorId,
          product_id: String(dados.product_id || "").trim(),
          markup_percentual: normalizeNumber(dados.markup_percentual, 0),
          markup_fixo: normalizeNumber(dados.markup_fixo, 0),
        },
        { onConflict: "distribuidor_id,product_id" }
      );

    if (error) throw error;
    return;
  }

  throw new Error("Tipo de markup inválido");
}

export async function deleteDistribuidorMarkup(params: {
  distribuidorId?: string | null;
  tipo: "categoria" | "produto";
  id: string;
}) {
  const tableName =
    params.tipo === "categoria"
      ? "distribuidor_markup_categorias"
      : "distribuidor_markup_produtos";

  let query = supabaseAdmin.from(tableName).delete().eq("id", params.id);
  if (params.distribuidorId) {
    query = query.eq("distribuidor_id", params.distribuidorId);
  }

  const { error } = await query;
  if (error) throw error;
}

export async function applyBulkDistribuidorMarkup(params: {
  distribuidorId: string;
  tipoCalculo?: unknown;
  markupPercentual?: unknown;
  markupFixo?: unknown;
  margemPercentual?: unknown;
  margemDivisor?: unknown;
}) {
  const globalPayload = normalizeGlobalMarkupPayload({
    markup_percentual: params.markupPercentual,
    markup_fixo: params.markupFixo,
    margem_percentual: params.margemPercentual,
    margem_divisor: params.margemDivisor,
    tipo_calculo: params.tipoCalculo,
  });

  const { error: updateError } = await supabaseAdmin
    .from("distribuidores")
    .update(globalPayload)
    .eq("id", params.distribuidorId);

  if (updateError) throw updateError;

  let allProducts: Array<{ id: string }> = [];
  let from = 0;
  const fetchSize = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data: batch, error } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("distribuidor_id", params.distribuidorId)
      .range(from, from + fetchSize - 1);

    if (error) throw error;

    if (batch && batch.length > 0) {
      allProducts = allProducts.concat(batch);
      from += fetchSize;
      hasMore = batch.length === fetchSize;
    } else {
      hasMore = false;
    }
  }

  if (allProducts.length === 0) {
    return { updated: 0, total: 0 };
  }

  let effectivePercentual = 0;
  let effectiveFixo = 0;
  if (globalPayload.tipo_calculo === "margem") {
    const divisor = globalPayload.margem_divisor || 1;
    if (divisor > 0 && divisor < 1) {
      effectivePercentual = ((1 / divisor) - 1) * 100;
    }
  } else {
    effectivePercentual = globalPayload.markup_global_percentual;
    effectiveFixo = globalPayload.markup_global_fixo;
  }

  const records = allProducts.map((product) => ({
    distribuidor_id: params.distribuidorId,
    product_id: product.id,
    markup_percentual: effectivePercentual,
    markup_fixo: effectiveFixo,
  }));

  const batchSize = 100;
  let totalUpdated = 0;
  for (let index = 0; index < records.length; index += batchSize) {
    const batch = records.slice(index, index + batchSize);
    const { error } = await supabaseAdmin
      .from("distribuidor_markup_produtos")
      .upsert(batch, { onConflict: "distribuidor_id,product_id" });

    if (!error) {
      totalUpdated += batch.length;
    }
  }

  return {
    updated: totalUpdated,
    total: allProducts.length,
  };
}

export async function deleteAllDistribuidorProductMarkups(distribuidorId: string) {
  const { count, error: countError } = await supabaseAdmin
    .from("distribuidor_markup_produtos")
    .select("id", { count: "exact", head: true })
    .eq("distribuidor_id", distribuidorId);

  if (countError) throw countError;

  const { error } = await supabaseAdmin
    .from("distribuidor_markup_produtos")
    .delete()
    .eq("distribuidor_id", distribuidorId);

  if (error) throw error;

  return {
    deleted: count || 0,
  };
}

export async function syncDistribuidorProductCustomPriceMarkup(params: {
  distribuidorId: string;
  productId: string;
  customPrice: number | null;
}) {
  if (typeof params.customPrice === "number" && Number.isFinite(params.customPrice)) {
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("price")
      .eq("id", params.productId)
      .eq("distribuidor_id", params.distribuidorId)
      .single();

    if (productError) throw productError;

    const basePrice = normalizeNumber(product?.price, 0);
    const markupPercentual =
      basePrice > 0 ? ((params.customPrice - basePrice) / basePrice) * 100 : 0;

    await saveDistribuidorMarkup({
      distribuidorId: params.distribuidorId,
      tipo: "produto",
      dados: {
        product_id: params.productId,
        markup_percentual: markupPercentual,
        markup_fixo: 0,
      },
    });

    return {
      hasCustomMarkup: true,
      markupPercentual,
    };
  }

  const { error } = await supabaseAdmin
    .from("distribuidor_markup_produtos")
    .delete()
    .eq("distribuidor_id", params.distribuidorId)
    .eq("product_id", params.productId);

  if (error) throw error;

  return {
    hasCustomMarkup: false,
    markupPercentual: null,
  };
}
