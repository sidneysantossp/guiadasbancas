import { NextRequest, NextResponse } from "next/server";
import { computeCouponDiscount, isCouponActive, parseCouponBenefit } from "@/lib/coupon-engine";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = String(searchParams.get("code") || "")
      .trim()
      .toUpperCase();
    const sellerId = String(searchParams.get("sellerId") || searchParams.get("bancaId") || "").trim();
    const subtotal = Number(searchParams.get("subtotal") || 0);
    const shippingFee = Number(searchParams.get("shipping") || 0);

    if (!code) {
      return NextResponse.json({ ok: false, error: "Informe um cupom" }, { status: 400 });
    }

    let query = supabaseAdmin
      .from("coupons")
      .select("id, seller_id, title, code, discount_text, active, highlight, expires_at, created_at")
      .eq("code", code)
      .eq("active", true)
      .limit(5);

    if (sellerId) {
      query = query.eq("seller_id", sellerId);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const coupon = (data || []).find((item: any) => isCouponActive(Boolean(item.active), item.expires_at || null));

    if (!coupon) {
      return NextResponse.json(
        { ok: false, error: sellerId ? "Cupom nao disponivel para esta banca" : "Cupom invalido ou expirado" },
        { status: 404 },
      );
    }

    const benefit = parseCouponBenefit(coupon.discount_text || "");
    const discount = computeCouponDiscount({
      discountText: coupon.discount_text || "",
      subtotal,
      shippingFee,
    });

    return NextResponse.json({
      ok: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        title: coupon.title || "Cupom",
        discountText: coupon.discount_text || "",
        benefitType: benefit.type,
        benefitValue: benefit.value,
        scope: discount.scope,
        discountAmount: discount.amount,
        sellerId: coupon.seller_id,
        expiresAt: coupon.expires_at || null,
      },
    });
  } catch (error: any) {
    console.error("[API Coupons Validate] Erro:", error);
    return NextResponse.json({ ok: false, error: error?.message || "Erro ao validar cupom" }, { status: 500 });
  }
}
