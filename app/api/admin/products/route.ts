import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

    // Buscar categorias de bancas
    const { data: categoriesBancas } = await supabaseAdmin
      .from('categories')
      .select('id, name');

    // Buscar categorias de distribuidores
    const { data: categoriesDistribuidores } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome');

    // Mapear produtos com nome do distribuidor e categoria
    const distribuidoresMap = new Map((distribuidores || []).map(d => [d.id, d.nome]));
    const categoriasBancasMap = new Map((categoriesBancas || []).map(c => [c.id, c.name]));
    const categoriasDistribuidoresMap = new Map((categoriesDistribuidores || []).map(c => [c.id, c.nome]));
    
    const mappedData = (products || []).map((product: any) => {
      let categoriaNome = 'Sem Categoria';
      
      // Tentar buscar da categoria de bancas primeiro
      if (product.category_id && categoriasBancasMap.has(product.category_id)) {
        categoriaNome = categoriasBancasMap.get(product.category_id)!;
      } 
      // Senão, tentar buscar da categoria de distribuidores
      else if (product.category_id && categoriasDistribuidoresMap.has(product.category_id)) {
        categoriaNome = categoriasDistribuidoresMap.get(product.category_id)!;
      }
      
      return {
        ...product,
        distribuidor_nome: product.distribuidor_id ? distribuidoresMap.get(product.distribuidor_id) || null : null,
        categoria_nome: categoriaNome,
      };
    });

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

    // Tentativa 1: inserir com todos os campos previstos
    let { data, error } = await supabaseAdmin
      .from('products')
      .insert(productData)
      .select()
      .single();

    // Fallback: se der erro de coluna inexistente (ex.: campos Mercos não aplicados em prod), tenta com o mínimo necessário
    if (error && (error.code === '42703' || /column .* does not exist/i.test(error.message || ''))) {
      console.warn('[CREATE PRODUCT] Coluna inexistente detectada. Tentando fallback com colunas mínimas...');
      const minimalData: any = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: productData.category_id,
        banca_id: productData.banca_id,
        images: productData.images,
        stock_qty: productData.stock_qty,
        track_stock: productData.track_stock,
        sob_encomenda: productData.sob_encomenda,
        pre_venda: productData.pre_venda,
        pronta_entrega: productData.pronta_entrega,
      };
      const retry = await supabaseAdmin
        .from('products')
        .insert(minimalData)
        .select()
        .single();
      data = retry.data;
      error = retry.error as any;
    }

    // Fallback 2: se falhar por NOT NULL em banca_id, escolher uma banca padrão
    if (error && error.code === '23502' && /banca_id/i.test(`${error.message || ''} ${error.details || ''} ${error.hint || ''}`)) {
      console.warn('[CREATE PRODUCT] NOT NULL em banca_id. Buscando banca padrão para continuar...');
      const { data: anyBanca } = await supabaseAdmin.from('bancas').select('id').limit(1).single();
      if (anyBanca?.id) {
        const minimalWithBanca: any = {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category_id: productData.category_id,
          banca_id: anyBanca.id,
          images: productData.images,
          stock_qty: productData.stock_qty,
          track_stock: productData.track_stock,
          sob_encomenda: productData.sob_encomenda,
          pre_venda: productData.pre_venda,
          pronta_entrega: productData.pronta_entrega,
        };
        const retry2 = await supabaseAdmin
          .from('products')
          .insert(minimalWithBanca)
          .select()
          .single();
        data = retry2.data;
        error = retry2.error as any;
      }
    }

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
      try {
        const { data: bancas, error: bancasErr } = await supabaseAdmin
          .from('bancas')
          .select('id');
        if (!bancasErr && bancas && bancas.length > 0) {
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
          const { error: linkErr } = await supabaseAdmin
            .from('banca_produtos_distribuidor')
            .insert(bancaProdutos);
          if (linkErr) {
            console.warn('[CREATE PRODUCT] Aviso: falha ao vincular produto às bancas:', linkErr);
          }
        }
      } catch (e) {
        console.warn('[CREATE PRODUCT] Aviso: exceção ao vincular às bancas:', e);
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
