import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { auth } from '@/lib/auth';
import { getActiveBancaRowForUser } from "@/lib/jornaleiro-banca";

export const dynamic = 'force-dynamic';

// GET /api/jornaleiro/relatorios/cotista
// Estatísticas de produtos para cotistas
export async function GET(req: NextRequest) {
  try {
    // Obter sessão do NextAuth
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const supabase = supabaseAdmin;
    const userId = session.user.id;

    // Buscar banca do jornaleiro
    const banca = await getActiveBancaRowForUser(userId, 'id, user_id, is_cotista, cotista_id');

    if (!banca) {
      return NextResponse.json(
        { success: false, error: 'Banca não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se é cotista
    if (!banca.is_cotista || !banca.cotista_id) {
      return NextResponse.json(
        { success: false, error: 'Apenas cotistas podem acessar este relatório' },
        { status: 403 }
      );
    }

    const bancaId = banca.id;

    // 1. Buscar produtos próprios da banca
    const { data: produtosProprios } = await supabase
      .from('products')
      .select('id, price')
      .eq('banca_id', bancaId)
      .eq('active', true)
      .is('distribuidor_id', null);

    // 2. Buscar TODOS os produtos de distribuidor
    const { data: produtosDistribuidor } = await supabase
      .from('products')
      .select('id, price')
      .not('distribuidor_id', 'is', null)
      .eq('active', true);

    // 3. Buscar customizações desta banca
    const { data: customizacoes } = await supabase
      .from('banca_produtos_distribuidor')
      .select('product_id, enabled, custom_price, custom_stock_enabled')
      .eq('banca_id', bancaId);

    // Mapear customizações
    const customMap = new Map(
      (customizacoes || []).map(c => [c.product_id, c])
    );

    // Calcular estatísticas
    const produtosHabilitados = (produtosDistribuidor || []).filter(p => {
      const custom = customMap.get(p.id);
      return !custom || custom.enabled !== false;
    });

    const produtosDesabilitados = (produtosDistribuidor || []).filter(p => {
      const custom = customMap.get(p.id);
      return custom && custom.enabled === false;
    });

    const produtosCustomizados = (customizacoes || []).filter(c => 
      c.custom_price !== null || c.custom_stock_enabled === true
    );

    const produtosEstoqueProprio = (customizacoes || []).filter(c => 
      c.custom_stock_enabled === true
    );

    // Calcular valores
    let valorOriginal = 0;
    let valorCustomizado = 0;

    produtosHabilitados.forEach(produto => {
      const custom = customMap.get(produto.id);
      const precoOriginal = Number(produto.price) || 0;
      const precoCustom = custom?.custom_price ? Number(custom.custom_price) : precoOriginal;
      
      valorOriginal += precoOriginal;
      valorCustomizado += precoCustom;
    });

    const economiaPrecoCustom = valorCustomizado - valorOriginal;

    const stats = {
      total_produtos: (produtosProprios?.length || 0) + produtosHabilitados.length,
      produtos_proprios: produtosProprios?.length || 0,
      produtos_distribuidores: produtosHabilitados.length,
      produtos_customizados: produtosCustomizados.length,
      produtos_desabilitados: produtosDesabilitados.length,
      produtos_estoque_proprio: produtosEstoqueProprio.length,
      valor_catalogo_original: valorOriginal,
      valor_catalogo_customizado: valorCustomizado,
      economia_preco_custom: economiaPrecoCustom,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('[API] Erro ao gerar relatório:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
