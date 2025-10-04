import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
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
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const active = searchParams.get("active");
  const featured = searchParams.get("featured");

  // Buscar produtos apenas da banca do usuário
  let query = supabaseAdmin
    .from('products')
    .select('*')
    .eq('banca_id', banca.id);

  if (q) query = query.ilike('name', `%${q}%`);
  if (category) query = query.eq('category_id', category);
  if (active !== null) query = query.eq('active', active === 'true');
  if (featured !== null) query = query.eq('featured', featured === 'true');

  const { data: items, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar produtos' }, { status: 500 });
  }

  return NextResponse.json({ success: true, items: items || [], total: items?.length || 0 });
}

export async function POST(request: NextRequest) {
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
  
  const novo = {
    banca_id: banca.id,
    category_id: body.category_id || null,
    name: body.name,
    slug: (body.slug || body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
    description: body.description || "",
    images: Array.isArray(body.images) ? body.images : [],
    price: Number(body.price || 0),
    price_original: body.price_original != null ? Number(body.price_original) : null,
    discount_percent: body.discount_percent != null ? Number(body.discount_percent) : null,
    stock_qty: body.stock_qty != null ? Number(body.stock_qty) : 0,
    track_stock: !!body.track_stock,
    featured: !!body.featured,
    sob_encomenda: !!body.sob_encomenda,
    pre_venda: !!body.pre_venda,
    pronta_entrega: !!body.pronta_entrega,
    coupon_code: typeof body.coupon_code === 'string' ? body.coupon_code : null,
    description_full: typeof body.description_full === 'string' ? body.description_full : null,
    specifications: typeof body.specifications === 'string' ? body.specifications : null,
    gallery_images: Array.isArray(body.gallery_images) ? body.gallery_images : [],
    allow_reviews: !!body.allow_reviews,
    active: body.active ?? true,
    rating_avg: 0,
    reviews_count: 0,
  };

  const { data: created, error } = await supabaseAdmin
    .from('products')
    .insert(novo)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json({ success: false, error: 'Erro ao criar produto' }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
