import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";
import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { loadDistributorPricingContext } from "@/lib/modules/products/service";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

async function ensureDistributorReportAccess(userId: string) {
  const { actor, error } = await loadJornaleiroActor(userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const banca = await getActiveBancaRowForUser(userId, "id, user_id, is_cotista, cotista_id");

  if (!banca) {
    throw new Error("BANCA_NOT_FOUND");
  }

  const entitlements = await resolveBancaPlanEntitlements(banca);

  if (!entitlements.canAccessDistributorCatalog) {
    throw new Error("FORBIDDEN_DISTRIBUTOR_PLAN_ONLY");
  }

  return { banca, entitlements };
}

export async function loadJornaleiroCotistaReport(userId: string) {
  const { banca, entitlements } = await ensureDistributorReportAccess(userId);

  const [{ data: produtosProprios, error: produtosPropriosError }, { data: produtosDistribuidor, error: produtosDistribuidorError }] =
    await Promise.all([
      supabaseAdmin
        .from("products")
        .select("id, price")
        .eq("banca_id", banca.id)
        .eq("active", true)
        .is("distribuidor_id", null),
      supabaseAdmin
        .from("products")
        .select("id, price, distribuidor_id, category_id")
        .not("distribuidor_id", "is", null)
        .eq("active", true),
    ]);

  if (produtosPropriosError) {
    throw new Error(produtosPropriosError.message || "Erro ao buscar produtos próprios");
  }

  if (produtosDistribuidorError) {
    throw new Error(produtosDistribuidorError.message || "Erro ao buscar produtos de distribuidor");
  }

  const { customMap, calculateDistributorPrice } = await loadDistributorPricingContext<{
    product_id: string;
    enabled: boolean | null;
    custom_price: number | null;
    custom_stock_enabled: boolean | null;
  }>({
    products: (produtosDistribuidor || []) as any[],
    customFields: "product_id, enabled, custom_price, custom_stock_enabled",
    customBancaId: banca.id,
  });

  const customizacoes = Array.from(customMap.values());
  const produtosHabilitados = (produtosDistribuidor || []).filter((produto) => {
    const custom = customMap.get(produto.id);
    return !custom || custom.enabled !== false;
  });
  const produtosDesabilitados = (produtosDistribuidor || []).filter((produto) => {
    const custom = customMap.get(produto.id);
    return custom?.enabled === false;
  });
  const produtosCustomizados = customizacoes.filter(
    (customizacao) =>
      customizacao.custom_price !== null || customizacao.custom_stock_enabled === true
  );
  const produtosEstoqueProprio = customizacoes.filter(
    (customizacao) => customizacao.custom_stock_enabled === true
  );

  let valorOriginal = 0;
  let valorCustomizado = 0;

  produtosHabilitados.forEach((produto) => {
    const custom = customMap.get(produto.id);
    const precoOriginal = calculateDistributorPrice(produto);
    const precoCustom =
      custom?.custom_price != null ? Number(custom.custom_price) : precoOriginal;

    valorOriginal += precoOriginal;
    valorCustomizado += precoCustom;
  });

  return {
    success: true,
    plan: {
      type: entitlements.planType,
      name: entitlements.plan?.name || "Free",
      can_access_distributor_catalog: entitlements.canAccessDistributorCatalog,
    },
    stats: {
      total_produtos: (produtosProprios?.length || 0) + produtosHabilitados.length,
      produtos_proprios: produtosProprios?.length || 0,
      produtos_distribuidores: produtosHabilitados.length,
      produtos_customizados: produtosCustomizados.length,
      produtos_desabilitados: produtosDesabilitados.length,
      produtos_estoque_proprio: produtosEstoqueProprio.length,
      valor_catalogo_original: valorOriginal,
      valor_catalogo_customizado: valorCustomizado,
      economia_preco_custom: valorCustomizado - valorOriginal,
    },
  };
}
