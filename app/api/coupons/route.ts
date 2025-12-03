import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

type Coupon = {
  id: string;
  sellerId: string; // jornaleiro/banca responsável
  title: string; // mini título
  code: string; // código em destaque
  discountText: string; // ex: "10% OFF"
  active: boolean;
  highlight: boolean; // se deve aparecer em destaque no banner
  expiresAt?: string; // ISO
  createdAt: string; // ISO
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sellerId = searchParams.get('sellerId') || undefined;
  const onlyActive = searchParams.get('active') === 'true';
  const { data, error } = await supabaseAdmin
    .from('coupons')
    .select('*')
    .match(sellerId ? { seller_id: sellerId } : {})
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const mapped = (data || []).filter((c: any) => {
    if (onlyActive && !c.active) return false;
    if (onlyActive && c.expires_at) {
      try { if (Date.now() > Date.parse(c.expires_at)) return false; } catch {}
    }
    return true;
  }).map((c: any) => ({
    id: c.id,
    sellerId: c.seller_id,
    title: c.title,
    code: c.code,
    discountText: c.discount_text,
    active: c.active,
    highlight: c.highlight,
    expiresAt: c.expires_at,
    createdAt: c.created_at,
  }));

  return NextResponse.json({ ok: true, data: mapped });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellerId, title, code, discountText, active = true, highlight = false, expiresAt } = body || {};

    if (!sellerId || !title || !code || !discountText) {
      return NextResponse.json({ ok: false, error: 'Campos obrigatórios: sellerId, title, code, discountText' }, { status: 400 });
    }

    const insertData = {
      seller_id: sellerId,
      title: String(title),
      code: String(code).toUpperCase().trim(),
      discount_text: String(discountText),
      active: Boolean(active),
      highlight: Boolean(highlight),
      expires_at: expiresAt ? String(expiresAt) : null,
    };

    // Se highlight=true, desmarca outros do mesmo seller
    if (highlight) {
      await supabaseAdmin.from('coupons').update({ highlight: false }).eq('seller_id', sellerId);
    }

    const { data, error } = await supabaseAdmin.from('coupons').insert(insertData).select().single();
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const item: Coupon = {
      id: data.id,
      sellerId: data.seller_id,
      title: data.title,
      code: data.code,
      discountText: data.discount_text,
      active: data.active,
      highlight: data.highlight,
      expiresAt: data.expires_at,
      createdAt: data.created_at,
    };

    return NextResponse.json({ ok: true, data: item });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Erro ao criar cupom' }, { status: 500 });
  }
}
