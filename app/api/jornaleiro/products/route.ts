import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { getNextPlanType } from "@/lib/plan-messaging";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  listDistributorCatalogForBanca,
  listOwnedCatalogProducts,
} from "@/lib/modules/products/service";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, error: "Não autorizado" },
      { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  // Buscar banca_id e informações de cotista do usuário
  const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id, is_cotista, cotista_id');

  if (!banca) {
    console.log('[API/JORNALEIRO/PRODUCTS] Usuário sem banca - retornando lista vazia');
    // Usuário sem banca: retornar lista vazia com mensagem
    return NextResponse.json({ 
      success: true, 
      items: [], 
      total: 0,
      message: 'Cadastre sua banca para ver seus produtos'
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  }

  const entitlements = await resolveBancaPlanEntitlements(banca);
  const isCotista = entitlements.isLegacyCotistaLinked;
  const canAccessDistributorCatalog = entitlements.canAccessDistributorCatalog;
  console.log('[JORNALEIRO/PRODUCTS] Banca row (plano + parceiro):', {
    is_cotista: banca.is_cotista,
    cotista_id: banca.cotista_id,
    plan_type: entitlements.planType,
    can_access_distributor_catalog: canAccessDistributorCatalog,
  });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const active = searchParams.get("active");
  const featured = searchParams.get("featured");
  const priceFilter = searchParams.get("priceFilter") || "";
  const statsOnly = searchParams.get("stats") === "true";

  const activeFilter = active === "true" ? true : active === "false" ? false : null;
  const featuredFilter = featured === "true" ? true : featured === "false" ? false : null;

  let produtosBanca: any[] = [];
  try {
    produtosBanca = await listOwnedCatalogProducts({
      bancaId: banca.id,
      filters: {
        q,
        category,
        active: activeFilter,
        featured: featuredFilter,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar produtos da banca:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar produtos" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  // Buscar produtos de distribuidores SOMENTE se for cotista
  let totalProdutosDistribuidor = 0;
  let produtosAdminCustomizados: any[] = [];
  try {
    const distributorCatalog = await listDistributorCatalogForBanca({
      bancaId: banca.id,
      filters: {
        q,
        category,
        limit: q ? 200 : 100,
      },
      canAccessCatalog: canAccessDistributorCatalog,
      includeTotalCount: statsOnly,
    });

    produtosAdminCustomizados = distributorCatalog.items;
    totalProdutosDistribuidor = distributorCatalog.totalAvailable;
  } catch (error) {
    console.error("[JORNALEIRO/PRODUCTS] Erro ao buscar produtos parceiros:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar catálogo parceiro" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  // Combinar produtos da banca + produtos do admin
  // (Os filtros q e category já foram aplicados na query do admin, e na query da banca (linha 54-57?))
  // Verificando query da banca... sim, linhas 54-59 aplicam filtros.
  
  let allItems = [...(produtosBanca || []), ...produtosAdminCustomizados];

  // Aplicar filtro de preço
  if (priceFilter === 'personalizado') {
    // Preços Personalizados: produtos onde o preço foi alterado pelo jornaleiro
    // - Produtos próprios da banca (não são de distribuidor)
    // - Produtos de distribuidor com preço customizado (price != cost_price)
    allItems = allItems.filter((p: any) => {
      const isDistribuidor = p.is_distribuidor === true;
      if (!isDistribuidor) return true; // Produtos próprios são considerados personalizados
      // Produtos de distribuidor: verificar se preço foi alterado
      const price = Number(p.price || 0);
      const costPrice = Number(p.cost_price || 0);
      return Math.abs(price - costPrice) > 0.01; // Diferença maior que 1 centavo
    });
  } else if (priceFilter === 'distribuidor') {
    // Preço do Distribuidor: produtos com preço original (não alterado)
    // - Apenas produtos de distribuidor onde price == cost_price
    allItems = allItems.filter((p: any) => {
      const isDistribuidor = p.is_distribuidor === true;
      if (!isDistribuidor) return false; // Produtos próprios não são do distribuidor
      // Produtos de distribuidor: verificar se preço NÃO foi alterado
      const price = Number(p.price || 0);
      const costPrice = Number(p.cost_price || 0);
      return Math.abs(price - costPrice) <= 0.01; // Diferença menor que 1 centavo
    });
  }

  // Se for cotista e statsOnly, calcular total real
  const totalReal = canAccessDistributorCatalog && statsOnly 
    ? (produtosBanca?.length || 0) + totalProdutosDistribuidor
    : allItems.length;

  return NextResponse.json({ 
    success: true, 
    items: allItems, 
    total: allItems.length,
    totalReal: totalReal, // Total real incluindo todos os produtos de distribuidores
    is_cotista: isCotista,
    has_catalog_access: canAccessDistributorCatalog,
    plan: entitlements.plan,
    requested_plan: entitlements.requestedPlan,
    subscription: entitlements.subscription,
    entitlements: {
      plan_type: entitlements.planType,
      product_limit: entitlements.productLimit,
      can_access_distributor_catalog: canAccessDistributorCatalog,
      paid_features_locked_until_payment: entitlements.paidFeaturesLockedUntilPayment,
      overdue_features_locked: entitlements.overdueFeaturesLocked,
      overdue_in_grace_period: entitlements.overdueInGracePeriod,
      overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
    },
    stats: {
      proprios: produtosBanca?.length || 0,
      distribuidores: statsOnly ? totalProdutosDistribuidor : produtosAdminCustomizados.length,
      distribuidoresTotal: totalProdutosDistribuidor // Total real de produtos de distribuidores
    },
    timestamp: new Date().toISOString()
  }, {
    headers: buildNoStoreHeaders({ isPrivate: true })
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  // Buscar banca_id do usuário
  const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

  if (!banca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  const entitlements = await resolveBancaPlanEntitlements(banca);
  if (entitlements.productLimit) {
    const { count, error: countError } = await supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("banca_id", banca.id)
      .is("distribuidor_id", null);

    if (countError) {
      console.error("[API/JORNALEIRO/PRODUCTS] Erro ao contar produtos para limite:", countError);
      return NextResponse.json({ success: false, error: "Não foi possível validar o limite do plano" }, { status: 500 });
    }

    const currentCount = count || 0;
    if (currentCount >= entitlements.productLimit) {
      if (entitlements.overdueFeaturesLocked && entitlements.subscription?.plan) {
        return NextResponse.json(
          {
            success: false,
            error: `Seu plano ${entitlements.subscription.plan.name} está com cobrança em aberto e os recursos avançados foram pausados após o período de carência.`,
            code: "PLAN_OVERDUE_SUSPENDED",
            limit: entitlements.productLimit,
            currentCount,
            plan: entitlements.plan,
            contracted_plan: entitlements.subscription.plan,
            overdue_grace_ends_at: entitlements.overdueGraceEndsAt,
            upgrade_url: "/jornaleiro/meu-plano",
          },
          { status: 403 }
        );
      }

      if (entitlements.paidFeaturesLockedUntilPayment && entitlements.requestedPlan) {
        return NextResponse.json(
          {
            success: false,
            error: `Seu upgrade para ${entitlements.requestedPlan.name} já foi iniciado. Assim que a primeira cobrança for paga, o novo limite será liberado.`,
            code: "PLAN_PENDING_PAYMENT",
            limit: entitlements.productLimit,
            currentCount,
            plan: entitlements.plan,
            requested_plan: entitlements.requestedPlan,
            upgrade_url: "/jornaleiro/meu-plano",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Seu plano ${entitlements.plan?.name || "atual"} permite até ${entitlements.productLimit} produtos. Faça upgrade para continuar cadastrando.`,
          code: "PLAN_PRODUCT_LIMIT_REACHED",
          limit: entitlements.productLimit,
          currentCount,
          plan: entitlements.plan,
          recommended_plan_type: getNextPlanType(entitlements.planType),
          upgrade_url: "/jornaleiro/meu-plano",
        },
        { status: 403 }
      );
    }
  }

  let body: any;
  try {
    body = await request.json();
    console.log('[API/Jornaleiro/Products] Body recebido:', JSON.stringify(body, null, 2));
  } catch (e) {
    console.error('[API/Jornaleiro/Products] Payload inválido:', e);
    return NextResponse.json({ success: false, error: "JSON inválido no corpo da requisição" }, { status: 400 });
  }
  
  // Campos básicos que existem na tabela products
  const novo: Record<string, any> = {
    banca_id: banca.id,
    category_id: body.category_id || null,
    name: body.name,
    description: body.description || "",
    images: Array.isArray(body.images) ? body.images : [],
    price: Number(body.price || 0),
    price_original: body.price_original != null ? Number(body.price_original) : null,
    discount_percent: body.discount_percent != null ? Number(body.discount_percent) : null,
    stock_qty: body.stock_qty != null ? Number(body.stock_qty) : 0,
    active: body.active ?? true,
  };

  console.log('[API/Jornaleiro/Products] Objeto a inserir:', JSON.stringify(novo, null, 2));
  
  const { data: created, error } = await supabaseAdmin
    .from('products')
    .insert(novo)
    .select()
    .single();

  if (error) {
    console.error('[API/Jornaleiro/Products] Erro ao criar produto:', error);
    console.error('[API/Jornaleiro/Products] Detalhes:', JSON.stringify(error, null, 2));
    return NextResponse.json({ success: false, error: error.message || 'Erro ao criar produto', details: error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
