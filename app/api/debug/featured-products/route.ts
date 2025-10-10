import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Buscar todas as customizações com featured
    const { data: customizacoes } = await supabaseAdmin
      .from('banca_produtos_distribuidor')
      .select('*')
      .eq('custom_featured', true);

    // Buscar produtos próprios com featured
    const { data: produtosProprios } = await supabaseAdmin
      .from('products')
      .select('id, name, banca_id, featured, distribuidor_id')
      .eq('featured', true);

    return NextResponse.json({
      customizacoes_featured: customizacoes || [],
      produtos_proprios_featured: produtosProprios || [],
      total_customizacoes: customizacoes?.length || 0,
      total_produtos_proprios: produtosProprios?.length || 0
    });

  } catch (error) {
    console.error('Erro ao buscar debug:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar dados',
      details: error 
    }, { status: 500 });
  }
}
