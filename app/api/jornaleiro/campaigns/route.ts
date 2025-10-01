import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifySellerAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader.startsWith("Bearer "));
}

// GET - Listar campanhas do jornaleiro
export async function GET(request: NextRequest) {
  try {
    if (!verifySellerAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    // TODO: Implementar autenticação real do jornaleiro
    // Por enquanto, vamos buscar todas as campanhas
    const { searchParams } = new URL(request.url);
    const bancaId = searchParams.get('banca_id');
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('campaigns')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        duration_days,
        status,
        admin_message,
        rejection_reason,
        impressions,
        clicks,
        created_at,
        updated_at,
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
          pre_venda
        )
      `)
      .order('created_at', { ascending: false });

    if (bancaId) {
      query = query.eq('banca_id', bancaId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Seller campaigns error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao buscar campanhas' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: data?.length || 0
    });
  } catch (error) {
    console.error('Seller campaigns API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar nova campanha
export async function POST(request: NextRequest) {
  try {
    if (!verifySellerAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, banca_id, duration_days, title, description } = body;

    // Calcular datas
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration_days);

    const campaignData = {
      product_id,
      banca_id,
      title: title || `Campanha para produto`,
      description: description || '',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      duration_days,
      status: 'pending',
      plan_type: 'free'
    };

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error('Create campaign error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao criar campanha' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create campaign API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
