import { createPayment, findOrCreateCustomer, formatDueDate, getPaymentPixQrCode } from "@/lib/asaas";
import { isSameBancaIdentity, pickCanonicalBanca, type CanonicalBancaCandidate } from "@/lib/banca-canonical";
import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";
import { supabaseAdmin } from "@/lib/supabase";

export type WholesaleAvailabilityStatus = "in_stock" | "on_demand" | "quote";
export type WholesaleOrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "purchasing"
  | "separating"
  | "ready_to_ship"
  | "shipped"
  | "delivered"
  | "cancelled";

export type WholesalePaymentStatus = "pending" | "confirmed" | "overdue" | "refunded" | "cancelled" | "failed";

type WholesaleProductRow = {
  id: string;
  sku: string | null;
  name: string;
  description: string | null;
  category_id: string | null;
  image_url: string | null;
  images: unknown;
  cost_price: number | string | null;
  price: number | string | null;
  compare_at_price: number | string | null;
  stock_quantity: number | null;
  reserved_quantity: number | null;
  track_stock: boolean | null;
  availability_status: WholesaleAvailabilityStatus | null;
  min_order_quantity: number | null;
  pack_size: number | null;
  delivery_lead_time: string | null;
  active: boolean | null;
  visible: boolean | null;
  visible_jornaleiro?: boolean | null;
  visible_banca?: boolean | null;
  supplier_reference: string | null;
  admin_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
  category?: { id: string; name: string | null } | { id: string; name: string | null }[] | null;
};

type WholesaleOrderRow = {
  id: string;
  order_number: string;
  banca_id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_cep: string | null;
  subtotal: number | string | null;
  shipping_fee: number | string | null;
  discount: number | string | null;
  total: number | string | null;
  payment_method: string | null;
  payment_status: WholesalePaymentStatus | null;
  status: WholesaleOrderStatus | null;
  asaas_payment_id: string | null;
  asaas_invoice_url: string | null;
  asaas_pix_payload: string | null;
  asaas_pix_encoded_image: string | null;
  asaas_due_date: string | null;
  shipping_method: string | null;
  tracking_code: string | null;
  notes: string | null;
  admin_notes: string | null;
  metadata: Record<string, unknown> | null;
  paid_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  banca?: { id: string; name: string | null; address: string | null; whatsapp: string | null } | null;
  items?: Array<Record<string, unknown>>;
};

type WholesaleVisibilityBancaRow = CanonicalBancaCandidate & {
  name: string | null;
  address: string | null;
  active: boolean | null;
  approved: boolean | null;
};

function normalizeRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toPositiveInt(value: unknown, fallback = 1) {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((image) => String(image).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((image) => image.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCategory(row: WholesaleProductRow) {
  return normalizeRelation(row.category);
}

function validateWholesaleProductPrice(price: number, availabilityStatus: WholesaleAvailabilityStatus) {
  if (price < 0) {
    throw new Error("Preço de venda não pode ser negativo");
  }

  if (availabilityStatus !== "on_demand" && price <= 0) {
    throw new Error("Preço de venda deve ser maior que zero, exceto para produtos sob encomenda");
  }
}

function collapseWholesaleVisibilityBancas(rows: WholesaleVisibilityBancaRow[]) {
  const visited = new Set<string>();
  const canonicalIdBySourceId = new Map<string, string>();
  const bancas: WholesaleVisibilityBancaRow[] = [];

  for (const row of rows) {
    if (!row?.id || visited.has(row.id)) continue;

    const cluster = rows.filter((candidate) => !visited.has(candidate.id) && isSameBancaIdentity(candidate, row));
    const canonical = pickCanonicalBanca(cluster.length > 0 ? cluster : [row]) || row;

    for (const item of cluster.length > 0 ? cluster : [row]) {
      visited.add(item.id);
      canonicalIdBySourceId.set(item.id, canonical.id);
    }

    bancas.push(canonical);
  }

  return {
    bancas: bancas.sort((left, right) => String(left.name || "").localeCompare(String(right.name || ""), "pt-BR")),
    canonicalIdBySourceId,
  };
}

function ruleTimestamp(rule: { updated_at?: string | null; created_at?: string | null }) {
  const time = new Date(rule.updated_at || rule.created_at || 0).getTime();
  return Number.isFinite(time) ? time : 0;
}

function normalizeBancaVisibilityRules(
  rules: any[],
  canonicalIdBySourceId: Map<string, string>
) {
  const byCanonicalBanca = new Map<string, any>();

  for (const rule of rules) {
    if (rule.scope !== "banca" || !rule.banca_id) continue;

    const sourceBancaId = String(rule.banca_id);
    const canonicalBancaId = canonicalIdBySourceId.get(sourceBancaId) || sourceBancaId;
    const normalized = { ...rule, banca_id: canonicalBancaId, source_banca_id: sourceBancaId };
    const existing = byCanonicalBanca.get(canonicalBancaId);

    if (!existing) {
      byCanonicalBanca.set(canonicalBancaId, normalized);
      continue;
    }

    const normalizedIsCanonical = sourceBancaId === canonicalBancaId;
    const existingIsCanonical = existing.source_banca_id === canonicalBancaId;
    if (
      (normalizedIsCanonical && !existingIsCanonical) ||
      (normalizedIsCanonical === existingIsCanonical && ruleTimestamp(normalized) > ruleTimestamp(existing))
    ) {
      byCanonicalBanca.set(canonicalBancaId, normalized);
    }
  }

  return Array.from(byCanonicalBanca.values());
}

async function resolveBancaVisibilityCluster(bancaId: string) {
  const select =
    "id, name, address, user_id, email, cotista_id, cep, active, approved, cover_image, profile_image, logo_url, created_at, updated_at";

  const { data: target, error: targetError } = await supabaseAdmin
    .from("bancas")
    .select(select)
    .eq("id", bancaId)
    .maybeSingle();

  if (targetError) throw new Error(targetError.message || "Erro ao buscar banca");
  if (!target) return { canonicalId: bancaId, ids: [bancaId] };

  if (!target.user_id) {
    return { canonicalId: target.id, ids: [target.id] };
  }

  const { data: siblings, error: siblingsError } = await supabaseAdmin
    .from("bancas")
    .select(select)
    .eq("user_id", target.user_id);

  if (siblingsError) throw new Error(siblingsError.message || "Erro ao listar bancas relacionadas");

  const cluster = ((siblings || []) as WholesaleVisibilityBancaRow[]).filter((item) =>
    isSameBancaIdentity(item, target)
  );
  const canonical = pickCanonicalBanca(cluster.length > 0 ? cluster : [target]) || target;
  const ids = Array.from(new Set((cluster.length > 0 ? cluster : [target]).map((item) => item.id).filter(Boolean)));

  return { canonicalId: canonical.id, ids: ids.length > 0 ? ids : [bancaId] };
}

export function formatWholesaleProduct(row: WholesaleProductRow) {
  const stockQuantity = Number(row.stock_quantity || 0);
  const reservedQuantity = Number(row.reserved_quantity || 0);
  const availabilityStatus = row.availability_status || "in_stock";
  const isVisible = row.visible !== false;

  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    description: row.description,
    category_id: row.category_id,
    category_name: normalizeCategory(row)?.name || null,
    image_url: row.image_url,
    images: Array.isArray(row.images) ? row.images : [],
    cost_price: toNumber(row.cost_price),
    price: toNumber(row.price),
    compare_at_price: row.compare_at_price == null ? null : toNumber(row.compare_at_price),
    stock_quantity: stockQuantity,
    reserved_quantity: reservedQuantity,
    available_quantity: Math.max(0, stockQuantity - reservedQuantity),
    track_stock: row.track_stock !== false,
    availability_status: availabilityStatus,
    min_order_quantity: Number(row.min_order_quantity || 1),
    pack_size: Number(row.pack_size || 1),
    delivery_lead_time: row.delivery_lead_time,
    active: row.active !== false,
    visible: isVisible,
    visible_jornaleiro: isVisible && row.visible_jornaleiro !== false,
    visible_banca: isVisible && row.visible_banca === true,
    supplier_reference: row.supplier_reference,
    admin_notes: row.admin_notes,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function formatWholesaleOrder(row: WholesaleOrderRow) {
  return {
    id: row.id,
    order_number: row.order_number,
    banca_id: row.banca_id,
    banca_name: row.banca?.name || null,
    customer_name: row.customer_name,
    customer_email: row.customer_email,
    customer_phone: row.customer_phone,
    shipping_address: row.shipping_address,
    shipping_city: row.shipping_city,
    shipping_state: row.shipping_state,
    shipping_cep: row.shipping_cep,
    subtotal: toNumber(row.subtotal),
    shipping_fee: toNumber(row.shipping_fee),
    discount: toNumber(row.discount),
    total: toNumber(row.total),
    payment_method: row.payment_method || "pix",
    payment_status: row.payment_status || "pending",
    status: row.status || "pending_payment",
    asaas_payment_id: row.asaas_payment_id,
    asaas_invoice_url: row.asaas_invoice_url,
    asaas_pix_payload: row.asaas_pix_payload,
    asaas_pix_encoded_image: row.asaas_pix_encoded_image,
    asaas_due_date: row.asaas_due_date,
    shipping_method: row.shipping_method,
    tracking_code: row.tracking_code,
    notes: row.notes,
    admin_notes: row.admin_notes,
    metadata: row.metadata || {},
    paid_at: row.paid_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    items: Array.isArray(row.items) ? row.items : [],
  };
}

function mapMissingTableError(error: { code?: string | null; message?: string | null } | null) {
  if (!error) return null;
  const missing =
    error.code === "42P01" ||
    error.code === "42703" ||
    error.code === "PGRST205" ||
    (
      error.code === "PGRST204" &&
      /(own_wholesale_products|visible_jornaleiro|visible_banca)/i.test(error.message || "")
    ) ||
    /relation .* does not exist/i.test(error.message || "") ||
    /Could not find the table/i.test(error.message || "") ||
    /visible_jornaleiro|visible_banca/i.test(error.message || "");

  if (!missing) return null;

  return new Error("MIGRATION_OWN_WHOLESALE_PENDING");
}

export async function listAdminWholesaleProducts(params: {
  page: number;
  pageSize: number;
  q?: string;
  status?: string;
  availability?: string;
  category?: string;
}) {
  const from = (params.page - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabaseAdmin
    .from("own_wholesale_products")
    .select("*, category:categories(id, name)", { count: "exact" });

  if (params.q) {
    const q = params.q.replace(/[%_]/g, "");
    query = query.or(`name.ilike.%${q}%,sku.ilike.%${q}%,description.ilike.%${q}%,supplier_reference.ilike.%${q}%`);
  }

  if (params.status === "active") query = query.eq("active", true);
  if (params.status === "inactive") query = query.eq("active", false);
  if (params.availability) query = query.eq("availability_status", params.availability);
  if (params.category) query = query.eq("category_id", params.category);

  const [productsResponse, statsResponse] = await Promise.all([
    query.order("created_at", { ascending: false }).range(from, to),
    supabaseAdmin.from("own_wholesale_products").select("id, active, category_id"),
  ]);

  const migrationError = mapMissingTableError(productsResponse.error) || mapMissingTableError(statsResponse.error);
  if (migrationError) throw migrationError;
  const { data, error, count } = productsResponse;
  if (error) throw new Error(error.message);
  if (statsResponse.error) throw new Error(statsResponse.error.message);

  const statsRows = statsResponse.data || [];
  const categoryCounts = statsRows.reduce<Record<string, number>>((acc, row) => {
    if (row.category_id) acc[row.category_id] = (acc[row.category_id] || 0) + 1;
    return acc;
  }, {});

  return {
    items: ((data || []) as WholesaleProductRow[]).map(formatWholesaleProduct),
    total: count || 0,
    page: params.page,
    pageSize: params.pageSize,
    summary: {
      total: statsRows.length,
      active: statsRows.filter((item) => item.active !== false).length,
      inactive: statsRows.filter((item) => item.active === false).length,
    },
    categoryCounts,
  };
}

export async function getAdminWholesaleProduct(productId: string) {
  const { data, error } = await supabaseAdmin
    .from("own_wholesale_products")
    .select("*, category:categories(id, name)")
    .eq("id", productId)
    .single();

  const migrationError = mapMissingTableError(error);
  if (migrationError) throw migrationError;
  if (error) throw new Error(error.message);

  return formatWholesaleProduct(data as WholesaleProductRow);
}

export async function getAdminWholesaleSummary() {
  const [productsResponse, ordersResponse, visibilityResponse] = await Promise.all([
    supabaseAdmin.from("own_wholesale_products").select("id, active, visible, stock_quantity, reserved_quantity, availability_status"),
    supabaseAdmin.from("own_wholesale_orders").select("id, total, status, payment_status, created_at"),
    supabaseAdmin.from("own_wholesale_visibility_rules").select("id, scope, enabled"),
  ]);

  const migrationError =
    mapMissingTableError(productsResponse.error) ||
    mapMissingTableError(ordersResponse.error) ||
    mapMissingTableError(visibilityResponse.error);
  if (migrationError) throw migrationError;
  if (productsResponse.error) throw new Error(productsResponse.error.message);
  if (ordersResponse.error) throw new Error(ordersResponse.error.message);
  if (visibilityResponse.error) throw new Error(visibilityResponse.error.message);

  const products = productsResponse.data || [];
  const orders = ordersResponse.data || [];
  const allRule = (visibilityResponse.data || []).find((rule) => rule.scope === "all");

  return {
    products_total: products.length,
    products_active: products.filter((item) => item.active !== false && item.visible !== false).length,
    products_on_demand: products.filter((item) => item.availability_status === "on_demand").length,
    low_stock: products.filter((item) => {
      const available = Number(item.stock_quantity || 0) - Number(item.reserved_quantity || 0);
      return item.availability_status === "in_stock" && available <= 5;
    }).length,
    orders_total: orders.length,
    orders_open: orders.filter((item) => !["delivered", "cancelled"].includes(String(item.status || ""))).length,
    orders_paid: orders.filter((item) => item.payment_status === "confirmed").length,
    revenue_confirmed: orders
      .filter((item) => item.payment_status === "confirmed")
      .reduce((sum, item) => sum + Number(item.total || 0), 0),
    all_bancas_enabled: allRule?.enabled === true,
  };
}

export async function createAdminWholesaleProduct(input: Record<string, unknown>) {
  const images = normalizeImages(input.images);
  const payload = {
    sku: normalizeText(input.sku),
    name: normalizeText(input.name),
    description: normalizeText(input.description),
    category_id: normalizeText(input.category_id),
    image_url: normalizeText(input.image_url) || images[0] || null,
    images,
    cost_price: toNumber(input.cost_price),
    price: toNumber(input.price),
    compare_at_price: input.compare_at_price === "" || input.compare_at_price == null ? null : toNumber(input.compare_at_price),
    stock_quantity: Math.max(0, Math.floor(toNumber(input.stock_quantity))),
    track_stock: input.track_stock !== false,
    availability_status: (normalizeText(input.availability_status) || "in_stock") as WholesaleAvailabilityStatus,
    min_order_quantity: toPositiveInt(input.min_order_quantity, 1),
    pack_size: toPositiveInt(input.pack_size, 1),
    delivery_lead_time: normalizeText(input.delivery_lead_time),
    active: input.active !== false,
    visible: input.visible !== false,
    visible_jornaleiro: input.visible_jornaleiro !== false,
    visible_banca: input.visible_banca === true,
    supplier_reference: normalizeText(input.supplier_reference),
    admin_notes: normalizeText(input.admin_notes),
  };

  if (!payload.name) throw new Error("Nome do produto é obrigatório");
  if (!["in_stock", "on_demand", "quote"].includes(payload.availability_status)) {
    throw new Error("Disponibilidade inválida");
  }
  validateWholesaleProductPrice(payload.price, payload.availability_status);

  const { data, error } = await supabaseAdmin
    .from("own_wholesale_products")
    .insert(payload)
    .select("*, category:categories(id, name)")
    .single();

  const migrationError = mapMissingTableError(error);
  if (migrationError) throw migrationError;
  if (error) throw new Error(error.message);

  return formatWholesaleProduct(data as WholesaleProductRow);
}

export async function updateAdminWholesaleProduct(productId: string, input: Record<string, unknown>) {
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const stringFields = ["sku", "name", "description", "category_id", "image_url", "delivery_lead_time", "supplier_reference", "admin_notes"];
  for (const field of stringFields) {
    if (field in input) payload[field] = normalizeText(input[field]);
  }

  if ("images" in input) {
    const images = normalizeImages(input.images);
    payload.images = images;
    if (!("image_url" in input)) payload.image_url = images[0] || null;
  }

  const numberFields = ["cost_price", "price", "compare_at_price", "stock_quantity", "min_order_quantity", "pack_size"];
  for (const field of numberFields) {
    if (field in input) {
      payload[field] = input[field] === "" || input[field] == null ? null : toNumber(input[field]);
    }
  }

  if ("availability_status" in input) {
    const status = normalizeText(input.availability_status) || "in_stock";
    if (!["in_stock", "on_demand", "quote"].includes(status)) throw new Error("Disponibilidade inválida");
    payload.availability_status = status;
  }

  if ("active" in input) payload.active = input.active === true;
  if ("visible" in input) payload.visible = input.visible === true;
  if ("visible_jornaleiro" in input) payload.visible_jornaleiro = input.visible_jornaleiro === true;
  if ("visible_banca" in input) payload.visible_banca = input.visible_banca === true;
  if ("track_stock" in input) payload.track_stock = input.track_stock === true;

  if ("price" in payload || "availability_status" in payload) {
    const { data: currentProduct, error: currentError } = await supabaseAdmin
      .from("own_wholesale_products")
      .select("price, availability_status")
      .eq("id", productId)
      .maybeSingle();

    const migrationError = mapMissingTableError(currentError);
    if (migrationError) throw migrationError;
    if (currentError) throw new Error(currentError.message);
    if (!currentProduct) throw new Error("Produto não encontrado");

    const nextPrice = "price" in payload ? toNumber(payload.price) : toNumber(currentProduct.price);
    const nextAvailability = (
      normalizeText(payload.availability_status) ||
      normalizeText(currentProduct.availability_status) ||
      "in_stock"
    ) as WholesaleAvailabilityStatus;
    validateWholesaleProductPrice(nextPrice, nextAvailability);
  }

  const { data, error } = await supabaseAdmin
    .from("own_wholesale_products")
    .update(payload)
    .eq("id", productId)
    .select("*, category:categories(id, name)")
    .single();

  const migrationError = mapMissingTableError(error);
  if (migrationError) throw migrationError;
  if (error) throw new Error(error.message);

  return formatWholesaleProduct(data as WholesaleProductRow);
}

export async function listAdminWholesaleOrders(params: { status?: string; q?: string }) {
  let query = supabaseAdmin
    .from("own_wholesale_orders")
    .select("*, banca:bancas(id, name, address, whatsapp), items:own_wholesale_order_items(*)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (params.status) query = query.eq("status", params.status);
  if (params.q) {
    const q = params.q.replace(/[%_]/g, "");
    query = query.or(`order_number.ilike.%${q}%,customer_name.ilike.%${q}%,customer_email.ilike.%${q}%`);
  }

  const { data, error } = await query;
  const migrationError = mapMissingTableError(error);
  if (migrationError) throw migrationError;
  if (error) throw new Error(error.message);

  return ((data || []) as WholesaleOrderRow[]).map(formatWholesaleOrder);
}

export async function updateAdminWholesaleOrder(orderId: string, input: Record<string, unknown>) {
  const allowedStatus = ["pending_payment", "paid", "purchasing", "separating", "ready_to_ship", "shipped", "delivered", "cancelled"];
  const allowedPaymentStatus = ["pending", "confirmed", "overdue", "refunded", "cancelled", "failed"];
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if ("status" in input) {
    const status = normalizeText(input.status);
    if (!status || !allowedStatus.includes(status)) throw new Error("Status inválido");
    payload.status = status;
  }

  if ("payment_status" in input) {
    const status = normalizeText(input.payment_status);
    if (!status || !allowedPaymentStatus.includes(status)) throw new Error("Status de pagamento inválido");
    payload.payment_status = status;
    if (status === "confirmed") payload.paid_at = new Date().toISOString();
  }

  if ("tracking_code" in input) payload.tracking_code = normalizeText(input.tracking_code);
  if ("shipping_fee" in input) payload.shipping_fee = toNumber(input.shipping_fee);
  if ("admin_notes" in input) payload.admin_notes = normalizeText(input.admin_notes);

  const { data, error } = await supabaseAdmin
    .from("own_wholesale_orders")
    .update(payload)
    .eq("id", orderId)
    .select("*, banca:bancas(id, name, address, whatsapp), items:own_wholesale_order_items(*)")
    .single();

  const migrationError = mapMissingTableError(error);
  if (migrationError) throw migrationError;
  if (error) throw new Error(error.message);

  return formatWholesaleOrder(data as WholesaleOrderRow);
}

export async function getAdminWholesaleVisibility() {
  const [rulesResponse, bancasResponse] = await Promise.all([
    supabaseAdmin
      .from("own_wholesale_visibility_rules")
      .select("id, scope, banca_id, state_code, city, enabled, notes, created_at, updated_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("bancas")
      .select("id, name, address, user_id, email, cotista_id, cep, active, approved, cover_image, profile_image, logo_url, created_at, updated_at")
      .order("name", { ascending: true }),
  ]);

  const migrationError = mapMissingTableError(rulesResponse.error);
  if (migrationError) throw migrationError;
  if (rulesResponse.error) throw new Error(rulesResponse.error.message);
  if (bancasResponse.error) throw new Error(bancasResponse.error.message);

  const rules = rulesResponse.data || [];
  const { bancas, canonicalIdBySourceId } = collapseWholesaleVisibilityBancas(
    ((bancasResponse.data || []) as WholesaleVisibilityBancaRow[])
  );
  const allRule = rules.find((rule) => rule.scope === "all");
  const bancaRules = normalizeBancaVisibilityRules(rules, canonicalIdBySourceId);

  return {
    all_enabled: allRule?.enabled === true,
    rules: [...rules.filter((rule) => rule.scope !== "banca"), ...bancaRules],
    banca_rules: bancaRules,
    bancas,
  };
}

async function setAllWholesaleVisibility(enabled: boolean) {
  const { data: existing, error: findError } = await supabaseAdmin
    .from("own_wholesale_visibility_rules")
    .select("id")
    .eq("scope", "all")
    .maybeSingle();

  const migrationError = mapMissingTableError(findError);
  if (migrationError) throw migrationError;
  if (findError) throw new Error(findError.message);

  if (existing?.id) {
    const { error } = await supabaseAdmin
      .from("own_wholesale_visibility_rules")
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabaseAdmin
    .from("own_wholesale_visibility_rules")
    .insert({ scope: "all", enabled });
  if (error) throw new Error(error.message);
}

async function setBancaWholesaleVisibility(bancaId: string, enabled: boolean) {
  const { canonicalId } = await resolveBancaVisibilityCluster(bancaId);

  const { data: existing, error: findError } = await supabaseAdmin
    .from("own_wholesale_visibility_rules")
    .select("id")
    .eq("scope", "banca")
    .eq("banca_id", canonicalId)
    .maybeSingle();

  const migrationError = mapMissingTableError(findError);
  if (migrationError) throw migrationError;
  if (findError) throw new Error(findError.message);

  if (existing?.id) {
    const { error } = await supabaseAdmin
      .from("own_wholesale_visibility_rules")
      .update({ enabled, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabaseAdmin
    .from("own_wholesale_visibility_rules")
    .insert({ scope: "banca", banca_id: canonicalId, enabled });
  if (error) throw new Error(error.message);
}

export async function updateAdminWholesaleVisibility(input: Record<string, unknown>) {
  if (input.scope === "all") {
    await setAllWholesaleVisibility(input.enabled === true);
    return getAdminWholesaleVisibility();
  }

  if (input.scope === "banca") {
    const bancaId = normalizeText(input.banca_id);
    if (!bancaId) throw new Error("Banca obrigatória");
    await setBancaWholesaleVisibility(bancaId, input.enabled === true);
    return getAdminWholesaleVisibility();
  }

  throw new Error("Escopo de visibilidade inválido");
}

export async function hasWholesaleAccessForBanca(bancaId: string) {
  const { canonicalId, ids } = await resolveBancaVisibilityCluster(bancaId);

  const [allRuleResponse, bancaRulesResponse] = await Promise.all([
    supabaseAdmin
      .from("own_wholesale_visibility_rules")
      .select("scope, enabled, created_at, updated_at")
      .eq("scope", "all")
      .maybeSingle(),
    supabaseAdmin
      .from("own_wholesale_visibility_rules")
      .select("scope, banca_id, enabled, created_at, updated_at")
      .eq("scope", "banca")
      .in("banca_id", ids.length > 0 ? ids : [bancaId]),
  ]);

  const migrationError = mapMissingTableError(allRuleResponse.error || bancaRulesResponse.error);
  if (migrationError) return false;
  if (allRuleResponse.error) throw new Error(allRuleResponse.error.message);
  if (bancaRulesResponse.error) throw new Error(bancaRulesResponse.error.message);

  const bancaRules = ((bancaRulesResponse.data || []) as any[]).sort((left, right) => {
    const leftCanonical = left.banca_id === canonicalId;
    const rightCanonical = right.banca_id === canonicalId;
    if (leftCanonical && !rightCanonical) return -1;
    if (!leftCanonical && rightCanonical) return 1;
    return ruleTimestamp(right) - ruleTimestamp(left);
  });

  if (bancaRules.length > 0) {
    return bancaRules[0].enabled === true;
  }

  return allRuleResponse.data?.enabled === true;
}

export async function getJornaleiroWholesaleAccess(userId: string) {
  const banca = await loadActiveJornaleiroBancaRow<{
    id: string;
    name: string | null;
    address: string | null;
    cep: string | null;
    whatsapp: string | null;
  }>({
    userId,
    select: "id, name, address, cep, whatsapp",
  });

  if (!banca?.id) {
    return { allowed: false, banca: null };
  }

  const allowed = await hasWholesaleAccessForBanca(banca.id);
  return { allowed, banca };
}

export async function listJornaleiroWholesaleProducts(userId: string) {
  const access = await getJornaleiroWholesaleAccess(userId);
  if (!access.allowed || !access.banca) {
    return { allowed: false, banca: access.banca, items: [] };
  }

  const { data, error } = await supabaseAdmin
    .from("own_wholesale_products")
    .select("*, category:categories(id, name)")
    .eq("active", true)
    .eq("visible", true)
    .order("name", { ascending: true });

  const migrationError = mapMissingTableError(error);
  if (migrationError) return { allowed: false, banca: access.banca, items: [] };
  if (error) throw new Error(error.message);

  return {
    allowed: true,
    banca: access.banca,
    items: ((data || []) as WholesaleProductRow[])
      .map(formatWholesaleProduct)
      .filter((product) => product.visible_jornaleiro !== false),
  };
}

export async function listPublicWholesaleProductsForBanca(bancaId: string, limit = 500) {
  const allowed = await hasWholesaleAccessForBanca(bancaId);
  if (!allowed) return [];

  const { data, error } = await supabaseAdmin
    .from("own_wholesale_products")
    .select("*, category:categories(id, name)")
    .eq("active", true)
    .eq("visible", true)
    .order("name", { ascending: true })
    .limit(Math.max(1, Math.min(10000, limit)));

  const migrationError = mapMissingTableError(error);
  if (migrationError) return [];
  if (error) throw new Error(error.message);

  return ((data || []) as WholesaleProductRow[])
    .map(formatWholesaleProduct)
    .filter((product) => product.visible_banca === true);
}

function buildWholesaleOrderNumber(now = Date.now()) {
  return `ATG-${new Date(now).getFullYear()}-${now}`;
}

function mapAsaasPaymentStatus(rawStatus?: string | null): WholesalePaymentStatus {
  const normalized = String(rawStatus || "").toUpperCase();
  if (["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(normalized)) return "confirmed";
  if (["OVERDUE", "DUNNING_REQUESTED"].includes(normalized)) return "overdue";
  if (["REFUNDED"].includes(normalized)) return "refunded";
  if (["DELETED"].includes(normalized)) return "cancelled";
  return "pending";
}

function statusFromPaymentStatus(paymentStatus: WholesalePaymentStatus): WholesaleOrderStatus {
  if (paymentStatus === "confirmed") return "paid";
  if (paymentStatus === "cancelled") return "cancelled";
  return "pending_payment";
}

export async function createJornaleiroWholesaleOrder(params: {
  userId: string;
  userEmail: string | null;
  input: Record<string, unknown>;
}) {
  const access = await getJornaleiroWholesaleAccess(params.userId);
  if (!access.allowed || !access.banca?.id) {
    throw new Error("ATACADO_NOT_AVAILABLE");
  }

  const rawItems = Array.isArray(params.input.items) ? params.input.items : [];
  if (rawItems.length === 0) {
    throw new Error("Inclua pelo menos um produto no pedido");
  }

  const productIds = rawItems
    .map((item: any) => normalizeText(item.product_id || item.id))
    .filter((value): value is string => Boolean(value));

  if (productIds.length === 0) {
    throw new Error("Produtos inválidos");
  }

  const { data: productRows, error: productsError } = await supabaseAdmin
    .from("own_wholesale_products")
    .select("*")
    .in("id", productIds)
    .eq("active", true)
    .eq("visible", true);

  if (productsError) throw new Error(productsError.message);

  const productsById = new Map(
    ((productRows || []) as WholesaleProductRow[])
      .filter((product) => formatWholesaleProduct(product).visible_jornaleiro !== false)
      .map((product) => [product.id, product])
  );
  const items = rawItems.map((item: any) => {
    const productId = normalizeText(item.product_id || item.id);
    if (!productId) throw new Error("Produto inválido");

    const product = productsById.get(productId);
    if (!product) throw new Error("Produto indisponível");
    if (product.availability_status === "quote") throw new Error(`${product.name} exige confirmação antes da compra`);

    const quantity = toPositiveInt(item.quantity || item.qty, Number(product.min_order_quantity || 1));
    const minOrder = Number(product.min_order_quantity || 1);
    if (quantity < minOrder) {
      throw new Error(`${product.name} exige quantidade mínima de ${minOrder}`);
    }

    const trackStock = product.track_stock !== false;
    const availability = product.availability_status || "in_stock";
    const availableQuantity = Number(product.stock_quantity || 0) - Number(product.reserved_quantity || 0);
    if (trackStock && availability === "in_stock" && quantity > availableQuantity) {
      throw new Error(`${product.name} possui apenas ${Math.max(0, availableQuantity)} unidade(s) disponíveis`);
    }

    const unitPrice = toNumber(product.price);
    return {
      product,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const shippingFee = Math.max(0, toNumber(params.input.shipping_fee));
  const discount = Math.max(0, toNumber(params.input.discount));
  const total = Math.max(0, subtotal + shippingFee - discount);
  const paymentMethod = normalizeText(params.input.payment_method) === "credit_card" ? "credit_card" : "pix";
  const shouldGeneratePayment = total > 0;
  const customerName = normalizeText(params.input.customer_name) || access.banca.name || "Jornaleiro";
  const customerEmail = normalizeText(params.input.customer_email) || params.userEmail;
  const customerPhone = normalizeText(params.input.customer_phone) || access.banca.whatsapp;

  if (shouldGeneratePayment && !customerEmail) {
    throw new Error("E-mail obrigatório para gerar cobrança");
  }

  const orderNumber = buildWholesaleOrderNumber();
  const { data: order, error: orderError } = await supabaseAdmin
    .from("own_wholesale_orders")
    .insert({
      order_number: orderNumber,
      banca_id: access.banca.id,
      user_id: params.userId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      shipping_address: normalizeText(params.input.shipping_address) || access.banca.address,
      shipping_cep: normalizeText(params.input.shipping_cep) || access.banca.cep,
      subtotal,
      shipping_fee: shippingFee,
      discount,
      total,
      payment_method: shouldGeneratePayment ? paymentMethod : "manual",
      payment_status: "pending",
      status: shouldGeneratePayment ? "pending_payment" : "purchasing",
      shipping_method: normalizeText(params.input.shipping_method) || "A definir",
      notes: normalizeText(params.input.notes),
      admin_notes: shouldGeneratePayment
        ? null
        : "Pedido criado com produto sob encomenda sem valor predefinido. Cobrança manual necessária.",
      metadata: {
        source: "jornaleiro_atacado",
        open_price_order: !shouldGeneratePayment,
      },
    })
    .select("*")
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message || "Erro ao criar pedido");
  }

  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    product_sku: item.product.sku,
    product_image: item.product.image_url,
    availability_status: item.product.availability_status || "in_stock",
    quantity: item.quantity,
    unit_price: item.unitPrice,
    total_price: item.totalPrice,
  }));

  const { error: itemsError } = await supabaseAdmin.from("own_wholesale_order_items").insert(orderItems);
  if (itemsError) {
    throw new Error(itemsError.message);
  }

  for (const item of items) {
    const trackStock = item.product.track_stock !== false;
    if (trackStock && item.product.availability_status === "in_stock") {
      await supabaseAdmin
        .from("own_wholesale_products")
        .update({
          reserved_quantity: Number(item.product.reserved_quantity || 0) + item.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.product.id);
    }
  }

  if (!shouldGeneratePayment) {
    const { data: orderWithoutPayment, error: fetchOrderError } = await supabaseAdmin
      .from("own_wholesale_orders")
      .select("*, banca:bancas(id, name, address, whatsapp), items:own_wholesale_order_items(*)")
      .eq("id", order.id)
      .single();

    if (fetchOrderError) throw new Error(fetchOrderError.message);
    return formatWholesaleOrder(orderWithoutPayment as WholesaleOrderRow);
  }

  try {
    const billingEmail = customerEmail;
    if (!billingEmail) {
      throw new Error("E-mail obrigatório para gerar cobrança");
    }

    const customer = await findOrCreateCustomer({
      name: customerName,
      email: billingEmail,
      phone: customerPhone || undefined,
      externalReference: `gb-wholesale-banca:${access.banca.id}`,
    });

    const asaasPayment = await createPayment({
      customer: customer.id,
      billingType: paymentMethod === "credit_card" ? "CREDIT_CARD" : "PIX",
      value: total,
      dueDate: formatDueDate(undefined, 2),
      description: `Pedido Fornecedor Guia ${orderNumber}`,
      externalReference: `gb-wholesale-order:${order.id}`,
    });

    let pixQrCode: { payload?: string; encodedImage?: string; expirationDate?: string } | null = null;
    if (paymentMethod === "pix") {
      pixQrCode = await getPaymentPixQrCode(asaasPayment.id).catch(() => null);
    }

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("own_wholesale_orders")
      .update({
        asaas_payment_id: asaasPayment.id,
        asaas_invoice_url: asaasPayment.invoiceUrl || null,
        asaas_pix_payload: pixQrCode?.payload || null,
        asaas_pix_encoded_image: pixQrCode?.encodedImage || null,
        asaas_due_date: asaasPayment.dueDate || null,
      })
      .eq("id", order.id)
      .select("*, banca:bancas(id, name, address, whatsapp), items:own_wholesale_order_items(*)")
      .single();

    if (updateError) throw new Error(updateError.message);
    return formatWholesaleOrder(updatedOrder as WholesaleOrderRow);
  } catch (error: any) {
    await supabaseAdmin
      .from("own_wholesale_orders")
      .update({
        payment_status: "failed",
        admin_notes: `Falha ao gerar cobrança Asaas: ${error?.message || "erro desconhecido"}`,
      })
      .eq("id", order.id);

    throw new Error(error?.message || "Erro ao gerar cobrança no Asaas");
  }
}

export async function listJornaleiroWholesaleOrders(userId: string) {
  const access = await getJornaleiroWholesaleAccess(userId);
  if (!access.banca?.id) return [];

  const { data, error } = await supabaseAdmin
    .from("own_wholesale_orders")
    .select("*, banca:bancas(id, name, address, whatsapp), items:own_wholesale_order_items(*)")
    .eq("banca_id", access.banca.id)
    .order("created_at", { ascending: false })
    .limit(30);

  const migrationError = mapMissingTableError(error);
  if (migrationError) return [];
  if (error) throw new Error(error.message);

  return ((data || []) as WholesaleOrderRow[]).map(formatWholesaleOrder);
}

export async function getJornaleiroWholesaleOrder(userId: string, orderId: string) {
  const access = await getJornaleiroWholesaleAccess(userId);
  if (!access.banca?.id) return null;

  const { data, error } = await supabaseAdmin
    .from("own_wholesale_orders")
    .select("*, banca:bancas(id, name, address, whatsapp), items:own_wholesale_order_items(*)")
    .eq("id", orderId)
    .eq("banca_id", access.banca.id)
    .maybeSingle();

  const migrationError = mapMissingTableError(error);
  if (migrationError) return null;
  if (error) throw new Error(error.message);
  if (!data) return null;

  return formatWholesaleOrder(data as WholesaleOrderRow);
}

export async function syncWholesaleOrderPaymentFromAsaas(params: {
  asaasPaymentId: string | null;
  externalReference: string | null;
  payment: any;
  event: string;
}) {
  let query = supabaseAdmin
    .from("own_wholesale_orders")
    .select("id, banca_id, payment_status, status, metadata")
    .limit(1);

  if (params.asaasPaymentId) {
    query = query.eq("asaas_payment_id", params.asaasPaymentId);
  } else if (params.externalReference?.startsWith("gb-wholesale-order:")) {
    query = query.eq("id", params.externalReference.replace("gb-wholesale-order:", ""));
  } else {
    return null;
  }

  const { data, error } = await query.maybeSingle();
  const migrationError = mapMissingTableError(error);
  if (migrationError) return null;
  if (error) throw new Error(error.message);
  if (!data?.id) return null;

  const paymentStatus = mapAsaasPaymentStatus(params.payment?.status);
  const status = statusFromPaymentStatus(paymentStatus);
  const paid = paymentStatus === "confirmed";

  const { data: updated, error: updateError } = await supabaseAdmin
    .from("own_wholesale_orders")
    .update({
      payment_status: paymentStatus,
      status,
      paid_at: paid ? new Date().toISOString() : null,
      metadata: {
        ...(data.metadata || {}),
        last_asaas_event: params.event,
        raw_payment_status: params.payment?.status || null,
      },
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id)
    .select("id, banca_id, status, payment_status")
    .single();

  if (updateError) throw new Error(updateError.message);

  return {
    id: updated.id,
    banca_id: updated.banca_id,
    status: updated.status,
    payment_status: updated.payment_status,
  };
}
