import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";
import type { Produto } from "@/types/admin";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").toLowerCase();
    const category = searchParams.get("category") || "";
    const active = searchParams.get("active");
    const bancaId = searchParams.get("banca_id") || "";

    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(name),
        bancas(name)
      `);

    // Aplicar filtros
    if (q) {
      query = query.ilike('name', `%${q}%`);
    }
    if (category) {
      query = query.eq('category_id', category);
    }
    if (bancaId) {
      query = query.eq('banca_id', bancaId);
    }
    if (active !== null) {
      // Assumindo que produtos ativos são aqueles com estoque ou sem controle de estoque
      if (active === "true") {
        query = query.or('track_stock.eq.false,stock_qty.gt.0');
      } else {
        query = query.eq('track_stock', true).eq('stock_qty', 0);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      return NextResponse.json({ items: [], total: 0 });
    }

    // Transformar dados para o formato esperado
    const items = data?.map(product => ({
      id: product.id,
      banca_id: product.banca_id,
      category_id: product.category_id,
      name: product.name,
      slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
      description: product.description,
      description_full: product.description_full,
      price: product.price,
      price_original: product.price_original,
      discount_percent: product.discount_percent,
      images: product.images || [],
      gallery_images: product.gallery_images || [],
      specifications: product.specifications,
      rating_avg: product.rating_avg,
      reviews_count: product.reviews_count || 0,
      stock_qty: product.stock_qty,
      track_stock: product.track_stock,
      sob_encomenda: product.sob_encomenda,
      pre_venda: product.pre_venda,
      pronta_entrega: product.pronta_entrega,
      active: product.track_stock ? (product.stock_qty || 0) > 0 : true,
      created_at: product.created_at,
      updated_at: product.updated_at
    })) || [];

    return NextResponse.json({ items, total: items.length });
  } catch (error) {
    console.error('Erro na API de produtos:', error);
    return NextResponse.json({ items: [], total: 0 }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const productData = {
      banca_id: body.banca_id,
      category_id: body.category_id || null,
      name: body.name,
      description: body.description || null,
      description_full: body.description_full || null,
      price: Number(body.price || 0),
      price_original: body.price_original ? Number(body.price_original) : null,
      discount_percent: body.discount_percent || null,
      images: body.images || null,
      gallery_images: body.gallery_images || null,
      specifications: body.specifications || null,
      rating_avg: body.rating_avg || null,
      reviews_count: body.reviews_count || 0,
      stock_qty: body.stock_qty || null,
      track_stock: !!body.track_stock,
      sob_encomenda: !!body.sob_encomenda,
      pre_venda: !!body.pre_venda,
      pronta_entrega: body.pronta_entrega !== false
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro na criação de produto:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
