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
    const isCotista = banca.is_cotista === true && banca.cotista_id;
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

    // Buscar todos os produtos de distribuidores com info do distribuidor e categoria
    const { data: produtos, error: prodError } = await supabase
      .from('products')
      .select(`
        id, name, description, price, stock_qty, images, mercos_id, distribuidor_id, 
        track_stock, pronta_entrega, sob_encomenda, pre_venda, created_at, category_id,
        distribuidores:distribuidor_id(name),
        categories:category_id(name)
      `)
      .not('distribuidor_id', 'is', null)
      .order('created_at', { ascending: false });

    if (prodError) {
      console.error('[API] Erro ao buscar produtos:', prodError.message);
      return NextResponse.json(
        { success: false, error: prodError.message },
        { status: 500 }
      );
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
    const produtosComCustom = produtos?.map(produto => {
      const custom = customMap.get(produto.id);
      
      // Extrair nomes de objetos nested
      const distribuidor_nome = (produto.distribuidores as any)?.name || null;
      const category_name = (produto.categories as any)?.name || null;
      
      // Remover objetos nested para evitar problemas no frontend
      const { distribuidores, categories, ...produtoLimpo } = produto as any;
      
      return {
        ...produtoLimpo,
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
