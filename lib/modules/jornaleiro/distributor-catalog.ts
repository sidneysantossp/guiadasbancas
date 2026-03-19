import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";
import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";
import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import {
  buildDistributorProductCustomizationInput,
  loadDistributorPricingContext,
  saveDistributorProductCustomization,
} from "@/lib/modules/products/service";
import { getNextPlanType } from "@/lib/plan-messaging";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";

function buildLockedCatalogPayload(entitlements: Awaited<ReturnType<typeof resolveBancaPlanEntitlements>>) {
  const overdueLockMessage =
    entitlements.overdueFeaturesLocked && entitlements.subscription?.plan
      ? `Seu plano ${entitlements.subscription.plan.name} está com cobrança em aberto. O acesso à rede parceira foi pausado após o período de carência.`
      : null;
  const pendingUpgradeMessage =
    entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
      ? `Seu upgrade para ${entitlements.requestedPlan.name} foi iniciado, mas a rede de distribuidores só será liberada após o pagamento da primeira cobrança.`
      : "O catálogo de distribuidores é liberado apenas para planos com acesso à rede parceira.";

  return {
    success: true,
    data: [],
    products: [],
    total: 0,
    is_cotista: false,
    has_catalog_access: false,
    plan: entitlements.plan,
    requested_plan: entitlements.requestedPlan,
    subscription: entitlements.subscription,
    entitlements: {
      plan_type: entitlements.planType,
      can_access_distributor_catalog: false,
      can_access_partner_directory: entitlements.canAccessPartnerDirectory,
      paid_features_locked_until_payment: entitlements.paidFeaturesLockedUntilPayment,
      overdue_features_locked: entitlements.overdueFeaturesLocked,
      overdue_in_grace_period: entitlements.overdueInGracePeriod,
      overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
    },
    message: overdueLockMessage || pendingUpgradeMessage,
    recommended_plan_type: entitlements.planType === "premium" ? null : "premium",
    upgrade_url: "/jornaleiro/meu-plano",
    next_plan_type: getNextPlanType(entitlements.planType),
  };
}

function buildCatalogAccessError(entitlements: Awaited<ReturnType<typeof resolveBancaPlanEntitlements>>) {
  const payload =
    entitlements.overdueFeaturesLocked && entitlements.subscription?.plan
      ? {
          success: false,
          error: `Seu plano ${entitlements.subscription.plan.name} está com cobrança em aberto e o acesso ao catálogo parceiro foi pausado após a carência.`,
          code: "PLAN_OVERDUE_SUSPENDED",
          plan: entitlements.plan,
          contracted_plan: entitlements.subscription.plan,
          overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
          upgrade_url: "/jornaleiro/meu-plano",
        }
      : entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan
        ? {
            success: false,
            error: `Seu upgrade para ${entitlements.requestedPlan.name} está aguardando o pagamento da primeira cobrança. Assim que confirmar, o catálogo parceiro será liberado.`,
            code: "PLAN_PENDING_PAYMENT",
            plan: entitlements.plan,
            requested_plan: entitlements.requestedPlan,
            upgrade_url: "/jornaleiro/meu-plano",
          }
        : {
            success: false,
            error: "Seu plano atual não permite customizar o catálogo de distribuidores.",
            code: "PLAN_DISTRIBUTOR_CATALOG_LOCKED",
            plan: entitlements.plan,
            recommended_plan_type: "premium",
            upgrade_url: "/jornaleiro/meu-plano",
          };

  return Object.assign(new Error(String(payload.code)), {
    status: 403,
    payload,
  });
}

