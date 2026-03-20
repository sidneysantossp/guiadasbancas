import { supabaseAdmin } from "@/lib/supabase";

type RawOrder = {
  id: string;
  total?: number | null;
  status?: string | null;
  created_at: string;
  updated_at?: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  customer_address?: string | null;
  payment_method?: string | null;
  notes?: string | null;
  banca_id?: string | null;
  bancas?: {
    id?: string | null;
    name?: string | null;
    address?: string | null;
    whatsapp?: string | null;
  } | null;
  items?: unknown;
};

type ParsedOrderItem = {
  id?: string | null;
  product_id?: string | null;
  product_name?: string | null;
  product_image?: string | null;
  quantity?: number | null;
  unit_price?: number | null;
  total_price?: number | null;
};

function parseOrderItems(rawItems: unknown): ParsedOrderItem[] {
  if (!rawItems) return [];

  if (typeof rawItems === "string") {
    try {
      const parsed = JSON.parse(rawItems);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(rawItems) ? rawItems : [];
}

function buildProductIdSet(productIds: string[]) {
  return new Set(productIds);
}

function orderHasDistribuidorProduct(order: RawOrder, productIdSet: Set<string>) {
  const items = parseOrderItems(order.items);
  return items.some((item) => {
    const itemId = item?.id || null;
    const productId = item?.product_id || null;
    return (itemId && productIdSet.has(itemId)) || (productId && productIdSet.has(productId));
  });
}

function formatRelativeDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays < 7) return `${diffDays}d atrás`;

  return date.toLocaleDateString("pt-BR");
}

const PRODUCT_ID_BATCH_SIZE = 500;

export async function getDistribuidorProductIds(distribuidorId: string) {
  const productIds: string[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("distribuidor_id", distribuidorId)
      .order("id", { ascending: true })
      .range(offset, offset + PRODUCT_ID_BATCH_SIZE - 1);

    if (error) {
      throw error;
    }

    const batch = (data || []).map((product) => product.id);
    productIds.push(...batch);

    hasMore = batch.length === PRODUCT_ID_BATCH_SIZE;
    offset += PRODUCT_ID_BATCH_SIZE;
  }

  return productIds;
}

export async function getDistribuidorRecentOrders(params: {
  distribuidorId: string;
  limit: number;
}) {
  const productIds = await getDistribuidorProductIds(params.distribuidorId);
  if (productIds.length === 0) {
    return [];
  }

  const productIdSet = buildProductIdSet(productIds);
  const batchSize = Math.max(params.limit * 3, 50);
  const filteredOrders: RawOrder[] = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore && filteredOrders.length < params.limit) {
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*, bancas(name)")
      .order("created_at", { ascending: false })
      .range(offset, offset + batchSize - 1);

    if (error) {
      throw error;
    }

    const batch = (orders || []) as RawOrder[];
    if (batch.length === 0) {
      break;
    }

    for (const order of batch) {
      if (orderHasDistribuidorProduct(order, productIdSet)) {
        filteredOrders.push(order);
      }

      if (filteredOrders.length >= params.limit) {
        break;
      }
    }

    hasMore = batch.length === batchSize;
    offset += batchSize;
  }

  return filteredOrders.map((order) => ({
    id: order.id,
    banca_id: order.banca_id,
    banca_name: order.bancas?.name || "Banca",
    customer: order.customer_name || "",
    total: order.total,
    status: order.status,
    created_at: formatRelativeDate(order.created_at),
    items: parseOrderItems(order.items),
  }));
}

