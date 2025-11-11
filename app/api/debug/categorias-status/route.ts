import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const brancaleoneId = '1511df09-1f4a-4e68-9f8c-05cd06be6269';
    
    console.log('[DEBUG-CATEGORIAS] 🔍 Verificando status das categorias...');
    
    // 1. Contar total de categorias
    const { count: totalCount } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', brancaleoneId);
    
    // 2. Buscar primeiras 10 categorias com ordenação
    const { data: primeiras10, error } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, nome, mercos_id, ativo, created_at')
      .eq('distribuidor_id', brancaleoneId)
      .order('nome', { ascending: true })
      .limit(10);
    
    // 3. Buscar especificamente as categorias de homologação
    const { data: homologacaoCategories } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', brancaleoneId)
      .or('nome.ilike.%000000_HOMOLOGACAO%,nome.ilike.%0819565d%,nome.ilike.%0855e8eb%');
    
    // 4. Buscar todas sem limite para verificar total real
    const { data: todasCategorias } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('nome')
      .eq('distribuidor_id', brancaleoneId);
    
    const response = {
      timestamp: new Date().toISOString(),
      distribuidor_id: brancaleoneId,
      status: {
        total_count: totalCount,
        total_real: todasCategorias?.length || 0,
        primeiras_10_encontradas: primeiras10?.length || 0,
        homologacao_encontradas: homologacaoCategories?.length || 0
      },
      primeiras_10: primeiras10?.map((cat, index) => ({
        posicao: index + 1,
        nome: cat.nome,
        mercos_id: cat.mercos_id,
        ativo: cat.ativo,
        created_at: cat.created_at
      })) || [],
      categorias_homologacao: homologacaoCategories?.map(cat => ({
        nome: cat.nome,
        mercos_id: cat.mercos_id,
        ativo: cat.ativo,
        id: cat.id
      })) || [],
      debug_info: {
        api_funcionando: !error,
        error_message: error?.message || null,
        supabase_conectado: true
      }
    };
    
    console.log('[DEBUG-CATEGORIAS] 📊 Status:', {
      total: totalCount,
      primeiras10: primeiras10?.length,
      homologacao: homologacaoCategories?.length
    });
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
  } catch (error: any) {
    console.error('[DEBUG-CATEGORIAS] ❌ Erro:', error);
    return NextResponse.json({
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