async function ensureJornaleiroDistributorCatalogContext(userId: string) {
  const { actor, error } = await loadJornaleiroActor(userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const banca = await getActiveBancaRowForUser(userId, "id, user_id, is_cotista, cotista_id");

  if (!banca) {
    return {
      banca: null,
      entitlements: null,
    };
  }

  const entitlements = await resolveBancaPlanEntitlements(banca);

  return {
    banca,
    entitlements,
  };
}

async function listDistribuidorCounts() {
  const { data: distribuidores, error } = await supabaseAdmin
    .from("distribuidores")
    .select("id, nome")
    .order("nome");

  if (error) {
    throw new Error(error.message || "Erro ao listar distribuidores");
  }

  if (!distribuidores || distribuidores.length === 0) {
    return [];
  }

  const counts = await Promise.all(
    distribuidores.map(async (distribuidor) => {
      const { count, error: countError } = await supabaseAdmin
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("distribuidor_id", distribuidor.id)
        .eq("active", true);

      if (countError) {
        throw new Error(countError.message || "Erro ao contar produtos do distribuidor");
      }

      return {
        nome: distribuidor.nome,
        count: count || 0,
      };
    })
  );

  return counts
    .filter((item) => item.count > 0)
    .sort((left, right) => left.nome.localeCompare(right.nome));
}

async function loadCategoryNameMap(products: Array<{ category_id?: string | null }>) {
  const categoryIds = Array.from(
    new Set(products.map((product) => product.category_id).filter(Boolean))
  );

  if (categoryIds.length === 0) {
    return new Map<string, string>();
  }

  const [{ data: categories }, { data: distribuidorCategories }] = await Promise.all([
    supabaseAdmin.from("categories").select("id, name").in("id", categoryIds as string[]),
    supabaseAdmin
      .from("distribuidor_categories")
      .select("id, nome")
      .in("id", categoryIds as string[]),
  ]);

  return new Map<string, string>([
    ...((categories || []).map((category) => [category.id, category.name]) as Array<
      [string, string]
    >),
    ...((distribuidorCategories || []).map((category) => [category.id, category.nome]) as Array<
      [string, string]
    >),
  ]);
}

export async function loadJornaleiroDistributorCatalog(params: {
  userId: string;
  requestUrl: string;
}) {
  const context = await ensureJornaleiroDistributorCatalogContext(params.userId);
  const bancaLifecycle = resolveBancaLifecycle(context.banca);

  if (!context.banca || !context.entitlements) {
    return {
      success: true,
      data: [],
      products: [],
      banca_lifecycle: bancaLifecycle,
      message: "Cadastre sua banca para ver o catálogo de produtos dos distribuidores",
    };
  }

  const entitlements = context.entitlements;

  if (!entitlements.canAccessDistributorCatalog) {
    return buildLockedCatalogPayload(entitlements);
  }

  const searchParams = new URL(params.requestUrl).searchParams;
  const q = (searchParams.get("q") || "").toLowerCase();
  const distribuidorFilter = searchParams.get("distribuidor") || "";
  const limit = q ? 200 : 100;

  let query = supabaseAdmin
    .from("products")
    .select(
      "id, name, description, price, stock_qty, images, mercos_id, codigo_mercos, distribuidor_id, track_stock, pronta_entrega, sob_encomenda, pre_venda, created_at, category_id, active"
    )
    .not("distribuidor_id", "is", null)
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
  }

  if (distribuidorFilter) {
    const { data: distribuidor } = await supabaseAdmin
      .from("distribuidores")
      .select("id")
      .eq("nome", distribuidorFilter)
      .single();

    if (distribuidor?.id) {
      query = query.eq("distribuidor_id", distribuidor.id);
    }
  }

  query = query.limit(limit);

  const [{ data: produtos, error: produtosError }, distribuidores] = await Promise.all([
    query,
    listDistribuidorCounts(),
  ]);

  if (produtosError) {
    throw new Error(produtosError.message || "Erro ao buscar produtos do catálogo parceiro");
  }

  const productRows = (produtos || []) as any[];
  const [categoryMap, pricingContext] = await Promise.all([
    loadCategoryNameMap(productRows),
    loadDistributorPricingContext<{
      id: string;
      product_id: string;
      enabled: boolean | null;
      custom_price: number | null;
      custom_description: string | null;
      custom_status: string | null;
      custom_pronta_entrega: boolean | null;
      custom_sob_encomenda: boolean | null;
      custom_pre_venda: boolean | null;
      custom_stock_enabled: boolean | null;
      custom_stock_qty: number | null;
      custom_featured: boolean | null;
      modificado_em: string | null;
    }>({
      products: productRows,
      customFields:
        "id, product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda, custom_stock_enabled, custom_stock_qty, custom_featured, modificado_em",
      customBancaId: context.banca.id,
    }),
  ]);

  const items = productRows.map((produto) => {
    const custom = pricingContext.customMap.get(produto.id);
    const precoBase = Number(produto.price || 0);
    const precoComMarkup = pricingContext.calculateDistributorPrice(produto);
    const effectivePrice =
      custom?.custom_price != null ? Number(custom.custom_price) : precoComMarkup;
    const distribuidor = pricingContext.distribuidorMap.get(produto.distribuidor_id);

    return {
      ...produto,
      distribuidor_nome: distribuidor?.nome || null,
      category_name: categoryMap.get(produto.category_id) || null,
      enabled: custom?.enabled ?? true,
      custom_price: custom?.custom_price ?? null,
      custom_description: custom?.custom_description || null,
      custom_status: custom?.custom_status || "available",
      custom_pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
      custom_sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
      custom_pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
      custom_stock_enabled: custom?.custom_stock_enabled ?? false,
      custom_stock_qty: custom?.custom_stock_qty ?? null,
      custom_featured: custom?.custom_featured ?? false,
      modificado_em: custom?.modificado_em || null,
      customizacao_id: custom?.id || null,
      preco_base: precoBase,
      distribuidor_price: precoComMarkup,
      effective_price: effectivePrice,
    };
  });

  return {
    success: true,
    products: items,
    data: items,
    distribuidores,
    total: items.length,
    is_cotista: entitlements.isLegacyCotistaLinked,
    has_catalog_access: true,
    banca_lifecycle: bancaLifecycle,
    plan: entitlements.plan,
    entitlements: {
      plan_type: entitlements.planType,
      can_access_distributor_catalog: true,
      can_access_partner_directory: entitlements.canAccessPartnerDirectory,
    },
  };
}

export async function updateJornaleiroDistributorCatalogProduct(params: {
  userId: string;
  productId: string;
  input: Record<string, unknown>;
}) {
  const context = await ensureJornaleiroDistributorCatalogContext(params.userId);

  if (!context.banca || !context.entitlements) {
    throw new Error("BANCA_NOT_FOUND");
  }

  if (!context.entitlements.canAccessDistributorCatalog) {
    throw buildCatalogAccessError(context.entitlements);
  }

  const { data: produto, error: produtoError } = await supabaseAdmin
    .from("products")
    .select("id, distribuidor_id")
    .eq("id", params.productId)
    .single();

  if (produtoError) {
    throw new Error(produtoError.message || "Erro ao validar produto do catálogo parceiro");
  }

  if (!produto || !produto.distribuidor_id) {
    throw new Error("DISTRIBUTOR_PRODUCT_NOT_FOUND");
  }

  const customizationInput = buildDistributorProductCustomizationInput(params.input);

  await saveDistributorProductCustomization({
    bancaId: context.banca.id,
    productId: params.productId,
    input: customizationInput,
  });

  return {
    success: true,
    message: "Customização atualizada com sucesso",
  };
}