export async function getDistribuidorPedidos(params: {
  distribuidorId: string;
  status?: string;
  query?: string;
  limit: number;
  page: number;
}) {
  const productIds = await getDistribuidorProductIds(params.distribuidorId);
  if (productIds.length === 0) {
    return {
      items: [],
      total: 0,
      page: 1,
      pages: 0,
      stats: {
        total_pedidos: 0,
        pedidos_novos: 0,
        pedidos_confirmados: 0,
        pedidos_em_preparo: 0,
        pedidos_entregues: 0,
        valor_total: 0,
      },
    };
  }

  const productIdSet = buildProductIdSet(productIds);
  let query = supabaseAdmin
    .from("orders")
    .select("*, bancas:banca_id ( id, name, address, whatsapp )", { count: "exact" })
    .order("created_at", { ascending: false });

  if (params.status) {
    query = query.eq("status", params.status);
  }

  const { data: allOrders, error } = await query;
  if (error) {
    throw error;
  }

  const pedidosDoDistribuidor = ((allOrders || []) as RawOrder[])
    .filter((order) => orderHasDistribuidorProduct(order, productIdSet))
    .map((order) => {
      const items = parseOrderItems(order.items);
      const itensDoDistribuidor = items.filter((item) => {
        const productId = item.product_id || null;
        return !!productId && productIdSet.has(productId);
      });

      const subtotalDistribuidor = itensDoDistribuidor.reduce(
        (acc, item) => acc + (Number(item.total_price) || 0),
        0
      );

      return {
        ...order,
        banca_name: order.bancas?.name || "Banca",
        banca_whatsapp: order.bancas?.whatsapp || "",
        items_distribuidor: itensDoDistribuidor,
        total_itens_distribuidor: itensDoDistribuidor.length,
        subtotal_distribuidor: subtotalDistribuidor,
        total_itens_pedido: items.length,
      };
    });

  const normalizedQuery = (params.query || "").trim().toLowerCase();
  const filtered = normalizedQuery
    ? pedidosDoDistribuidor.filter((order: any) => {
        const searchFields = [
          order.id,
          order.customer_name,
          order.customer_phone,
          order.banca_name,
          ...(order.items_distribuidor || []).map((item: any) => item.product_name),
        ]
          .join(" ")
          .toLowerCase();

        return searchFields.includes(normalizedQuery);
      })
    : pedidosDoDistribuidor;

  const total = filtered.length;
  const pages = Math.ceil(total / params.limit);
  const offset = (params.page - 1) * params.limit;
  const items = filtered.slice(offset, offset + params.limit);

  return {
    items,
    total,
    page: params.page,
    pages,
    stats: {
      total_pedidos: filtered.length,
      pedidos_novos: filtered.filter((order: any) => order.status === "novo").length,
      pedidos_confirmados: filtered.filter((order: any) => order.status === "confirmado").length,
      pedidos_em_preparo: filtered.filter((order: any) => order.status === "em_preparo").length,
      pedidos_entregues: filtered.filter((order: any) => order.status === "entregue").length,
      valor_total: filtered.reduce(
        (acc: number, order: any) => acc + (order.subtotal_distribuidor || 0),
        0
      ),
    },
  };
}

export async function getDistribuidorOrderMetrics(params: {
  distribuidorId: string;
  recentDays?: number;
}) {
  const productIds = await getDistribuidorProductIds(params.distribuidorId);
  if (productIds.length === 0) {
    return {
      totalPedidos: 0,
      totalPedidosHoje: 0,
      faturamentoMes: 0,
    };
  }

  const productIdSet = buildProductIdSet(productIds);
  const days = params.recentDays ?? 30;
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("id, total, created_at, items")
    .gte("created_at", sinceDate.toISOString());

  if (error) {
    throw error;
  }

  let totalPedidos = 0;
  let totalPedidosHoje = 0;
  let faturamentoMes = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  for (const order of (orders || []) as RawOrder[]) {
    if (!orderHasDistribuidorProduct(order, productIdSet)) {
      continue;
    }

    totalPedidos++;

    const orderDate = new Date(order.created_at);
    if (orderDate >= today) {
      totalPedidosHoje++;
    }

    if (orderDate >= firstDayOfMonth) {
      faturamentoMes += Number(order.total) || 0;
    }
  }

  return {
    totalPedidos,
    totalPedidosHoje,
    faturamentoMes,
  };
}
