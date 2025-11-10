import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();
    const type = (searchParams.get("type") || "").trim();

    const digits = q.replace(/[^0-9]/g, "");

    // Only allow exact document (11/14) or exact code (3..6)
    let sel = supabaseAdmin.from("cotistas").select("id,codigo,razao_social,cnpj_cpf").eq("ativo", true).limit(1);

    if (digits.length === 11 || digits.length === 14) {
      const { data, error } = await sel.eq("cnpj_cpf", digits);
      if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      return NextResponse.json({ success: true, data: (data && data[0]) ? data[0] : null });
    }

    if (type === 'code') {
      // Only accept codes of length 3..6 (avoid enumeration of small values)
      if (digits.length >= 3 && digits.length <= 6) {
        const { data, error } = await sel.eq("codigo", digits);
        if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        return NextResponse.json({ success: true, data: (data && data[0]) ? data[0] : null });
      }
    }

    return NextResponse.json({ success: true, data: null });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Erro interno" }, { status: 500 });
  }
}
