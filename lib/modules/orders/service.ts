import type { PlatformUserRole } from "@/lib/contracts/auth";
import { readAuthenticatedUserClaims } from "@/lib/modules/auth/session";
import { loadActiveJornaleiroBancaRow } from "@/lib/modules/jornaleiro/bancas";

export type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type OrderOutput = {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address?: string;
  banca_id: string;
  banca_name?: string;
  banca_address?: string;
  banca_whatsapp?: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_delivery?: string;
  discount?: number;
  coupon_code?: string | null;
  coupon_discount?: number;
  tax?: number;
  addons_total?: number;
};

export interface OrderActor {
  userId: string;
  role: PlatformUserRole;
  email: string | null;
  bancaId: string | null;
}

export interface NormalizedCheckoutPayload {
  customer: Record<string, any>;
  address: Record<string, any>;
  pricing: Record<string, any>;
  items: Record<string, any>[];
  orderItems: OrderItem[];
  fullAddress: string;
  inferredBancaId: string | null;
  normalizedSubtotal: number;
  normalizedBaseDiscount: number;
  normalizedShippingFee: number;
  normalizedTax: number;
  normalizedAddons: number;
  paymentMethod: string;
  shippingMethod: string;
  couponCode: string | null;
}

export function readOrderActor(session: unknown): OrderActor | null {
  const claims = readAuthenticatedUserClaims(session);

  if (!claims?.id) {
    return null;
  }

  return {
    userId: claims.id,
    role: claims.role,
    email: claims.email,
    bancaId: claims.bancaId,
  };
}

export async function resolveOrderActorBancaId(actor: OrderActor): Promise<string | null> {
  if (actor.role !== "jornaleiro") {
    return null;
  }

  const banca = await loadActiveJornaleiroBancaRow<{ id: string }>({
    userId: actor.userId,
    select: "id",
  });
  return banca?.id || null;
}

export function canActorAccessOrder(params: {
  actor: OrderActor;
  order: { user_id?: string | null; customer_email?: string | null; banca_id?: string | null };
  actorBancaId?: string | null;
}): boolean {
  if (params.actor.role === "admin") {
    return true;
  }

  if (params.actor.role === "cliente") {
    if (params.order.user_id) {
      return params.order.user_id === params.actor.userId;
    }

    if (!params.actor.email || !params.order.customer_email) {
      return false;
    }

    return params.order.customer_email.trim().toLowerCase() === params.actor.email.trim().toLowerCase();
  }

  if (params.actor.role === "jornaleiro") {
    return Boolean(params.actorBancaId && params.order.banca_id === params.actorBancaId);
  }

  return false;
}

export function formatOrderRecord(order: any): OrderOutput {
  return {
    id: order.id,
    order_number: order.order_number,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_email: order.customer_email,
    customer_address: order.customer_address,
    banca_id: order.banca_id,
    banca_name: order.bancas?.name || order.banca_name || "Banca",
    banca_address: order.bancas?.address || order.banca_address || "",
    banca_whatsapp: order.bancas?.whatsapp || order.banca_whatsapp || "",
    items: order.items || [],
    subtotal: Number(order.subtotal || 0),
    shipping_fee: Number(order.shipping_fee || 0),
    total: Number(order.total || 0),
    status: order.status,
    payment_method: order.payment_method,
    notes: order.notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
    estimated_delivery: order.estimated_delivery,
    discount: order.discount ? Number(order.discount) : 0,
    coupon_code: order.coupon_code || null,
    coupon_discount: order.coupon_discount ? Number(order.coupon_discount) : 0,
    tax: order.tax ? Number(order.tax) : 0,
    addons_total: order.addons_total ? Number(order.addons_total) : 0,
  };
}

export function formatOrderRecords(data: any[]): OrderOutput[] {
  return (data || []).map(formatOrderRecord);
}

export function buildOrderListMeta(params: {
  count: number | null;
  page: number;
  limit: number;
}) {
  const total = params.count || 0;

  return {
    total,
    page: params.page,
    limit: params.limit,
    pages: Math.ceil(total / params.limit),
  };
}

export function normalizeCheckoutPayload(
  body: Record<string, any>,
  sessionBancaId?: string | null
): NormalizedCheckoutPayload {
  const customer = body.customer || {};
  const address = body.address || {};
  const pricing = body.pricing || {};
  const items = Array.isArray(body.items) ? body.items : [];

  const fullAddress = [
    address.street,
    address.houseNumber,
    address.neighborhood,
    address.city && address.uf ? `${address.city} - ${address.uf}` : "",
    address.cep ? `CEP: ${address.cep}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  const orderItems: OrderItem[] = items.map((item: any, index: number) => ({
    id: `item-${index + 1}`,
    product_id: item.id || `prod-${index + 1}`,
    product_name: item.name || "Produto",
    product_image: item.image || "",
    quantity: item.qty || 1,
    unit_price: Number(item.price || 0),
    total_price: Number(item.price || 0) * Number(item.qty || 1),
  }));

  return {
    customer,
    address,
    pricing,
    items,
    orderItems,
    fullAddress,
    inferredBancaId: body.banca_id || items[0]?.banca_id || sessionBancaId || null,
    normalizedSubtotal: Number(pricing.subtotal || 0),
    normalizedBaseDiscount: Number(pricing.discount || 0),
    normalizedShippingFee: Number(pricing.shipping || 0),
    normalizedTax: Number(pricing.tax || 0),
    normalizedAddons: Number(pricing.addons || 0),
    paymentMethod: String(body.payment || "pix"),
    shippingMethod: body.shippingMethod ? String(body.shippingMethod) : "",
    couponCode: body.coupon ? String(body.coupon).trim().toUpperCase() : null,
  };
}

export function generateOrderNumber(bancaName: string, now = Date.now()): string {
  const bancaPrefix = (bancaName || "BAN")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, "X");

  const currentYear = new Date(now).getFullYear();
  return `${bancaPrefix}-${currentYear}-${now}`;
}
