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

    // Buscar produtos
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('*')
      .order('name');

    if (productsError) {
      console.error('Admin products error:', productsError);
      return NextResponse.json({ success: false, error: 'Erro ao buscar produtos', details: productsError }, { status: 500 });
    }

    // Buscar distribuidores
    const { data: distribuidores } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome');

    // Mapear produtos com nome do distribuidor
    const distribuidoresMap = new Map((distribuidores || []).map(d => [d.id, d.nome]));
    
    const mappedData = (products || []).map((product: any) => ({
      ...product,
      distribuidor_nome: product.distribuidor_id ? distribuidoresMap.get(product.distribuidor_id) || null : null
    }));

    return NextResponse.json({ success: true, data: mappedData });
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
      banca_id: body.banca_especifica_id || null, // Para banca específica
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
      coupon_code: body.coupon_code,
      // Campos Mercos
      codigo_mercos: body.codigo_mercos || null,
      unidade_medida: body.unidade_medida || 'UN',
      venda_multiplos: body.venda_multiplos || 1.00,
      categoria_mercos: body.categoria_mercos || null,
      disponivel_todas_bancas: body.disponivel_todas_bancas || false
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Se produto está disponível para todas as bancas, criar registros automáticos
    if (body.disponivel_todas_bancas && data) {
      const { data: bancas } = await supabaseAdmin
        .from('bancas')
        .select('id');
      
      if (bancas && bancas.length > 0) {
        const bancaProdutos = bancas.map(banca => ({
          banca_id: banca.id,
          product_id: data.id,
          enabled: true,
          custom_price: null,
          custom_description: null,
          custom_status: 'active',
          custom_pronta_entrega: data.pronta_entrega,
          custom_sob_encomenda: data.sob_encomenda,
          custom_pre_venda: data.pre_venda
        }));

        await supabaseAdmin
          .from('banca_produtos_distribuidor')
          .insert(bancaProdutos);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
