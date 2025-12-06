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

    const url = request.nextUrl;
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'));
    const pageSize = Math.max(1, Math.min(100, parseInt(url.searchParams.get('pageSize') || '50')));
    const q = (url.searchParams.get('q') || '').trim();
    const distribuidor = (url.searchParams.get('distribuidor') || '').trim();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabaseAdmin
      .from('products')
      .select('*', { count: 'exact' })
      .order('name');

    if (q) {
      query = query.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
    }
    if (distribuidor) {
      if (distribuidor === 'admin') {
        query = query.is('distribuidor_id', null);
      } else {
        query = query.eq('distribuidor_id', distribuidor);
      }
    }

    const { data: products, error: productsError, count } = await query.range(from, to);

    if (productsError) {
      console.error('Admin products error:', productsError);
      return NextResponse.json({ success: false, error: 'Erro ao buscar produtos', details: productsError }, { status: 500 });
    }

    // Buscar distribuidores com markup global
    const { data: distribuidores } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo');

    // Buscar categorias de bancas
    const { data: categoriesBancas } = await supabaseAdmin
      .from('categories')
      .select('id, name');

    // Buscar categorias de distribuidores
    const { data: categoriesDistribuidores } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome');

    // Mapear markups
    const productIds = (products || []).map((p: any) => p.id);
    const distribuidorIds = (products || []).map((p: any) => p.distribuidor_id).filter(Boolean);

    // Buscar markups por produto
    const { data: markupProdutos } = await supabaseAdmin
      .from('distribuidor_markup_produtos')
      .select('distribuidor_id, product_id, markup_percentual, markup_fixo')
      .in('product_id', productIds);

    // Buscar markups por categoria
    const { data: markupCategorias } = await supabaseAdmin
      .from('distribuidor_markup_categorias')
      .select('distribuidor_id, category_id, markup_percentual, markup_fixo')
      .in('distribuidor_id', distribuidorIds);

    // Criar mapas
    const distribuidoresMap = new Map((distribuidores || []).map(d => [d.id, d]));
    const categoriasBancasMap = new Map((categoriesBancas || []).map(c => [c.id, c.name]));
    const categoriasDistribuidoresMap = new Map((categoriesDistribuidores || []).map(c => [c.id, c.name]));
    
    const markupProdMap = new Map();
    (markupProdutos || []).forEach((m: any) => markupProdMap.set(m.product_id, m));

    const markupCatMap = new Map();
    (markupCategorias || []).forEach((m: any) => markupCatMap.set(`${m.distribuidor_id}:${m.category_id}`, m));
    
    // Função auxiliar de cálculo
    const calcularPreco = (precoBase: number, p: any) => {
      if (!p.distribuidor_id) return precoBase;

      // 1. Produto
      const mp = markupProdMap.get(p.id);
      if (mp && (mp.markup_percentual > 0 || mp.markup_fixo > 0)) {
        return precoBase * (1 + mp.markup_percentual / 100) + mp.markup_fixo;
      }

      // 2. Categoria
      const mc = markupCatMap.get(`${p.distribuidor_id}:${p.category_id}`);
      if (mc && (mc.markup_percentual > 0 || mc.markup_fixo > 0)) {
        return precoBase * (1 + mc.markup_percentual / 100) + mc.markup_fixo;
      }

      // 3. Global
      const dist = distribuidoresMap.get(p.distribuidor_id);
      if (dist) {
        if (dist.tipo_calculo === 'margem' && dist.margem_divisor > 0 && dist.margem_divisor < 1) {
          return precoBase / dist.margem_divisor;
        }
        const perc = dist.markup_global_percentual || 0;
        const fixo = dist.markup_global_fixo || 0;
        if (perc > 0 || fixo > 0) {
          return precoBase * (1 + perc / 100) + fixo;
        }
      }
      return precoBase;
    };

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

      const precoFinal = calcularPreco(product.price || 0, product);
      
      return {
        ...product,
        price_final: precoFinal,
        distribuidor_nome: product.distribuidor_id ? (distribuidoresMap.get(product.distribuidor_id) as any)?.nome || null : null,
        categoria_nome: categoriaNome,
      };
    });

    return NextResponse.json({ success: true, data: mappedData, total: count || 0, page, pageSize });
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

    // Inserção mínima e segura (evita colunas opcionais que podem não existir em todos ambientes)
    const insertData: any = {
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
    };

    // Se banca_id vier vazio e a tabela exigir NOT NULL, tentamos obter uma banca padrão
    if (!insertData.banca_id) {
      const { data: defaultBanca } = await supabaseAdmin.from('bancas').select('id').limit(1).single();
      if (defaultBanca?.id) {
        insertData.banca_id = defaultBanca.id;
      }
    }

    console.log('[CREATE PRODUCT] Dados a inserir (mínimos):', JSON.stringify(insertData, null, 2));

    // Tentativa 1: inserir com todos os campos previstos
    let { data, error } = await supabaseAdmin
      .from('products')
      .insert(insertData)
      .select()
      .single();

    // Fallback: se der erro de coluna inexistente (ex.: campos Mercos não aplicados em prod), tenta com o mínimo necessário
    if (error && (error.code === '42703' || /column .* does not exist/i.test(error.message || ''))) {
      console.warn('[CREATE PRODUCT] Coluna inexistente detectada. Tentando fallback com colunas mínimas...');
      const minimalData: any = { ...insertData };
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
        const minimalWithBanca: any = { ...insertData, banca_id: anyBanca.id };
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
            custom_status: 'available',
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
