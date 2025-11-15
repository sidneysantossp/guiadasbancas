import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

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

    // Buscar TODOS os produtos de distribuidores com paginação (sem limite de 1000)
    console.log('[CATALOGO] Buscando produtos de distribuidores com paginação...');
    const produtos: any[] = [];
    let hasMore = true;
    let offset = 0;
    const BATCH_SIZE = 1000;

    while (hasMore) {
      const { data: batch, error: prodError } = await supabase
        .from('products')
        .select('id, name, description, price, stock_qty, images, mercos_id, distribuidor_id, track_stock, pronta_entrega, sob_encomenda, pre_venda, created_at, category_id, active')
        .not('distribuidor_id', 'is', null)
        .eq('active', true) // Apenas produtos ativos
        .order('created_at', { ascending: false })
        .range(offset, offset + BATCH_SIZE - 1);

      if (prodError) {
        console.error('[CATALOGO] Erro ao buscar produtos:', prodError.message);
        return NextResponse.json(
          { success: false, error: prodError.message },
          { status: 500 }
        );
      }

      if (batch && batch.length > 0) {
        produtos.push(...batch);
        console.log(`[CATALOGO] Lote ${Math.floor(offset / BATCH_SIZE) + 1}: ${batch.length} produtos`);
        
        if (batch.length < BATCH_SIZE) {
          hasMore = false;
        } else {
          offset += BATCH_SIZE;
        }
      } else {
        hasMore = false;
      }
    }

    console.log(`[CATALOGO] Total de produtos carregados: ${produtos.length}`);

    // Buscar nomes de distribuidores e categorias para mapear manualmente
    const distribuidorIds = Array.from(new Set((produtos || []).map((p: any) => p.distribuidor_id).filter(Boolean)));
    const categoryIds = Array.from(new Set((produtos || []).map((p: any) => p.category_id).filter(Boolean)));

    let distMap = new Map<string, string>();
    let catMap = new Map<string, string>();

    if (distribuidorIds.length > 0) {
      const { data: distRows } = await supabase
        .from('distribuidores')
        .select('id, nome')
        .in('id', distribuidorIds as any);
      distMap = new Map<string, string>((distRows || []).map((d: any) => [d.id, d.nome]));
      console.log(`[CATALOGO] ${distRows?.length || 0} distribuidores mapeados:`, Array.from(distMap.values()));
    }

    if (categoryIds.length > 0) {
      const { data: catRows } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', categoryIds as any);
      catMap = new Map<string, string>((catRows || []).map((c: any) => [c.id, c.name]));
    }

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

      const distribuidor_nome = distMap.get(produto.distribuidor_id) || null;
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
        // Preço original do distribuidor (para comparação)
        distribuidor_price: produto.price,
        // Preço efetivo (customizado ou original)
        effective_price: custom?.custom_price || produto.price,
      };
    }) || [];

    console.log(`[CATALOGO] Cotista - ${produtosComCustom.length} produtos de distribuidores encontrados`);

    return NextResponse.json({
      success: true,
      products: produtosComCustom,
      data: produtosComCustom, // backward compatibility
      total: produtosComCustom.length,
      is_cotista: true,
    });
  } catch (error: any) {
    console.error('[API] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
