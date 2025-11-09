import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  // Buscar banca_id e informações de cotista do usuário
  const { data: banca } = await supabaseAdmin
    .from('bancas')
    .select('id, is_cotista, cotista_id')
    .eq('user_id', session.user.id)
    .single();

  if (!banca) {
    console.log('[API/JORNALEIRO/PRODUCTS] Usuário sem banca - retornando lista vazia');
    // Usuário sem banca: retornar lista vazia com mensagem
    return NextResponse.json({ 
      success: true, 
      items: [], 
      total: 0,
      message: 'Cadastre sua banca para ver seus produtos'
    });
  }

  const isCotista = banca.is_cotista === true && banca.cotista_id;
  console.log(`[JORNALEIRO/PRODUCTS] Banca ${banca.id} - É cotista: ${isCotista}`);

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const active = searchParams.get("active");
  const featured = searchParams.get("featured");

  // Buscar produtos da banca do usuário
  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      categories(name),
      bancas(name)
    `)
    .eq('banca_id', banca.id);

  if (q) query = query.ilike('name', `%${q}%`);
  if (category) query = query.eq('category_id', category);
  if (active !== null) query = query.eq('active', active === 'true');
  if (featured !== null) query = query.eq('featured', featured === 'true');

  const { data: produtosBanca, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos da banca:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar produtos' }, { status: 500 });
  }

  // Buscar produtos de distribuidores SOMENTE se for cotista
  let produtosAdmin: any[] = [];
  
  if (isCotista) {
    const { data } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(name),
        bancas(name)
      `)
      .not('distribuidor_id', 'is', null)
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    produtosAdmin = data || [];
    console.log(`[JORNALEIRO/PRODUCTS] Cotista - ${produtosAdmin.length} produtos de distribuidores encontrados`);
  } else {
    console.log(`[JORNALEIRO/PRODUCTS] Não-cotista - produtos de distribuidores NÃO disponíveis`);
  }

  // Buscar customizações desta banca para produtos do admin
  const { data: customizacoes } = await supabaseAdmin
    .from('banca_produtos_distribuidor')
    .select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda')
    .eq('banca_id', banca.id);

  // Mapear customizações por product_id
  const customMap = new Map(
    (customizacoes || []).map(c => [c.product_id, c])
  );

  // Aplicar customizações e filtrar produtos do admin
  const produtosAdminCustomizados = (produtosAdmin || [])
    .filter(produto => {
      const custom = customMap.get(produto.id);
      return !custom || custom.enabled !== false;
    })
    .map(produto => {
      const custom = customMap.get(produto.id);
      
      return {
        ...produto,
        price: custom?.custom_price || produto.price,
        description: produto.description + (custom?.custom_description ? `\n\n${custom.custom_description}` : ''),
        pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
        sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
        pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
        is_distribuidor: true,
      };
    });

  // Aplicar filtros nos produtos do admin
  let produtosAdminFiltrados = produtosAdminCustomizados;
  if (q) {
    produtosAdminFiltrados = produtosAdminFiltrados.filter(p => 
      p.name.toLowerCase().includes(q)
    );
  }
  if (category) {
    produtosAdminFiltrados = produtosAdminFiltrados.filter(p => 
      p.category_id === category
    );
  }

  // Combinar produtos da banca + produtos do admin
  const allItems = [...(produtosBanca || []), ...produtosAdminFiltrados];

  return NextResponse.json({ 
    success: true, 
    items: allItems, 
    total: allItems.length,
    is_cotista: isCotista,
    stats: {
      proprios: produtosBanca?.length || 0,
      distribuidores: produtosAdminFiltrados.length
    }
  });
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
