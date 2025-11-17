import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

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
      .select(`
        id,
        name,
        mercos_id,
        codigo_mercos,
        images,
        distribuidor:distribuidores!distribuidor_id (
          name
        )
      `)
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
        // Se não, buscar por nome ou codigo_mercos
        query = query.or(`name.ilike.%${searchTerm}%,codigo_mercos.ilike.%${searchTerm}%`);
      }
    }

    query = query.limit(50);

    const { data: produtos, error } = await query;

    if (error) {
      console.error('[SEARCH-SEM-CODIGO] Erro:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    // Formatar resposta
    const produtosFormatados = (produtos || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      mercos_id: p.mercos_id,
      codigo_mercos: p.codigo_mercos,
      images: p.images || [],
      distribuidor_name: p.distribuidor?.name || 'Sem distribuidor',
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
