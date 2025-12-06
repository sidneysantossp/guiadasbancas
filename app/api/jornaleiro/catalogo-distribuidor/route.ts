import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/jornaleiro/catalogo-distribuidor
// Lista todos os produtos de distribuidores com customizações da banca
export async function GET(req: NextRequest) {
  try {
    console.log('[CATALOGO] Iniciando requisição...');
    
    // Obter sessão do NextAuth
    const session = await auth();
    console.log('[CATALOGO] Sessão:', session ? 'Encontrada' : 'Não encontrada');
    console.log('[CATALOGO] User ID:', session?.user?.id);
    
    if (!session?.user?.id) {
      console.error('[CATALOGO] Usuário não autenticado');
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin;
    const userId = session.user.id;
    console.log('[CATALOGO] Buscando banca para userId:', userId);

    // Buscar banca do jornaleiro com informações de cotista
    const { data: banca } = await supabase
      .from('bancas')
      .select('id, is_cotista, cotista_id')
      .eq('user_id', userId)
      .single();

    if (!banca) {
      console.log('[CATALOGO] Banca não encontrada para userId:', userId, '- Retornando lista vazia');
      return NextResponse.json(
        { success: true, data: [], message: 'Cadastre sua banca para ver o catálogo de produtos dos distribuidores' },
        { status: 200 }
      );
    }

    const bancaId = banca.id;
    const isCotista = banca.is_cotista === true && !!banca.cotista_id;
    console.log('[CATALOGO] Banca encontrada:', bancaId, '- É cotista:', isCotista);

    // Verificar se é cotista - apenas cotistas têm acesso ao catálogo de distribuidores
    if (!isCotista) {
      console.log('[CATALOGO] Usuário não é cotista - acesso negado ao catálogo');
      return NextResponse.json({
        success: true,
        data: [],
        products: [],
        total: 0,
        is_cotista: false,
        message: 'Para ter acesso ao catálogo de distribuidores, você precisa se identificar como cotista na sua banca.'
      });
    }

    // 1. Buscar LISTA COMPLETA de distribuidores e calcular contagens reais
    let listaDistribuidores: any[] = [];
    
    // Buscar todos os distribuidores
    const { data: dists } = await supabase.from('distribuidores').select('id, nome').order('nome');
    
    if (dists) {
      // Para contornar o limite de 1000 linhas do Supabase, vamos fazer uma query de count para cada distribuidor
      // Como são poucos distribuidores, isso é performático e garante o número exato
      const countPromises = dists.map(async (dist) => {
        const { count } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('distribuidor_id', dist.id)
          .eq('active', true);
          
        return {
          nome: dist.nome,
          count: count || 0
        };
      });
      
      const results = await Promise.all(countPromises);
      
      // Filtrar apenas quem tem produtos e ordenar por nome
      listaDistribuidores = results
        .filter(d => d.count > 0)
        .sort((a, b) => a.nome.localeCompare(b.nome));
        
      console.log(`[CATALOGO] Contagem final por distribuidor:`, listaDistribuidores);
    }

    // 2. Buscar produtos de distribuidores com FILTROS no BANCO
    console.log('[CATALOGO] Buscando produtos com filtros no banco...');
    
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').toLowerCase();
    const distribuidorFilter = searchParams.get('distribuidor') || '';

    // Iniciar query
    let query = supabase
      .from('products')
      .select('id, name, description, price, stock_qty, images, mercos_id, codigo_mercos, distribuidor_id, track_stock, pronta_entrega, sob_encomenda, pre_venda, created_at, category_id, active')
      .not('distribuidor_id', 'is', null)
      .eq('active', true)
      .order('created_at', { ascending: false });

    // Aplicar filtros
    if (q) {
      query = query.or(`name.ilike.%${q}%,codigo_mercos.ilike.%${q}%`);
    }

    // Se tiver filtro de distribuidor, precisamos pegar o ID dele pelo nome
    if (distribuidorFilter) {
      // Buscar ID do distribuidor pelo nome (poderia ter passado ID do front, mas o front usa nome no value)
      const { data: distData } = await supabase
        .from('distribuidores')
        .select('id')
        .eq('nome', distribuidorFilter)
        .single();
      
      if (distData) {
        query = query.eq('distribuidor_id', distData.id);
      }
    }

    // Limitar resultados para evitar timeout
    // Se tem busca específica, traz mais. Se é listagem geral, traz menos.
    const limit = q ? 200 : 100;
    query = query.limit(limit);

    const { data: produtos, error: prodError } = await query;

    if (prodError) {
      console.error('[CATALOGO] Erro ao buscar produtos:', prodError.message);
      return NextResponse.json(
        { success: false, error: prodError.message },
        { status: 500 }
      );
    }

    console.log(`[CATALOGO] ${produtos?.length || 0} produtos carregados (limit: ${limit})`);
    
    // O resto do código segue igual (mapeamento de markups, etc) mas usando 'produtos' que já foi carregado
    // Remover o loop while antigo
    
    /* CÓDIGO ANTIGO REMOVIDO: Loop while(hasMore) */

    // Buscar nomes de distribuidores e categorias para mapear manualmente
    const distribuidorIds = Array.from(new Set((produtos || []).map((p: any) => p.distribuidor_id).filter(Boolean)));
    const categoryIds = Array.from(new Set((produtos || []).map((p: any) => p.category_id).filter(Boolean)));

    let distMap = new Map<string, any>();
    let catMap = new Map<string, string>();

    // Buscar distribuidores com suas configurações de markup global
    if (distribuidorIds.length > 0) {
      const { data: distRows } = await supabase
        .from('distribuidores')
        .select('id, nome, markup_global_percentual, markup_global_fixo, margem_percentual, margem_divisor, tipo_calculo')
        .in('id', distribuidorIds as any);
      distMap = new Map<string, any>((distRows || []).map((d: any) => [d.id, d]));
      console.log(`[CATALOGO] ${distRows?.length || 0} distribuidores mapeados:`, Array.from(distMap.values()).map(d => d.nome));
    }

    if (categoryIds.length > 0) {
      const { data: catRows } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds as any);
      catMap = new Map<string, string>((catRows || []).map((c: any) => [c.id, c.name]));
    }

    // Buscar markups por categoria de todos os distribuidores
    const { data: markupCategorias } = await supabase
      .from('distribuidor_markup_categorias')
      .select('distribuidor_id, category_id, markup_percentual, markup_fixo')
      .in('distribuidor_id', distribuidorIds as any);

    // Criar mapa de markup por categoria: chave = "distId:catId"
    const markupCatMap = new Map<string, { percentual: number; fixo: number }>();
    (markupCategorias || []).forEach((mc: any) => {
      markupCatMap.set(`${mc.distribuidor_id}:${mc.category_id}`, {
        percentual: mc.markup_percentual || 0,
        fixo: mc.markup_fixo || 0,
      });
    });

    // Buscar markups por produto de todos os distribuidores
    const productIds = produtos.map((p: any) => p.id);
    const { data: markupProdutos } = await supabase
      .from('distribuidor_markup_produtos')
      .select('distribuidor_id, product_id, markup_percentual, markup_fixo')
      .in('product_id', productIds.slice(0, 1000)); // Limitar para performance

    // Criar mapa de markup por produto
    const markupProdMap = new Map<string, { percentual: number; fixo: number }>();
    (markupProdutos || []).forEach((mp: any) => {
      markupProdMap.set(mp.product_id, {
        percentual: mp.markup_percentual || 0,
        fixo: mp.markup_fixo || 0,
      });
    });

    // Função para calcular preço com markup ou margem
    const calcularPrecoComMarkup = (precoBase: number, produtoId: string, distribuidorId: string, categoryId: string) => {
      // Prioridade: Produto > Categoria > Global
      
      // 1. Verificar markup específico do produto
      const markupProd = markupProdMap.get(produtoId);
      if (markupProd && (markupProd.percentual > 0 || markupProd.fixo > 0)) {
        return precoBase * (1 + markupProd.percentual / 100) + markupProd.fixo;
      }

      // 2. Verificar markup da categoria
      const markupCat = markupCatMap.get(`${distribuidorId}:${categoryId}`);
      if (markupCat && (markupCat.percentual > 0 || markupCat.fixo > 0)) {
        return precoBase * (1 + markupCat.percentual / 100) + markupCat.fixo;
      }

      // 3. Usar configuração global do distribuidor
      const dist = distMap.get(distribuidorId);
      if (dist) {
        const tipoCalculo = dist.tipo_calculo || 'markup';
        
        // Se usar margem (divisor)
        if (tipoCalculo === 'margem') {
          const divisor = dist.margem_divisor || 1;
          if (divisor > 0 && divisor < 1) {
            return precoBase / divisor;
          }
        }
        
        // Se usar markup simples
        const globalPerc = dist.markup_global_percentual || 0;
        const globalFixo = dist.markup_global_fixo || 0;
        if (globalPerc > 0 || globalFixo > 0) {
          return precoBase * (1 + globalPerc / 100) + globalFixo;
        }
      }

      // 4. Sem configuração, retornar preço base
      return precoBase;
    };

    // Buscar customizações da banca
    const { data: customizacoes } = await supabase
      .from('banca_produtos_distribuidor')
      .select('*')
      .eq('banca_id', bancaId);

    // Mapear customizações por product_id
    const customMap = new Map(
      (customizacoes || []).map(c => [c.product_id, c])
    );

    // Combinar produtos com customizações
    const produtosComCustom = produtos?.map((produto: any) => {
      const custom = customMap.get(produto.id);
      
      // Calcular preço com markup do distribuidor
      const precoBase = produto.price || 0;
      const precoComMarkup = calcularPrecoComMarkup(
        precoBase,
        produto.id,
        produto.distribuidor_id,
        produto.category_id
      );
      
      // Debug para Almanaque
      if (produto.codigo_mercos === 'AALCA029') {
        console.log('[DEBUG CATALOGO] Almanaque:', {
          produto_id: produto.id,
          produto_price: produto.price,
          preco_com_markup: precoComMarkup,
          custom_price: custom?.custom_price,
          custom_exists: !!custom,
          custom_data: custom
        });
      }

      const distData = distMap.get(produto.distribuidor_id);
      const distribuidor_nome = distData?.nome || null;
      const category_name = catMap.get(produto.category_id) || null;

      return {
        ...produto,
        // Nomes extraídos
        distribuidor_nome,
        category_name,
        // Dados de customização da banca
        enabled: custom?.enabled ?? true, // Por padrão todos habilitados
        custom_price: custom?.custom_price || null,
        custom_description: custom?.custom_description || null,
        custom_status: custom?.custom_status || 'available',
        custom_pronta_entrega: custom?.custom_pronta_entrega ?? produto.pronta_entrega,
        custom_sob_encomenda: custom?.custom_sob_encomenda ?? produto.sob_encomenda,
        custom_pre_venda: custom?.custom_pre_venda ?? produto.pre_venda,
        custom_stock_enabled: custom?.custom_stock_enabled ?? false,
        custom_stock_qty: custom?.custom_stock_qty || null,
        custom_featured: custom?.custom_featured ?? false,
        modificado_em: custom?.modificado_em || null,
        customizacao_id: custom?.id || null,
        // Preço base do produto (sem markup)
        preco_base: precoBase,
        // Preço do distribuidor com markup aplicado (sugerido para o jornaleiro)
        distribuidor_price: precoComMarkup,
        // Preço efetivo: customizado pelo jornaleiro > markup do distribuidor > preço base
        effective_price: custom?.custom_price || precoComMarkup,
      };
    }) || [];

    console.log(`[CATALOGO] Cotista - ${produtosComCustom.length} produtos de distribuidores encontrados`);

    return NextResponse.json({
      success: true,
      products: produtosComCustom,
      data: produtosComCustom, // backward compatibility
      distribuidores: listaDistribuidores, // Lista de nomes de todos os distribuidores
      total: produtosComCustom.length,
      is_cotista: true,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    console.error('[API] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
