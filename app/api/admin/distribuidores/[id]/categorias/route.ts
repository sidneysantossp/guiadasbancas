import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`[CATEGORIAS-API] 🔍 Buscando categorias para distribuidor: ${params.id}`);
    
    // Forçar busca sem limite e sem cache
    const { data: categorias, error, count } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*', { count: 'exact' })
      .eq('distribuidor_id', params.id)
      .order('nome', { ascending: true })
      .limit(1000); // Limite explícito alto para garantir

    if (error) {
      console.error('[CATEGORIAS-API] ❌ Erro ao buscar categorias:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(`[CATEGORIAS-API] ✅ Encontradas ${categorias?.length || 0} categorias (count: ${count})`);
    
    // Log específico para debug da categoria 0855e8eb
    const targetCategory = categorias?.find(cat => cat.nome && cat.nome.includes('0855e8eb'));
    if (targetCategory) {
      console.log(`[CATEGORIAS-API] 🎯 Categoria "0855e8eb" ENCONTRADA: "${targetCategory.nome}"`);
      // Encontrar posição da categoria
      const position = categorias?.findIndex(cat => cat.nome && cat.nome.includes('0855e8eb'));
      console.log(`[CATEGORIAS-API] 📍 Posição da categoria: ${position + 1}`);
    } else {
      console.log(`[CATEGORIAS-API] ❌ Categoria "0855e8eb" NÃO encontrada na resposta`);
      // Log das primeiras 5 categorias para debug
      console.log(`[CATEGORIAS-API] 🔍 Primeiras 5 categorias:`, 
        categorias?.slice(0, 5).map(cat => cat.nome) || []);
    }

    const response = NextResponse.json({
      success: true,
      data: categorias || [],
      debug: {
        total: categorias?.length || 0,
        count: count,
        distribuidor_id: params.id,
        has_0855e8eb: !!targetCategory,
        position_0855e8eb: targetCategory ? categorias?.findIndex(cat => cat.nome && cat.nome.includes('0855e8eb')) + 1 : null
      }
    });

    // Headers para evitar cache
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
