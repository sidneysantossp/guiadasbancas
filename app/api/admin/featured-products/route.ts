import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

/**
 * Admin API: manage curated (featured) products for home sections
 * Table: featured_products
 */
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const section = (searchParams.get('section') || '').trim();
    const includeInactive = searchParams.get('all') === 'true';

    let query = supabaseAdmin
      .from('featured_products')
      .select('id, section_key, product_id, label, order_index, active, created_at, updated_at');

    if (section) query = query.eq('section_key', section);
    if (!includeInactive) query = query.eq('active', true);

    const { data, error } = await query.order('section_key').order('order_index');

    if (error) {
      console.error('[admin/featured-products] GET error', error);
      return NextResponse.json({ success: false, error: 'Erro ao listar' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (e) {
    console.error('[admin/featured-products] GET fatal', e);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const { section_key, product_id, label, order_index } = body || {};
    if (!section_key || !product_id) {
      return NextResponse.json({ success: false, error: 'section_key e product_id são obrigatórios' }, { status: 400 });
    }

    let finalOrder = typeof order_index === 'number' ? order_index : 0;
    if (finalOrder === 0) {
      const { data: maxData } = await supabaseAdmin
        .from('featured_products')
        .select('order_index')
        .eq('section_key', section_key)
        .order('order_index', { ascending: false })
        .limit(1);
      if (Array.isArray(maxData) && maxData[0]?.order_index != null) {
        finalOrder = Number(maxData[0].order_index) + 1;
      }
    }

    const { data, error } = await supabaseAdmin
      .from('featured_products')
      .insert({ section_key, product_id, label: label || null, order_index: finalOrder, active: true })
      .select()
      .single();

    if (error) {
      console.error('[admin/featured-products] POST error', error);
      return NextResponse.json({ success: false, error: 'Erro ao inserir' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('[admin/featured-products] POST fatal', e);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const body = await request.json();
    const { id, label, order_index, active } = body || {};
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 });
    }

    const patch: any = {};
    if (label !== undefined) patch.label = label;
    if (order_index !== undefined) patch.order_index = Number(order_index);
    if (active !== undefined) patch.active = Boolean(active);

    const { data, error } = await supabaseAdmin
      .from('featured_products')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[admin/featured-products] PUT error', error);
      return NextResponse.json({ success: false, error: 'Erro ao atualizar' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (e) {
    console.error('[admin/featured-products] PUT fatal', e);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'id é obrigatório' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('featured_products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[admin/featured-products] DELETE error', error);
      return NextResponse.json({ success: false, error: 'Erro ao remover' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[admin/featured-products] DELETE fatal', e);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
