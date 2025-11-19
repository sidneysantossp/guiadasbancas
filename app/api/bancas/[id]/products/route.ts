import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const bancaId = context.params.id;
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "12", 10);
    
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .eq('banca_id', bancaId)
      .eq('active', true)
      .limit(limit);
    
    if (error) {
      console.error('Erro ao buscar produtos da banca:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, items: products || [] });
  } catch (e: any) {
    console.error('Erro ao buscar produtos da banca:', e);
    return NextResponse.json({ success: false, error: e?.message || "Erro ao buscar produtos da banca" }, { status: 500 });
  }
}
