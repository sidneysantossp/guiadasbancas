import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

type ResolvedPlanType = "free" | "start" | "premium";

type SubscriptionRecord = {
  id: string;
  banca_id: string | null;
  status: string | null;
  created_at: string | null;
  plan: {
    id: string;
    name: string;
    type: string | null;
    price: number | null;
    billing_cycle: string | null;
  } | null;
};

type PaymentRecord = {
  id: string;
  subscription_id: string | null;
  amount: number | null;
  status: string | null;
  due_date?: string | null;
  created_at: string | null;
  paid_at: string | null;
};

type AlertTone = "critical" | "warning" | "info";

export const dynamic = "force-dynamic";

function getStartDate(period: string) {
  const startDate = new Date();

  switch (period) {
    case "7d":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(startDate.getDate() - 90);
      break;
    case "all":
      return new Date("2020-01-01T00:00:00.000Z");
    default:
      startDate.setDate(startDate.getDate() - 30);
      break;
  }

  return startDate;
}

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

function normalizePlanType(planType?: string | null): ResolvedPlanType {
  const normalized = (planType || "free").toLowerCase();
  if (normalized === "start" || normalized === "premium" || normalized === "free") {
    return normalized;
  }

  return "free";
}

function monthlyValue(price?: number | null, billingCycle?: string | null) {
  const base = Number(price || 0);
  if (!Number.isFinite(base) || base <= 0) return 0;

  switch ((billingCycle || "monthly").toLowerCase()) {
    case "quarterly":
      return base / 3;
    case "semiannual":
      return base / 6;
    case "annual":
      return base / 12;
    default:
      return base;
  }
}

function hasProductImage(product: any) {
  if (typeof product?.image === "string" && product.image.trim()) {
    return true;
  }

  if (Array.isArray(product?.images)) {
    return product.images.some((entry: any) => typeof entry === "string" && entry.trim());
  }

  if (typeof product?.images === "string") {
    const trimmed = product.images.trim();
    if (!trimmed || trimmed === "[]" || trimmed === "{}") {
      return false;
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.some((entry: any) => typeof entry === "string" && entry.trim());
      }
    } catch {
      return true;
    }

    return true;
  }

  return false;
}

function normalizeStatusLabel(value?: string | null) {
  const normalized = (value || "sem_status").toLowerCase();
  const map: Record<string, string> = {
    pending: "Aguardando",
    trial: "Degustacao",
    active: "Ativa",
    overdue: "Em atraso",
    cancelled: "Cancelada",
    expired: "Expirada",
    entregue: "Entregues",
    cancelado: "Cancelados",
    recebido: "Recebidos",
    preparando: "Preparando",
    a_entregar: "A entregar",
    em_rota: "Em rota",
  };

  return map[normalized] || normalized.replace(/_/g, " ");
}

function buildAlert(id: string, title: string, description: string, href: string, tone: AlertTone) {
  return { id, title, description, href, tone };
}

