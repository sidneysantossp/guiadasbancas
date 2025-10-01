import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

// GET - Listar produtos para admin
export async function GET(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        bancas (
          id,
          name,
          cover_image
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Admin products error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao buscar produtos' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('Admin products API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

// POST - Criar produto
export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    
    // Gerar slug a partir do nome
    const slug = body.name?.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() || 'produto';

    const productData = {
      name: body.name,
      slug: slug,
      description: body.description,
      description_full: body.description_full,
      price: body.price,
      price_original: body.price_original,
      discount_percent: body.discount_percent,
      category_id: body.category_id,
      banca_id: body.banca_id || null, // Admin pode criar produtos sem banca específica
      images: body.images || [],
      gallery_images: body.gallery_images || [],
      specifications: body.specifications,
      stock_qty: body.stock_qty,
      track_stock: body.track_stock || false,
      sob_encomenda: body.sob_encomenda || false,
      pre_venda: body.pre_venda || false,
      pronta_entrega: body.pronta_entrega || true,
      active: body.active !== false,
      featured: body.featured || false,
      allow_reviews: body.allow_reviews !== false,
      coupon_code: body.coupon_code
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: "Erro ao criar produto" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
