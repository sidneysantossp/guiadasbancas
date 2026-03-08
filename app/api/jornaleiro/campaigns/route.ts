import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";

export const dynamic = 'force-dynamic';

// GET - Listar campanhas do jornaleiro
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    // Buscar banca_id do usuário
    const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

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
    const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

    if (!banca) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const { product_id, duration_days, title, description } = body;

    if (!product_id) {
      return NextResponse.json({ success: false, error: "Produto é obrigatório" }, { status: 400 });
    }

    const normalizedDuration = Number(duration_days || 0);
    if (![7, 15, 30].includes(normalizedDuration)) {
      return NextResponse.json({ success: false, error: "Duração de campanha inválida" }, { status: 400 });
    }

    const { data: ownedProduct, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, banca_id, name")
      .eq("id", product_id)
      .eq("banca_id", banca.id)
      .maybeSingle();

    if (productError) {
      console.error("Create campaign product validation error:", productError);
      return NextResponse.json({ success: false, error: "Erro ao validar produto da campanha" }, { status: 500 });
    }

    if (!ownedProduct) {
      return NextResponse.json({ success: false, error: "Produto não encontrado na sua banca" }, { status: 403 });
    }

    // Calcular datas
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + normalizedDuration);

    const campaignData = {
      product_id: ownedProduct.id,
      banca_id: banca.id,
      title: title || `Campanha - ${ownedProduct.name}`,
      description: description || '',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      duration_days: normalizedDuration,
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
