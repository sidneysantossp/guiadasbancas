import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

const mapRow = (data: any) => data && ({
  id: data.id,
  sellerId: data.seller_id,
  title: data.title,
  code: data.code,
  discountText: data.discount_text,
  active: data.active,
  highlight: data.highlight,
  expiresAt: data.expires_at,
  createdAt: data.created_at,
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updates: any = {};
    if (body.active !== undefined) updates.active = Boolean(body.active);
    if (body.highlight !== undefined) updates.highlight = Boolean(body.highlight);
    if (body.title !== undefined) updates.title = String(body.title);
    if (body.discountText !== undefined) updates.discount_text = String(body.discountText);
    if (body.expiresAt !== undefined) updates.expires_at = body.expiresAt ? String(body.expiresAt) : null;

    if (updates.highlight === true) {
      // Desmarca outros destaques do mesmo seller
      const { data: couponRow } = await supabaseAdmin.from('coupons').select('seller_id').eq('id', params.id).single();
      if (couponRow?.seller_id) {
        await supabaseAdmin.from('coupons').update({ highlight: false }).eq('seller_id', couponRow.seller_id);
      }
    }

    const { data, error } = await supabaseAdmin.from('coupons').update(updates).eq('id', params.id).select().single();
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, data: mapRow(data) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Erro ao atualizar cupom' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabaseAdmin.from('coupons').delete().eq('id', params.id);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Erro ao excluir cupom' }, { status: 500 });
  }
}
