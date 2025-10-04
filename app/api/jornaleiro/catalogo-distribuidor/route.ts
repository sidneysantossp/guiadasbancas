import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';

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

    // Buscar banca do jornaleiro (pela tabela bancas, não user_profiles)
    const { data: banca } = await supabase
      .from('bancas')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!banca) {
      console.error('[CATALOGO] Banca não encontrada para userId:', userId);
      return NextResponse.json(
        { success: false, error: 'Banca não encontrada' },
        { status: 404 }
      );
    }

    const bancaId = banca.id;
    console.log('[CATALOGO] Banca encontrada:', bancaId);

    // Buscar todos os produtos de distribuidores
    const { data: produtos, error: prodError } = await supabase
      .from('products')
      .select('id, name, description, price, stock_qty, images, mercos_id, distribuidor_id, track_stock, pronta_entrega, sob_encomenda, pre_venda, created_at')
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
      
      return {
        ...produto,
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

    return NextResponse.json({
      success: true,
      data: produtosComCustom,
      total: produtosComCustom.length,
    });
  } catch (error: any) {
    console.error('[API] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
