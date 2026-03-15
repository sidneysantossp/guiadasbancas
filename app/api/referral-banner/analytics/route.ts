import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const bannerId = typeof body.banner_id === "string" && body.banner_id.trim() ? body.banner_id.trim() : null;

    if (!bannerId) {
      return NextResponse.json(
        { success: false, error: "banner_id é obrigatório" },
        { status: 400 }
      );
    }

    const { data: currentBanner, error: currentError } = await supabaseAdmin
      .from("referral_banners")
      .select("id, click_count")
      .eq("id", bannerId)
      .maybeSingle();

    if (currentError || !currentBanner) {
      return NextResponse.json(
        { success: false, error: "Banner não encontrado" },
        { status: 404 }
      );
    }

    const clickCount = typeof currentBanner.click_count === "number" ? currentBanner.click_count : 0;

    const { error: updateError } = await supabaseAdmin
      .from("referral_banners")
      .update({ click_count: clickCount + 1 })
      .eq("id", bannerId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Erro ao registrar clique" },
        { status: 500 }
      );
    }

    try {
      const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

      await supabaseAdmin.from("banner_analytics").insert([
        {
          banner_id: bannerId,
          clicked_at: new Date().toISOString(),
          user_agent: typeof body.user_agent === "string" ? body.user_agent : null,
          referrer: typeof body.referrer === "string" ? body.referrer : null,
          ip_address: ipAddress,
        },
      ]);
    } catch {
      // Analytics detalhado é opcional.
    }

    return NextResponse.json({ success: true, message: "Clique registrado com sucesso" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro interno ao registrar clique" },
      { status: 500 }
    );
  }
}
