import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { validateCouponSelection } from "@/lib/modules/coupons/service";

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
      return NextResponse.json(
        { ok: false, error: "Informe um cupom" },
        { status: 400, headers: buildNoStoreHeaders() }
      );
    }

    const validation = await validateCouponSelection({
      code,
      sellerId,
      subtotal,
      shippingFee,
    });

    if (!validation.ok || !validation.result) {
      return NextResponse.json(
        { ok: false, error: validation.error },
        { status: validation.status, headers: buildNoStoreHeaders() }
      );
    }

    const coupon = validation.result.coupon;
    if (!coupon) {
      return NextResponse.json(
        { ok: false, error: "Cupom invalido ou expirado" },
        { status: 404, headers: buildNoStoreHeaders() }
      );
    }

    return NextResponse.json({
      ok: true,
      data: {
        id: coupon.id,
        code: coupon.code,
        title: coupon.title,
        discountText: coupon.discountText,
        benefitType: validation.result.benefit?.type || "unknown",
        benefitValue: validation.result.benefit?.value || null,
        scope: validation.result.discount.scope,
        discountAmount: validation.result.discount.amount,
        sellerId: coupon.sellerId,
        expiresAt: coupon.expiresAt,
      },
    }, { headers: buildNoStoreHeaders() });
  } catch (error: any) {
    console.error("[API Coupons Validate] Erro:", error);
    return NextResponse.json(
      { ok: false, error: error?.message || "Erro ao validar cupom" },
      { status: 500, headers: buildNoStoreHeaders() }
    );
  }
}