export async function GET(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d";
    const startDate = getStartDate(period);

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const staleSyncCutoff = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();

    const [
      userProfilesResponse,
      bancasResponse,
      distribuidoresResponse,
      productsResponse,
      ordersResponse,
      openOrdersResponse,
      ordersTodayResponse,
      analyticsResponse,
      categoriesResponse,
      distributorCategoriesResponse,
      currentSubscriptionsResponse,
      latestPaymentsResponse,
      periodPaymentsResponse,
      campaignsResponse,
    ] = await Promise.all([
      supabaseAdmin.from("user_profiles").select("id, role, banca_id, created_at"),
      supabaseAdmin.from("bancas").select("id, name, active, approved, created_at"),
      supabaseAdmin
        .from("distribuidores")
        .select("id, nome, email, ativo, ultima_sincronizacao, total_produtos"),
      supabaseAdmin
        .from("products")
        .select("id, name, active, banca_id, distribuidor_id, image, images, created_at"),
      supabaseAdmin
        .from("orders")
        .select("id, total, status, created_at, banca_id")
        .gte("created_at", startDate.toISOString()),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .not("status", "in", '("entregue","cancelado")'),
      supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayStart),
      supabaseAdmin
        .from("analytics_events")
        .select("event_type, session_id, product_id, banca_id, metadata, created_at")
        .gte("created_at", startDate.toISOString()),
      supabaseAdmin.from("categories").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("distribuidor_categories").select("*", { count: "exact", head: true }),
      supabaseAdmin
        .from("subscriptions")
        .select(`
          id,
          banca_id,
          status,
          created_at,
          plan:plans (
            id,
            name,
            type,
            price,
            billing_cycle
          )
        `)
        .in("status", ["active", "trial", "pending", "overdue"])
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("payments")
        .select("id, subscription_id, amount, status, due_date, created_at, paid_at")
        .order("created_at", { ascending: false }),
      supabaseAdmin
        .from("payments")
        .select("id, subscription_id, amount, status, due_date, created_at, paid_at")
        .gte("created_at", startDate.toISOString()),
      supabaseAdmin
        .from("campaigns")
        .select("id, status, created_at, start_date, end_date"),
    ]);

    const responses = [
      userProfilesResponse,
      bancasResponse,
      distribuidoresResponse,
      productsResponse,
      ordersResponse,
      openOrdersResponse,
      ordersTodayResponse,
      analyticsResponse,
      categoriesResponse,
      distributorCategoriesResponse,
      currentSubscriptionsResponse,
      latestPaymentsResponse,
      periodPaymentsResponse,
      campaignsResponse,
    ];

    for (const response of responses) {
      if (response.error) {
        throw response.error;
      }
    }

    const userProfiles = (userProfilesResponse.data || []) as any[];
    const bancas = (bancasResponse.data || []) as any[];
    const distribuidores = (distribuidoresResponse.data || []) as any[];
    const products = (productsResponse.data || []) as any[];
    const orders = (ordersResponse.data || []) as any[];
    const analyticsEvents = (analyticsResponse.data || []) as any[];
    const campaigns = (campaignsResponse.data || []) as any[];

    const currentSubscriptionsMap = new Map<string, SubscriptionRecord>();
    for (const item of ((currentSubscriptionsResponse.data as any[]) || [])) {
      if (!item?.banca_id || currentSubscriptionsMap.has(item.banca_id)) {
        continue;
      }

      currentSubscriptionsMap.set(item.banca_id, {
        ...item,
        plan: normalizeRelation(item.plan),
      });
    }

    const currentSubscriptions = Array.from(currentSubscriptionsMap.values());
    const latestPaymentBySubscription = new Map<string, PaymentRecord>();
    for (const payment of ((latestPaymentsResponse.data || []) as PaymentRecord[])) {
      if (!payment.subscription_id || latestPaymentBySubscription.has(payment.subscription_id)) {
        continue;
      }

      latestPaymentBySubscription.set(payment.subscription_id, payment);
    }

    const totalUsers = userProfiles.length;
    const totalAdmins = userProfiles.filter((item) => item.role === "admin").length;
    const totalJornaleiros = userProfiles.filter((item) => item.role === "jornaleiro" || item.role === "seller").length;
    const totalClientes = userProfiles.filter((item) => !["admin", "jornaleiro", "seller"].includes(item.role || "")).length;

    const totalBancas = bancas.length;
    const activeBancas = bancas.filter((item) => item.active === true).length;
    const approvedBancas = bancas.filter((item) => item.approved === true).length;
    const pendingBancas = bancas.filter((item) => item.approved !== true).length;

    const totalDistribuidores = distribuidores.length;
    const activeDistribuidores = distribuidores.filter((item) => item.ativo !== false).length;
    const staleDistribuidores = distribuidores.filter(
      (item) =>
        item.ativo !== false &&
        (!item.ultima_sincronizacao || item.ultima_sincronizacao < staleSyncCutoff)
    );

    const totalProducts = products.length;
    const activeProducts = products.filter((item) => item.active !== false).length;
    const distributorProducts = products.filter((item) => Boolean(item.distribuidor_id)).length;
    const bancaProducts = products.filter((item) => Boolean(item.banca_id) && !item.distribuidor_id).length;
    const productsWithoutImage = products.filter((item) => !hasProductImage(item)).length;

    const gmvPeriod = orders.reduce((sum, item) => sum + Number(item.total || 0), 0);
    const ordersToday = Number(ordersTodayResponse.count || 0);
    const openOrders = Number(openOrdersResponse.count || 0);
    const averageTicket = orders.length > 0 ? gmvPeriod / orders.length : 0;

    const orderStatusMap = new Map<string, number>();
    const topBancasMap = new Map<string, { count: number; revenue: number }>();
    for (const order of orders) {
      const status = (order.status || "sem_status").toLowerCase();
      orderStatusMap.set(status, (orderStatusMap.get(status) || 0) + 1);

      if (order.banca_id) {
        const current = topBancasMap.get(order.banca_id) || { count: 0, revenue: 0 };
        current.count += 1;
        current.revenue += Number(order.total || 0);
        topBancasMap.set(order.banca_id, current);
      }
    }

    const analyticsStats = {
      pageViews: analyticsEvents.filter((event) => event.event_type === "page_view").length,
      productViews: analyticsEvents.filter((event) => event.event_type === "product_view").length,
      addToCart: analyticsEvents.filter((event) => event.event_type === "add_to_cart").length,
      checkoutStarts: analyticsEvents.filter((event) => event.event_type === "checkout_start").length,
      checkoutCompletes: analyticsEvents.filter((event) => event.event_type === "checkout_complete").length,
      searches: analyticsEvents.filter((event) => event.event_type === "search").length,
      uniqueSessions: new Set(analyticsEvents.map((event) => event.session_id).filter(Boolean)).size,
    };

    const topSearchTerms = new Map<string, number>();
    const topProductsMap = new Map<
      string,
      { views: number; clicks: number; cart: number; bancaId?: string | null }
    >();

    for (const event of analyticsEvents) {
      if (event.event_type === "search") {
        const term = event.metadata?.search_term?.toString().trim().toLowerCase();
        if (term) {
          topSearchTerms.set(term, (topSearchTerms.get(term) || 0) + 1);
        }
      }

      if (!event.product_id) continue;

      const current = topProductsMap.get(event.product_id) || {
        views: 0,
        clicks: 0,
        cart: 0,
        bancaId: event.banca_id || null,
      };

      if (event.event_type === "product_view") current.views += 1;
      if (event.event_type === "product_click") current.clicks += 1;
      if (event.event_type === "add_to_cart") current.cart += 1;
      if (!current.bancaId && event.banca_id) current.bancaId = event.banca_id;

      topProductsMap.set(event.product_id, current);
    }

    const planCounts = { free: 0, start: 0, premium: 0 };
    const subscriptionStatusCounts = { active: 0, trial: 0, pending: 0, overdue: 0 };
    let activePaidBancas = 0;
    let pendingPaidBancas = 0;
    let overduePaidBancas = 0;
    let trialPaidBancas = 0;
    let mrrActive = 0;
    let openRevenue = 0;

    for (const subscription of currentSubscriptions) {
      const planType = normalizePlanType(subscription.plan?.type);
      const monthlyPlan = monthlyValue(subscription.plan?.price, subscription.plan?.billing_cycle);
      const status = (subscription.status || "active").toLowerCase() as keyof typeof subscriptionStatusCounts;

      planCounts[planType] += 1;
      if (status in subscriptionStatusCounts) {
        subscriptionStatusCounts[status] += 1;
      }

      const isPaidPlan = planType !== "free" && Number(subscription.plan?.price || 0) > 0;

      if (isPaidPlan && (status === "active" || status === "trial")) {
        mrrActive += monthlyPlan;
      }
      if (isPaidPlan && status === "active") {
        activePaidBancas += 1;
      }
      if (isPaidPlan && status === "trial") {
        trialPaidBancas += 1;
      }
      if (isPaidPlan && status === "pending") {
        pendingPaidBancas += 1;
      }
      if (isPaidPlan && status === "overdue") {
        overduePaidBancas += 1;
      }

      const latestPayment = latestPaymentBySubscription.get(subscription.id);
      if (
        latestPayment &&
        (latestPayment.status === "pending" || latestPayment.status === "overdue")
      ) {
        openRevenue += Number(latestPayment.amount || 0);
      }
    }

    const paidBancas = planCounts.start + planCounts.premium;
    const paidConversionRate = totalBancas > 0 ? (paidBancas / totalBancas) * 100 : 0;
    const periodReceivedRevenue = ((periodPaymentsResponse.data || []) as PaymentRecord[]).reduce((sum, payment) => {
      if (payment.status === "confirmed" || payment.status === "received") {
        return sum + Number(payment.amount || 0);
      }
      return sum;
    }, 0);

    const activeCampaigns = campaigns.filter((item) => ["active", "approved"].includes((item.status || "").toLowerCase())).length;

    const bancaMap = new Map(bancas.map((item) => [item.id, item]));
    const productMap = new Map(products.map((item) => [item.id, item]));

    const topBancas = Array.from(topBancasMap.entries())
      .map(([bancaId, value]) => ({
        id: bancaId,
        name: bancaMap.get(bancaId)?.name || "Banca sem nome",
        orders: value.count,
        revenue: value.revenue,
      }))
      .sort((left, right) => right.revenue - left.revenue)
      .slice(0, 5);

    const topProducts = Array.from(topProductsMap.entries())
      .map(([productId, value]) => ({
        id: productId,
        name: productMap.get(productId)?.name || "Produto sem nome",
        banca_name: value.bancaId ? bancaMap.get(value.bancaId)?.name || "Banca sem nome" : "Marketplace",
        views: value.views,
        clicks: value.clicks,
        cart: value.cart,
        total: value.views + value.clicks + value.cart,
      }))
      .sort((left, right) => right.total - left.total)
      .slice(0, 5);

    const topSearches = Array.from(topSearchTerms.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 8);

    const distributorHealth = distribuidores
      .map((item) => {
        const stale = !item.ultima_sincronizacao || item.ultima_sincronizacao < staleSyncCutoff;
        return {
          id: item.id,
          name: item.nome,
          products: Number(item.total_produtos || 0),
          last_sync: item.ultima_sincronizacao,
          status: item.ativo === false ? "inactive" : stale ? "stale" : "healthy",
        };
      })
      .sort((left, right) => {
        const priority = { stale: 0, inactive: 1, healthy: 2 };
        return priority[left.status as keyof typeof priority] - priority[right.status as keyof typeof priority];
      })
      .slice(0, 6);

    const cartToCheckoutRate =
      analyticsStats.addToCart > 0
        ? (analyticsStats.checkoutCompletes / analyticsStats.addToCart) * 100
        : 0;

    const searchToCheckoutRate =
      analyticsStats.searches > 0
        ? (analyticsStats.checkoutCompletes / analyticsStats.searches) * 100
        : 0;

    const alerts = [
      pendingBancas > 0
        ? buildAlert(
            "pending-bancas",
            `${pendingBancas} bancas aguardando tratamento`,
            "Existem bancas ainda nao aprovadas ou em rascunho, o que trava a expansao da rede.",
            "/admin/gestao/bancas/cadastros",
            "warning"
          )
        : null,
      overduePaidBancas > 0
        ? buildAlert(
            "overdue-subscriptions",
            `${overduePaidBancas} assinaturas em atraso`,
            "Receita em risco. Vale agir em cobranca e retencao para evitar downgrade operacional.",
            "/admin/assinaturas",
            "critical"
          )
        : null,
      staleDistribuidores.length > 0
        ? buildAlert(
            "stale-distributors",
            `${staleDistribuidores.length} distribuidores com sync atrasado`,
            "A oferta pode ficar desatualizada e afetar o painel do distribuidor e o catalogo do jornaleiro.",
            "/admin/configuracoes/sync-mercos",
            "warning"
          )
        : null,
      productsWithoutImage > 0
        ? buildAlert(
            "products-without-image",
            `${productsWithoutImage} produtos sem imagem`,
            "Produtos sem imagem derrubam a qualidade da vitrine do site e a conversao.",
            "/admin/produtos/upload-imagens",
            "info"
          )
        : null,
      searchToCheckoutRate < 2 && analyticsStats.searches > 0
        ? buildAlert(
            "search-demand-gap",
            "Busca com baixa conversao",
            "Ha demanda navegando e pesquisando, mas pouca conversao em pedido. Vale revisar oferta, preco e vitrines.",
            "/admin/analytics",
            "info"
          )
        : null,
    ].filter(Boolean);

    return NextResponse.json({
      success: true,
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        total_users: totalUsers,
        total_clientes: totalClientes,
        total_jornaleiros: totalJornaleiros,
        total_admins: totalAdmins,
        total_bancas: totalBancas,
        active_bancas: activeBancas,
        approved_bancas: approvedBancas,
        pending_bancas: pendingBancas,
        total_distribuidores: totalDistribuidores,
        active_distribuidores: activeDistribuidores,
        stale_distribuidores: staleDistribuidores.length,
        total_products: totalProducts,
        active_products: activeProducts,
        banca_products: bancaProducts,
        distributor_products: distributorProducts,
        products_without_image: productsWithoutImage,
        total_categories: Number(categoriesResponse.count || 0),
        total_distributor_categories: Number(distributorCategoriesResponse.count || 0),
        total_orders_period: orders.length,
        orders_today: ordersToday,
        open_orders: openOrders,
        gmv_period: gmvPeriod,
        average_ticket: averageTicket,
        active_campaigns: activeCampaigns,
        mrr_active: mrrActive,
        open_revenue: openRevenue,
        period_received_revenue: periodReceivedRevenue,
        paid_bancas: paidBancas,
        paid_conversion_rate: paidConversionRate,
        active_paid_bancas: activePaidBancas,
        pending_paid_bancas: pendingPaidBancas,
        overdue_paid_bancas: overduePaidBancas,
        trial_paid_bancas: trialPaidBancas,
        page_views: analyticsStats.pageViews,
        product_views: analyticsStats.productViews,
        add_to_cart: analyticsStats.addToCart,
        checkout_starts: analyticsStats.checkoutStarts,
        checkout_completes: analyticsStats.checkoutCompletes,
        searches: analyticsStats.searches,
        unique_sessions: analyticsStats.uniqueSessions,
        cart_to_checkout_rate: cartToCheckoutRate,
        search_to_checkout_rate: searchToCheckoutRate,
      },
      actorDistribution: [
        { name: "Clientes", value: totalClientes, color: "#f97316" },
        { name: "Jornaleiros", value: totalJornaleiros, color: "#2563eb" },
        { name: "Bancas", value: totalBancas, color: "#16a34a" },
        { name: "Distribuidores", value: totalDistribuidores, color: "#8b5cf6" },
      ],
      planDistribution: [
        { name: "Free", value: planCounts.free, color: "#16a34a" },
        { name: "Start", value: planCounts.start, color: "#2563eb" },
        { name: "Premium", value: planCounts.premium, color: "#7c3aed" },
      ],
      orderStatusDistribution: Array.from(orderStatusMap.entries())
        .map(([status, count]) => ({
          key: status,
          name: normalizeStatusLabel(status),
          value: count,
        }))
        .sort((left, right) => right.value - left.value),
      funnel: [
        { stage: "Sessoes", value: analyticsStats.uniqueSessions },
        { stage: "Buscas", value: analyticsStats.searches },
        { stage: "Produtos vistos", value: analyticsStats.productViews },
        { stage: "Carrinho", value: analyticsStats.addToCart },
        { stage: "Checkout", value: analyticsStats.checkoutStarts },
        { stage: "Pedidos", value: analyticsStats.checkoutCompletes },
      ],
      topSearches,
      topBancas,
      topProducts,
      distributorHealth,
      alerts,
    });
  } catch (error: any) {
    console.error("[API/ADMIN/INTELIGENCIA] Erro:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao carregar inteligencia" },
      { status: 500 }
    );
  }
}
