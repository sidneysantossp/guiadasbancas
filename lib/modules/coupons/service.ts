import { computeCouponDiscount, isCouponActive, parseCouponBenefit } from "@/lib/coupon-engine";
import { supabaseAdmin } from "@/lib/supabase";

export interface CouponValidationInput {
  code: string;
  sellerId?: string | null;
  subtotal: number;
  shippingFee?: number;
}

export interface CouponValidationResult {
  coupon: {
    id: string;
    sellerId: string | null;
    title: string;
    code: string;
    discountText: string;
    expiresAt: string | null;
  } | null;
  benefit: ReturnType<typeof parseCouponBenefit> | null;
  discount: ReturnType<typeof computeCouponDiscount>;
}

export async function findValidCoupon(params: {
  code: string;
  sellerId?: string | null;
}): Promise<{
  coupon: {
    id: string;
    seller_id: string | null;
    title: string | null;
    code: string;
    discount_text: string | null;
    active: boolean | null;
    expires_at: string | null;
  } | null;
  error: { message?: string | null; code?: string | null } | null;
}> {
  const normalizedCode = String(params.code || "").trim().toUpperCase();

  if (!normalizedCode) {
    return { coupon: null, error: null };
  }

  let query = supabaseAdmin
    .from("coupons")
    .select("id, seller_id, title, code, discount_text, active, expires_at")
    .eq("code", normalizedCode)
    .eq("active", true)
    .limit(5);

  if (params.sellerId) {
    query = query.eq("seller_id", params.sellerId);
  }

  const { data, error } = await query;

  if (error) {
    return {
      coupon: null,
      error,
    };
  }

  const coupon =
    (data || []).find((item: any) => isCouponActive(Boolean(item.active), item.expires_at || null)) || null;

  return {
    coupon,
    error: null,
  };
}

export async function validateCouponSelection(
  params: CouponValidationInput
): Promise<{
  ok: boolean;
  result: CouponValidationResult | null;
  error: string | null;
  status: number;
}> {
  const normalizedCode = String(params.code || "").trim().toUpperCase();
  if (!normalizedCode) {
    return {
      ok: false,
      result: null,
      error: "Informe um cupom",
      status: 400,
    };
  }

  const { coupon, error } = await findValidCoupon({
    code: normalizedCode,
    sellerId: params.sellerId || null,
  });

  if (error) {
    return {
      ok: false,
      result: null,
      error: error.message || "Erro ao validar cupom",
      status: 500,
    };
  }

  if (!coupon) {
    return {
      ok: false,
      result: null,
      error: params.sellerId ? "Cupom nao disponivel para esta banca" : "Cupom invalido ou expirado",
      status: 404,
    };
  }

  const benefit = parseCouponBenefit(coupon.discount_text || "");
  const discount = computeCouponDiscount({
    discountText: coupon.discount_text || "",
    subtotal: params.subtotal,
    shippingFee: params.shippingFee,
  });

  return {
    ok: true,
    result: {
      coupon: {
        id: coupon.id,
        sellerId: coupon.seller_id || null,
        title: coupon.title || "Cupom",
        code: coupon.code,
        discountText: coupon.discount_text || "",
        expiresAt: coupon.expires_at || null,
      },
      benefit,
      discount,
    },
    error: null,
    status: 200,
  };
}
