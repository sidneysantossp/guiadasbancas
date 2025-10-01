import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// GET - Buscar campanhas ativas para exibir na home
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Buscar campanhas ativas com dados do produto e banca
    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        impressions,
        clicks,
        products (
          id,
          name,
          description,
          price,
          price_original,
          discount_percent,
          images,
          rating_avg,
          reviews_count,
          pronta_entrega,
          sob_encomenda,
          pre_venda,
          bancas (
            id,
            name,
            cover_image
          )
        )
      `)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Campaigns error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao buscar campanhas' }, { status: 500 });
    }

    // Incrementar impressões
    if (data && data.length > 0) {
      const campaignIds = data.map(c => c.id);
      await supabaseAdmin
        .from('campaigns')
        .update({ impressions: supabaseAdmin.raw('impressions + 1') })
        .in('id', campaignIds);
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: data?.length || 0
    });
  } catch (error) {
    console.error('Campaigns API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
