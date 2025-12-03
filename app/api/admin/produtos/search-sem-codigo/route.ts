import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/produtos/search-sem-codigo
 * Busca produtos por nome, mercos_id ou codigo_mercos
 * Útil para encontrar produtos que não têm codigo_mercos para upload manual
 * 
 * NOTA: Sem autenticação de API - proteção é feita no client-side (páginas admin)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseAdmin;

    const url = new URL(req.url);
    const searchTerm = url.searchParams.get('q') || '';
    const distribuidorId = url.searchParams.get('distribuidor_id');
    const somenteVazios = url.searchParams.get('somente_vazios') === 'true';

    if (!searchTerm && !somenteVazios) {
      return NextResponse.json(
        { error: 'Informe um termo de busca ou use somente_vazios=true' },
        { status: 400 }
      );
    }

    let query = supabaseAdmin
      .from('products')
      .select('id, name, mercos_id, codigo_mercos, images, distribuidor_id')
      .order('name');

    // Filtrar por distribuidor se informado
    if (distribuidorId) {
      query = query.eq('distribuidor_id', distribuidorId);
    }

    // Se buscar apenas produtos sem codigo_mercos
    if (somenteVazios) {
      query = query.is('codigo_mercos', null);
    } else {
      // Buscar por termo
      const numericSearch = parseInt(searchTerm);
      if (!isNaN(numericSearch)) {
        // Se for número, buscar por mercos_id
        query = query.eq('mercos_id', numericSearch);
      } else {
        // Se não, buscar por nome ou codigo_mercos (aceita parcial)
        // Usa ilike para case-insensitive e % para busca parcial
        query = query.or(`name.ilike.%${searchTerm}%,codigo_mercos.ilike.%${searchTerm}%`);
      }
    }
    
    console.log('[SEARCH-SEM-CODIGO] Termo de busca:', searchTerm);

    query = query.limit(50);

    const { data: produtos, error } = await query;

    console.log('[SEARCH-SEM-CODIGO] Produtos encontrados:', produtos?.length || 0);

    if (error) {
      console.error('[SEARCH-SEM-CODIGO] Erro:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    if (!produtos || produtos.length === 0) {
      return NextResponse.json({
        success: true,
        produtos: [],
        total: 0,
        message: 'Nenhum produto encontrado com esse termo',
      });
    }

    // Buscar nomes dos distribuidores
    const distribuidorIds = [...new Set((produtos || []).map(p => p.distribuidor_id).filter(Boolean))];
    
    let distribuidoresMap = new Map();
    
    if (distribuidorIds.length > 0) {
      const { data: distribuidores } = await supabase
        .from('distribuidores')
        .select('id, nome')
        .in('id', distribuidorIds);
      
      console.log('[SEARCH-SEM-CODIGO] Distribuidores encontrados:', distribuidores);
      
      distribuidoresMap = new Map(
        (distribuidores || []).map((d: any) => [d.id, d.nome])
      );
    }

    // Formatar resposta
    const produtosFormatados = (produtos || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      mercos_id: p.mercos_id,
      codigo_mercos: p.codigo_mercos,
      images: p.images || [],
      distribuidor_name: distribuidoresMap.get(p.distribuidor_id) || 'Sem distribuidor',
    }));

    return NextResponse.json({
      success: true,
      produtos: produtosFormatados,
      total: produtosFormatados.length,
    });
  } catch (error: any) {
    console.error('[SEARCH-SEM-CODIGO] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
