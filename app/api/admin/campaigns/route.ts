import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

// GET - Listar todas as campanhas para admin
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

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
        plan_type,
        admin_message,
        rejection_reason,
        impressions,
        clicks,
        created_at,
        updated_at,
        approved_at,
        rejected_at,
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
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Admin campaigns error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao buscar campanhas' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: data?.length || 0
    });
  } catch (error) {
    console.error('Admin campaigns API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar campanha como admin
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { product_id, banca_id, duration_days, title, description, status = 'approved' } = body;

    // Calcular datas
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + duration_days);

    const campaignData = {
      product_id,
      banca_id,
      title: title || `Campanha Admin`,
      description: description || '',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      duration_days,
      status: 'active', // Campanhas do admin entram direto no ar
      plan_type: 'free',
      admin_message: 'Campanha criada e aprovada pelo administrador',
      approved_at: startDate.toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('campaigns')
      .insert(campaignData)
      .select()
      .single();

    if (error) {
      console.error('Create admin campaign error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao criar campanha' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create admin campaign API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
