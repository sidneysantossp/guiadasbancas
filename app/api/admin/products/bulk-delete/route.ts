import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json().catch(() => null) as { ids?: string[] } | null;

    const ids = Array.isArray(body?.ids) ? body!.ids.filter((id) => typeof id === "string" && id.trim() !== "") : [];

    if (ids.length === 0) {
      return NextResponse.json({ success: false, error: "Informe ao menos um ID válido" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("[BULK DELETE PRODUCTS] Supabase error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Erro ao excluir produtos",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (error: any) {
    console.error("[BULK DELETE PRODUCTS] Exception:", error);
    return NextResponse.json({ success: false, error: error.message || "Erro interno" }, { status: 500 });
  }
}
