import { resolveBancaLifecycle } from "@/lib/jornaleiro-banca-status";
import { resolveBancaPlanEntitlements } from "@/lib/plan-entitlements";
import { supabaseAdmin } from "@/lib/supabase";
import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";

export type TimelinePeriod = "7d" | "30d" | "90d" | "all";

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

function hasProductImage(product: any) {
  if (Array.isArray(product?.images) && product.images.some(Boolean)) return true;
  return false;
}

function hasOpeningHours(banca: any) {
  if (Array.isArray(banca?.hours) && banca.hours.some((day: any) => day?.open)) {
    return true;
  }

  if (banca?.opening_hours && typeof banca.opening_hours === "object") {
    return Object.values(banca.opening_hours).some(
      (value) => typeof value === "string" && value.trim().length > 0
    );
  }

  return false;
}

function buildAlert(
  id: string,
  tone: "warning" | "critical" | "info" | "success",
  title: string,
  description: string,
  href: string
) {
  return { id, tone, title, description, href };
}

function buildRecommendation(
  id: string,
  title: string,
  description: string,
  href: string,
  priority: number
) {
  return { id, title, description, href, priority };
}

async function ensureJornaleiro(userId: string) {
  const { actor, error } = await loadJornaleiroActor(userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }
}

export async function loadJornaleiroIntelligence(params: {
  userId: string;
  period?: string | null;
}) {
  await ensureJornaleiro(params.userId);

  const period = (params.period || "30d") as TimelinePeriod;
  const startDate = getStartDate(period);
  const banca = await loadActiveJornaleiroBancaRow({
    userId: params.userId,
    select:
      "id, user_id, name, active, approved, profile_image, cover_image, whatsapp, email, hours, opening_hours, tpu_url, is_cotista, cotista_id, updated_at, created_at",
  });

  if (!banca) {
    throw new Error("BANCA_NOT_FOUND");
  }

  const entitlements = await resolveBancaPlanEntitlements(banca);
  const bancaLifecycle = resolveBancaLifecycle(banca);
  const [
    ownProductsResponse,
    distributorProductsResponse,
    ordersResponse,
    ordersTodayResponse,
    openOrdersResponse,
    campaignsResponse,
    analyticsResponse,
  ] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select("id, name, price, stock_qty, active, images, updated_at, created_at")
      .eq("banca_id", banca.id),
    entitlements.canAccessDistributorCatalog
      ? supabaseAdmin
          .from("products")
          .select("id", { count: "exact", head: true })
          .not("distribuidor_id", "is", null)
          .eq("active", true)
      : Promise.resolve({ count: 0, error: null }),
    supabaseAdmin
      .from("orders")
      .select("id, status, total, created_at")
      .eq("banca_id", banca.id)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("banca_id", banca.id)
      .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("banca_id", banca.id)
      .not("status", "in", '("entregue","cancelado")'),
    supabaseAdmin
      .from("campaigns")
      .select("id, status, impressions, clicks, end_date, product_id, created_at")
      .eq("banca_id", banca.id)
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("analytics_events")
      .select("product_id, event_type, session_id, metadata, created_at")
      .eq("banca_id", banca.id)
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: false }),
  ]);

  if (ownProductsResponse.error) throw ownProductsResponse.error;
  if ((distributorProductsResponse as any).error) throw (distributorProductsResponse as any).error;
  if (ordersResponse.error) throw ordersResponse.error;
  if ((ordersTodayResponse as any).error) throw (ordersTodayResponse as any).error;
  if ((openOrdersResponse as any).error) throw (openOrdersResponse as any).error;
  if (campaignsResponse.error) throw campaignsResponse.error;
  if (analyticsResponse.error) throw analyticsResponse.error;

  const ownProducts = ownProductsResponse.data || [];
  const orders = ordersResponse.data || [];
  const campaigns = campaignsResponse.data || [];
  const analyticsEvents = analyticsResponse.data || [];

  const activeOwnProducts = ownProducts.filter((item) => item.active !== false);
  const productsWithoutImage = activeOwnProducts.filter((item) => !hasProductImage(item)).length;
  const outOfStockProducts = activeOwnProducts.filter((item) => Number(item.stock_qty || 0) <= 0).length;
  const ownProductsUpdatedRecently = activeOwnProducts.filter((item) => {
    if (!item.updated_at) return false;
    const updatedAt = new Date(item.updated_at);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return updatedAt >= cutoff;
  }).length;

  const gmvPeriod = orders.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const averageTicket = orders.length > 0 ? gmvPeriod / orders.length : 0;
  const ordersToday = Number((ordersTodayResponse as any).count || 0);
  const openOrders = Number((openOrdersResponse as any).count || 0);

  const orderStatusCounts = new Map<string, number>();
  for (const order of orders) {
    const key = String(order.status || "sem_status").toLowerCase();
    orderStatusCounts.set(key, (orderStatusCounts.get(key) || 0) + 1);
  }

  const analyticsStats = {
    pageViews: analyticsEvents.filter((event) => event.event_type === "page_view").length,
    productViews: analyticsEvents.filter((event) => event.event_type === "product_view").length,
    addToCart: analyticsEvents.filter((event) => event.event_type === "add_to_cart").length,
    whatsappClicks: analyticsEvents.filter((event) => event.event_type === "whatsapp_click").length,
    checkoutStarts: analyticsEvents.filter((event) => event.event_type === "checkout_start").length,
    checkoutCompletes: analyticsEvents.filter((event) => event.event_type === "checkout_complete").length,
    searches: analyticsEvents.filter((event) => event.event_type === "search").length,
    uniqueSessions: new Set(analyticsEvents.map((event) => event.session_id).filter(Boolean)).size,
  };

  const topSearchTerms = new Map<string, number>();
  const topProductsMap = new Map<
    string,
    { views: number; clicks: number; cart: number; whatsapp: number }
  >();

  for (const event of analyticsEvents) {
    if (event.event_type === "search") {
      const searchTerm =
        event.metadata?.search_term?.toString().trim().toLowerCase() ||
        event.metadata?.term?.toString().trim().toLowerCase() ||
        "";

      if (searchTerm) {
        topSearchTerms.set(searchTerm, (topSearchTerms.get(searchTerm) || 0) + 1);
      }
    }

    if (!event.product_id) continue;

    const current = topProductsMap.get(event.product_id) || {
      views: 0,
      clicks: 0,
      cart: 0,
      whatsapp: 0,
    };

    if (event.event_type === "product_view") current.views += 1;
    if (event.event_type === "product_click") current.clicks += 1;
    if (event.event_type === "add_to_cart") current.cart += 1;
    if (event.event_type === "whatsapp_click") current.whatsapp += 1;
    topProductsMap.set(event.product_id, current);
  }

  const productIds = Array.from(topProductsMap.keys());
  let productMap = new Map<string, any>(ownProducts.map((product) => [product.id, product]));

  if (productIds.length > 0) {
    const missingProductIds = productIds.filter((id) => !productMap.has(id));

    if (missingProductIds.length > 0) {
      const { data: eventProducts } = await supabaseAdmin
        .from("products")
        .select("id, name, price")
        .in("id", missingProductIds);

      productMap = new Map([
        ...Array.from(productMap.entries()),
        ...((eventProducts || []).map((product) => [product.id, product]) as Array<[string, any]>),
      ]);
    }
  }

  const topProducts = Array.from(topProductsMap.entries())
    .map(([productId, values]) => ({
      id: productId,
      name: productMap.get(productId)?.name || "Produto sem nome",
      views: values.views,
      clicks: values.clicks,
      cart: values.cart,
      whatsapp: values.whatsapp,
      total: values.views + values.clicks + values.cart + values.whatsapp,
    }))
    .sort((left, right) => right.total - left.total)
    .slice(0, 5);

  const topSearches = Array.from(topSearchTerms.entries())
    .map(([term, count]) => ({ term, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 8);

  const hasBranding = Boolean(banca.profile_image || banca.cover_image);
  const hasContactChannel = Boolean(banca.whatsapp || banca.email);
  const openingHoursConfigured = hasOpeningHours(banca);
  const hasOwnProducts = activeOwnProducts.length > 0;
  const checklistCompleted = [
    hasBranding,
    openingHoursConfigured,
    hasContactChannel,
    hasOwnProducts,
  ].filter(Boolean).length;
  const isPublished = bancaLifecycle.isPublished;
  const activeCampaigns = campaigns.filter((item) =>
    ["active", "approved"].includes(String(item.status || "").toLowerCase())
  ).length;
  const pendingCampaigns = campaigns.filter(
    (item) => String(item.status || "").toLowerCase() === "pending"
  ).length;

  const catalogCoverageRate =
    activeOwnProducts.length > 0
      ? Math.max(
          0,
          Math.round(
            ((activeOwnProducts.length - productsWithoutImage) / activeOwnProducts.length) * 100
          )
        )
      : 0;

  const alerts = [
    bancaLifecycle.code === "draft"
      ? buildAlert(
          "banca-draft",
          "warning",
          "Sua banca ainda esta em preparacao",
          "O cadastro ja existe, mas ainda esta em configuracao inicial e sem liberacao para operar no marketplace.",
          "/jornaleiro/banca-v2"
        )
      : null,
    bancaLifecycle.code === "pending_approval"
      ? buildAlert(
          "banca-pending-approval",
          "warning",
          "Sua banca aguarda aprovacao",
          "A banca ja foi criada e pode ser configurada no painel, mas ainda nao foi liberada para publicacao.",
          "/jornaleiro/banca-v2"
        )
      : null,
    bancaLifecycle.code === "paused"
      ? buildAlert(
          "banca-paused",
          "critical",
          "Sua banca esta pausada",
          "A operacao foi interrompida no marketplace. Revise o status operacional antes de investir em catalogo e campanhas.",
          "/jornaleiro/banca-v2"
        )
      : null,
    !hasBranding
      ? buildAlert(
          "missing-branding",
          "warning",
          "Falta identidade visual na banca",
          "Adicionar logo ou capa melhora confianca e aumenta a qualidade da vitrine publica.",
          "/jornaleiro/banca-v2"
        )
      : null,
    !openingHoursConfigured
      ? buildAlert(
          "missing-hours",
          "warning",
          "Horario de atendimento ainda nao foi configurado",
          "Sem horario claro, o cliente perde referencia e o atendimento fica menos previsivel.",
          "/jornaleiro/banca-v2"
        )
      : null,
    !hasOwnProducts
      ? buildAlert(
          "missing-products",
          "critical",
          "Sua banca ainda nao tem produtos proprios ativos",
          "Sem catalogo proprio, a banca nao transforma a operacao em oferta vendavel dentro da plataforma.",
          "/jornaleiro/produtos/create"
        )
      : null,
    openOrders > 0
      ? buildAlert(
          "open-orders",
          openOrders >= 5 ? "critical" : "info",
          `${openOrders} pedidos aguardando andamento`,
          "Priorize pedidos pendentes para manter a experiencia do cliente e evitar gargalo operacional.",
          "/jornaleiro/pedidos"
        )
      : null,
    productsWithoutImage > 0
      ? buildAlert(
          "products-without-image",
          "info",
          `${productsWithoutImage} produtos sem imagem`,
          "Produto sem imagem derruba qualidade de vitrine e reduz chance de clique e venda.",
          "/jornaleiro/produtos"
        )
      : null,
    outOfStockProducts > 0
      ? buildAlert(
          "out-of-stock",
          "info",
          `${outOfStockProducts} produtos sem estoque`,
          "Itens sem estoque ocupam espaco no catalogo sem gerar conversao. Vale revisar rapidamente.",
          "/jornaleiro/produtos"
        )
      : null,
    entitlements.subscription?.status === "pending"
      ? buildAlert(
          "pending-plan",
          "info",
          "Seu novo plano aguarda a primeira cobranca",
          "O upgrade ja foi contratado, mas os novos recursos so liberam depois da confirmacao do pagamento.",
          "/jornaleiro/meu-plano"
        )
      : null,
    entitlements.subscription?.status === "overdue"
      ? buildAlert(
          "overdue-plan",
          entitlements.overdueFeaturesLocked ? "critical" : "warning",
          entitlements.overdueFeaturesLocked
            ? "Recursos pagos estao pausados"
            : "Existe cobranca em aberto do plano",
          entitlements.overdueFeaturesLocked
            ? "Regularize a assinatura para recuperar os recursos pagos da banca."
            : "Ainda existe carencia operacional, mas vale regularizar antes de perder recursos do plano.",
          "/jornaleiro/meu-plano"
        )
      : null,
    !entitlements.isLegacyCotistaLinked && !banca.tpu_url
      ? buildAlert(
          "missing-tpu",
          "warning",
          "Documento operacional da banca ainda nao foi enviado",
          "Sem o documento TPU, a ativacao final da banca pode ficar travada nas etapas de publicacao.",
          "/jornaleiro/banca-v2"
        )
      : null,
  ].filter(Boolean);

  const recommendations = [
    !hasOwnProducts
      ? buildRecommendation(
          "first-product",
          "Cadastre o primeiro produto",
          "Esse e o passo que transforma a banca em oferta vendavel e habilita a vitrine.",
          "/jornaleiro/produtos/create",
          1
        )
      : null,
    !isPublished
      ? buildRecommendation(
          "publish-banca",
          "Feche o cadastro e publique a banca",
          "Com dados completos e aprovacao, a banca passa a aparecer para o cliente final.",
          "/jornaleiro/banca-v2",
          2
        )
      : null,
    openOrders > 0
      ? buildRecommendation(
          "handle-orders",
          "Atenda os pedidos pendentes",
          "Pedidos parados derrubam experiencia e atrasam a operacao do dia.",
          "/jornaleiro/pedidos",
          3
        )
      : null,
    productsWithoutImage > 0
      ? buildRecommendation(
          "improve-catalog",
          "Melhore a qualidade do catalogo",
          "Adicione imagem aos produtos para elevar conversao e confianca visual.",
          "/jornaleiro/produtos",
          4
        )
      : null,
    activeOwnProducts.length >= 5 && activeCampaigns === 0
      ? buildRecommendation(
          "create-campaign",
          "Experimente sua primeira campanha",
          "Com catalogo minimamente estruturado, campanhas podem aumentar descoberta dos melhores itens.",
          "/jornaleiro/campanhas",
          5
        )
      : null,
    entitlements.canAccessDistributorCatalog
      ? buildRecommendation(
          "partner-catalog",
          "Revisite o catalogo parceiro",
          "A rede parceira pode complementar sua oferta e aprofundar o mix da banca.",
          "/jornaleiro/catalogo-distribuidor/gerenciar",
          6
        )
      : null,
  ]
    .filter(
      (
        item
      ): item is { id: string; title: string; description: string; href: string; priority: number } =>
        Boolean(item)
    )
    .sort((left, right) => left.priority - right.priority)
    .slice(0, 4);

  return {
    success: true,
    period,
    generatedAt: new Date().toISOString(),
    banca: {
      id: banca.id,
      name: banca.name,
      active: banca.active,
      approved: banca.approved,
      lifecycle: bancaLifecycle,
      checklist_completed: checklistCompleted,
      checklist_total: 4,
      is_published: isPublished,
      has_branding: hasBranding,
      has_contact_channel: hasContactChannel,
      has_opening_hours: openingHoursConfigured,
      has_products: hasOwnProducts,
    },
    summary: {
      orders_period: orders.length,
      orders_today: ordersToday,
      open_orders: openOrders,
      revenue_period: gmvPeriod,
      average_ticket: averageTicket,
      active_own_products: activeOwnProducts.length,
      partner_catalog_products: Number((distributorProductsResponse as any).count || 0),
      products_without_image: productsWithoutImage,
      out_of_stock_products: outOfStockProducts,
      recent_catalog_updates: ownProductsUpdatedRecently,
      active_campaigns: activeCampaigns,
      pending_campaigns: pendingCampaigns,
      page_views: analyticsStats.pageViews,
      product_views: analyticsStats.productViews,
      add_to_cart: analyticsStats.addToCart,
      whatsapp_clicks: analyticsStats.whatsappClicks,
      checkout_starts: analyticsStats.checkoutStarts,
      checkout_completes: analyticsStats.checkoutCompletes,
      searches: analyticsStats.searches,
      unique_sessions: analyticsStats.uniqueSessions,
      catalog_coverage_rate: catalogCoverageRate,
    },
    plan: {
      name: entitlements.plan?.name || "Free",
      type: entitlements.planType,
      product_limit: entitlements.productLimit,
      can_access_distributor_catalog: entitlements.canAccessDistributorCatalog,
      can_access_partner_directory: entitlements.canAccessPartnerDirectory,
      subscription_status: entitlements.subscription?.status || "active",
    },
    orderStatusDistribution: Array.from(orderStatusCounts.entries())
      .map(([status, count]) => ({ status, count }))
      .sort((left, right) => right.count - left.count),
    funnel: [
      { stage: "Visitas", value: analyticsStats.pageViews },
      { stage: "Produtos vistos", value: analyticsStats.productViews },
      { stage: "Carrinho", value: analyticsStats.addToCart },
      { stage: "WhatsApp", value: analyticsStats.whatsappClicks },
      { stage: "Checkout", value: analyticsStats.checkoutStarts },
      { stage: "Pedidos", value: analyticsStats.checkoutCompletes },
    ],
    topSearches,
    topProducts,
    alerts,
    recommendations,
  };
}
