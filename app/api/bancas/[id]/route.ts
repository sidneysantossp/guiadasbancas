import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error || !data) {
      return NextResponse.json({ error: "Banca não encontrada" }, { status: 404 });
    }
    
    return NextResponse.json({ data });
  } catch (e: any) {
    console.error('Erro ao buscar banca:', e);
    return NextResponse.json({ error: e?.message || "Erro ao buscar banca" }, { status: 500 });
  }
}
