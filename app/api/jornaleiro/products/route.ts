import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  // Buscar banca_id e informações de cotista do usuário
  const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id, is_cotista, cotista_id');

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

  console.log('[JORNALEIRO/PRODUCTS] Banca row (campos cotista):', {
    is_cotista: banca.is_cotista,
    cotista_id: banca.cotista_id,
  });

  const isCotista = banca.is_cotista === true && !!banca.cotista_id;
  console.log(`[JORNALEIRO/PRODUCTS] Banca ${banca.id} - É cotista: ${isCotista}`);

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").toLowerCase();
  const category = searchParams.get("category") || "";
  const active = searchParams.get("active");
  const featured = searchParams.get("featured");
  const priceFilter = searchParams.get("priceFilter") || "";
  const statsOnly = searchParams.get("stats") === "true";

  // Buscar produtos da banca do usuário
  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      categories(name),
      bancas(name)
    `)
    .eq('banca_id', banca.id);

  if (q) {
    query = query.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
  }
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
  let totalProdutosDistribuidor = 0;
  
  if (isCotista) {
    console.log('[JORNALEIRO/PRODUCTS] Buscando produtos de distribuidores com filtros no banco...');
    
    // Se for apenas estatísticas, buscar contagem total primeiro
    if (statsOnly) {
      const { count: distCount } = await supabaseAdmin
        .from('products')
        .select('id', { count: 'exact', head: true })
        .not('distribuidor_id', 'is', null)
        .eq('active', true);
      
      totalProdutosDistribuidor = distCount || 0;
      console.log(`[JORNALEIRO/PRODUCTS] Cotista - Total de produtos de distribuidores: ${totalProdutosDistribuidor}`);
    }
    
    let queryAdmin = supabaseAdmin
      .from('products')
      .select(`
        *,
        categories(name),
        bancas(name)
      `)
      .not('distribuidor_id', 'is', null)
      .eq('active', true)
      .order('created_at', { ascending: false });

    // Aplicar filtros DIRETAMENTE no banco para evitar trazer dados desnecessários
    if (q) {
      queryAdmin = queryAdmin.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
    }
    
    if (category) {
      queryAdmin = queryAdmin.eq('category_id', category);
    }

    // Limitar resultados para evitar timeout e lentidão extrema
    // Se tiver busca, traz mais resultados, se for listagem geral, limita a 100 recentes
    const limit = q ? 200 : 100;
    queryAdmin = queryAdmin.limit(limit);

    const { data, error: fetchError } = await queryAdmin;
      
    if (fetchError) {
      console.error(`[JORNALEIRO/PRODUCTS] Erro ao buscar produtos admin:`, fetchError);
    } else {
      produtosAdmin = data || [];
      console.log(`[JORNALEIRO/PRODUCTS] Cotista - ${produtosAdmin.length} produtos de distribuidores encontrados (limit: ${limit})`);
    }
  } else {
    console.log(`[JORNALEIRO/PRODUCTS] Não-cotista - produtos de distribuidores NÃO disponíveis`);
  }

  // Se não trouxe produtos do admin, não precisa buscar customizações
  let customMap = new Map();
  let calcularPrecoMarkup = (precoBase: number, produtoId: string, distribuidorId: string, categoryId: string) => precoBase;
  
  if (produtosAdmin.length > 0) {
    // Buscar customizações desta banca APENAS para os produtos retornados (otimização)
    // Ou buscar todas da banca se for mais simples (geralmente a banca não customiza tantos produtos)
    // Vamos buscar todas da banca pois é filtrado por ID e deve ser rápido
    const { data: customizacoes } = await supabaseAdmin
      .from('banca_produtos_distribuidor')
      .select('product_id, enabled, custom_price, custom_description, custom_status, custom_pronta_entrega, custom_sob_encomenda, custom_pre_venda')
      .eq('banca_id', banca.id);

    // Buscar markups para calcular preço sugerido
    const distribuidorIds = Array.from(new Set(produtosAdmin.map(p => p.distribuidor_id).filter(Boolean)));
    const productIds = produtosAdmin.map(p => p.id);
    const categoryIds = Array.from(new Set(produtosAdmin.map(p => p.category_id).filter(Boolean)));

    let distMap = new Map();
    let markupCatMap = new Map();
    let markupProdMap = new Map();
    // let calcularPrecoMarkup: (precoBase: number, produtoId: string, distribuidorId: string, categoryId: string) => number;

    if (distribuidorIds.length > 0) {
      // Buscar distribuidores
      const { data: dists, error: distError } = await supabaseAdmin
        .from('distribuidores')
        .select('id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo')
        .in('id', distribuidorIds);
      
      console.log('[JORNALEIRO/PRODUCTS] Distribuidores encontrados:', dists?.length || 0);
      if (distError) {
        console.error('[JORNALEIRO/PRODUCTS] Erro ao buscar distribuidores:', distError);
      }
      dists?.forEach((d: any) => {
        console.log(`[JORNALEIRO/PRODUCTS] Distribuidor ${d.nome} (${d.id}): markup_global=${d.markup_global_percentual}%, fixo=${d.markup_global_fixo}, tipo=${d.tipo_calculo}`);
      });
      distMap = new Map((dists || []).map((d: any) => [d.id, d]));

      // Buscar markups por categoria
      const { data: mCats } = await supabaseAdmin
        .from('distribuidor_markup_categorias')
        .select('distribuidor_id, category_id, markup_percentual, markup_fixo')
        .in('distribuidor_id', distribuidorIds);
      (mCats || []).forEach((m: any) => markupCatMap.set(`${m.distribuidor_id}:${m.category_id}`, m));

      // Buscar markups por produto
      const { data: mProds } = await supabaseAdmin
        .from('distribuidor_markup_produtos')
        .select('distribuidor_id, product_id, markup_percentual, markup_fixo')
        .in('product_id', productIds);
      (mProds || []).forEach((m: any) => markupProdMap.set(m.product_id, m));

      calcularPrecoMarkup = (precoBase: number, produtoId: string, distribuidorId: string, categoryId: string) => {
        // 1. Produto
        const mp = markupProdMap.get(produtoId);
        if (mp) {
          const mpPerc = Number(mp.markup_percentual || 0);
          const mpFixo = Number(mp.markup_fixo || 0);
          
          if (mpPerc > 0 || mpFixo > 0) {
            const resultado = precoBase * (1 + mpPerc / 100) + mpFixo;
            console.log(`[MARKUP] Produto ${produtoId}: base=${precoBase} => ${resultado} (markup produto: ${mpPerc}%)`);
            return resultado;
          }
        }

        // 2. Categoria
        const mc = markupCatMap.get(`${distribuidorId}:${categoryId}`);
        if (mc) {
          const mcPerc = Number(mc.markup_percentual || 0);
          const mcFixo = Number(mc.markup_fixo || 0);
          
          if (mcPerc > 0 || mcFixo > 0) {
            const resultado = precoBase * (1 + mcPerc / 100) + mcFixo;
            console.log(`[MARKUP] Produto ${produtoId}: base=${precoBase} => ${resultado} (markup categoria: ${mcPerc}%)`);
            return resultado;
          }
        }

        // 3. Global
        const dist = distMap.get(distribuidorId);
        if (dist) {
          const margemDivisor = Number(dist.margem_divisor || 1);
          
          if (dist.tipo_calculo === 'margem' && margemDivisor > 0 && margemDivisor < 1) {
            const resultado = precoBase / margemDivisor;
            console.log(`[MARKUP] Produto ${produtoId}: base=${precoBase} => ${resultado} (margem divisor: ${margemDivisor})`);
            return resultado;
          }
          
          const perc = Number(dist.markup_global_percentual || 0);
          const fixo = Number(dist.markup_global_fixo || 0);
          
          if (perc > 0 || fixo > 0) {
            const resultado = precoBase * (1 + perc / 100) + fixo;
            console.log(`[MARKUP] Produto ${produtoId}: base=${precoBase} => ${resultado} (markup global: ${perc}% + ${fixo})`);
            return resultado;
          }
          console.log(`[MARKUP] Produto ${produtoId}: distribuidor encontrado mas sem markup definido (perc=${perc}, fixo=${fixo})`);
        } else {
          console.log(`[MARKUP] Produto ${produtoId}: distribuidor ${distribuidorId} NÃO encontrado no distMap`);
        }
        return precoBase;
      };
    } 
    // else {
    //   calcularPrecoMarkup = (p) => p; // fallback
    // }

    // Mapear customizações por product_id
    customMap = new Map(
      (customizacoes || []).map(c => [c.product_id, c])
    );
  } // Fim do if (produtosAdmin.length > 0)

  // Aplicar customizações e markups
  const produtosAdminCustomizados = (produtosAdmin || [])
    .filter(produto => {
      const custom = customMap.get(produto.id);
      return !custom || custom.enabled !== false;
    })
    .map(produto => {
      const custom = customMap.get(produto.id);
      const precoBase = produto.price || 0;
      // Se não tiver markups carregados (ex: lista vazia), calcularPrecoMarkup não vai existir se estiver dentro do if
      // Precisamos mover a função para fora ou garantir que ela exista
      
      let precoComMarkup = precoBase;
      if (typeof calcularPrecoMarkup === 'function') {
        precoComMarkup = calcularPrecoMarkup(precoBase, produto.id, produto.distribuidor_id, produto.category_id);
      }
      
      return {
        ...produto,
        price: custom?.custom_price || precoComMarkup,
        cost_price: precoBase, // Preço de custo (base do distribuidor)
        description: produto.description + (custom?.custom_description ? `\n\n${custom.custom_description}` : ''),
        pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
        sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
        pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
        is_distribuidor: true,
      };
    });

  // Combinar produtos da banca + produtos do admin
  // (Os filtros q e category já foram aplicados na query do admin, e na query da banca (linha 54-57?))
  // Verificando query da banca... sim, linhas 54-59 aplicam filtros.
  
  let allItems = [...(produtosBanca || []), ...produtosAdminCustomizados];

  // Aplicar filtro de preço
  if (priceFilter === 'personalizado') {
    // Preços Personalizados: produtos onde o preço foi alterado pelo jornaleiro
    // - Produtos próprios da banca (não são de distribuidor)
    // - Produtos de distribuidor com preço customizado (price != cost_price)
    allItems = allItems.filter((p: any) => {
      const isDistribuidor = p.is_distribuidor === true;
      if (!isDistribuidor) return true; // Produtos próprios são considerados personalizados
      // Produtos de distribuidor: verificar se preço foi alterado
      const price = Number(p.price || 0);
      const costPrice = Number(p.cost_price || 0);
      return Math.abs(price - costPrice) > 0.01; // Diferença maior que 1 centavo
    });
  } else if (priceFilter === 'distribuidor') {
    // Preço do Distribuidor: produtos com preço original (não alterado)
    // - Apenas produtos de distribuidor onde price == cost_price
    allItems = allItems.filter((p: any) => {
      const isDistribuidor = p.is_distribuidor === true;
      if (!isDistribuidor) return false; // Produtos próprios não são do distribuidor
      // Produtos de distribuidor: verificar se preço NÃO foi alterado
      const price = Number(p.price || 0);
      const costPrice = Number(p.cost_price || 0);
      return Math.abs(price - costPrice) <= 0.01; // Diferença menor que 1 centavo
    });
  }

  // Se for cotista e statsOnly, calcular total real
  const totalReal = isCotista && statsOnly 
    ? (produtosBanca?.length || 0) + totalProdutosDistribuidor
    : allItems.length;

  return NextResponse.json({ 
    success: true, 
    items: allItems, 
    total: allItems.length,
    totalReal: totalReal, // Total real incluindo todos os produtos de distribuidores
    is_cotista: isCotista,
    stats: {
      proprios: produtosBanca?.length || 0,
      distribuidores: statsOnly ? totalProdutosDistribuidor : produtosAdminCustomizados.length,
      distribuidoresTotal: totalProdutosDistribuidor // Total real de produtos de distribuidores
    },
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  // Buscar banca_id do usuário
  const banca = await getActiveBancaRowForUser(session.user.id, 'id, user_id');

  if (!banca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  let body: any;
  try {
    body = await request.json();
    console.log('[API/Jornaleiro/Products] Body recebido:', JSON.stringify(body, null, 2));
  } catch (e) {
    console.error('[API/Jornaleiro/Products] Payload inválido:', e);
    return NextResponse.json({ success: false, error: "JSON inválido no corpo da requisição" }, { status: 400 });
  }
  
  // Campos básicos que existem na tabela products
  const novo: Record<string, any> = {
    banca_id: banca.id,
    category_id: body.category_id || null,
    name: body.name,
    description: body.description || "",
    images: Array.isArray(body.images) ? body.images : [],
    price: Number(body.price || 0),
    price_original: body.price_original != null ? Number(body.price_original) : null,
    discount_percent: body.discount_percent != null ? Number(body.discount_percent) : null,
    stock_qty: body.stock_qty != null ? Number(body.stock_qty) : 0,
    active: body.active ?? true,
  };

  console.log('[API/Jornaleiro/Products] Objeto a inserir:', JSON.stringify(novo, null, 2));
  
  const { data: created, error } = await supabaseAdmin
    .from('products')
    .insert(novo)
    .select()
    .single();

  if (error) {
    console.error('[API/Jornaleiro/Products] Erro ao criar produto:', error);
    console.error('[API/Jornaleiro/Products] Detalhes:', JSON.stringify(error, null, 2));
    return NextResponse.json({ success: false, error: error.message || 'Erro ao criar produto', details: error }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
