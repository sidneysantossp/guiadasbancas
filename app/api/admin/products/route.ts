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
    
    // Validação básica
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ success: false, error: "Nome do produto é obrigatório" }, { status: 400 });
    }
    
    if (!body.price || isNaN(parseFloat(body.price))) {
      return NextResponse.json({ success: false, error: "Preço do produto é obrigatório e deve ser um número válido" }, { status: 400 });
    }
    
    // Gerar slug a partir do nome
    const slug = body.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() || 'produto';

    // Apenas campos essenciais que existem na tabela products
    const productData: any = {
      name: body.name.trim(),
      description: body.description?.trim() || null,
      price: parseFloat(body.price),
      category_id: body.category_id || null,
      banca_id: body.banca_id || body.banca_especifica_id || null,
      images: Array.isArray(body.images) ? body.images : [],
      stock_qty: body.stock_qty ? parseInt(body.stock_qty) : 0,
      track_stock: Boolean(body.track_stock),
      sob_encomenda: Boolean(body.sob_encomenda),
      pre_venda: Boolean(body.pre_venda),
      pronta_entrega: body.pronta_entrega !== false,
      active: body.active !== false,
      // Campos Mercos
      codigo_mercos: body.codigo_mercos?.trim() || null,
      unidade_medida: body.unidade_medida?.trim() || 'UN',
      venda_multiplos: body.venda_multiplos ? parseFloat(body.venda_multiplos) : 1.00,
      categoria_mercos: body.categoria_mercos?.trim() || null,
      disponivel_todas_bancas: Boolean(body.disponivel_todas_bancas)
    };

    console.log('[CREATE PRODUCT] Dados a inserir:', JSON.stringify(productData, null, 2));

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('[CREATE PRODUCT] Erro ao criar produto:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }, { status: 500 });
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
