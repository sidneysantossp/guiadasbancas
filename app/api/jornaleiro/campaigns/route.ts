import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET - Listar campanhas do jornaleiro
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    // Buscar banca_id do usuário
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
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
      .eq('banca_id', banca.id) // FILTRAR APENAS DA BANCA DO USUÁRIO
      .order('created_at', { ascending: false });

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
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    // Buscar banca_id do usuário
    const { data: banca } = await supabaseAdmin
      .from('bancas')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const { product_id, duration_days, title, description } = body;

    // Calcular datas
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration_days);

    const campaignData = {
      product_id,
      banca_id: banca.id,
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
