import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

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
    
    // Log específico para debug das categorias de homologação
    const targetCategory1 = categorias?.find(cat => cat.nome && cat.nome.includes('0855e8eb'));
    const targetCategory2 = categorias?.find(cat => cat.nome && cat.nome.includes('0819565d'));
    
    if (targetCategory1) {
      console.log(`[CATEGORIAS-API] 🎯 Categoria "0855e8eb" ENCONTRADA: "${targetCategory1.nome}"`);
      const position1 = categorias?.findIndex(cat => cat.nome && cat.nome.includes('0855e8eb'));
      console.log(`[CATEGORIAS-API] 📍 Posição da categoria 0855e8eb: ${position1 + 1}`);
    } else {
      console.log(`[CATEGORIAS-API] ❌ Categoria "0855e8eb" NÃO encontrada na resposta`);
    }
    
    if (targetCategory2) {
      console.log(`[CATEGORIAS-API] 🎯 Categoria "0819565d" ENCONTRADA: "${targetCategory2.nome}"`);
      const position2 = categorias?.findIndex(cat => cat.nome && cat.nome.includes('0819565d'));
      console.log(`[CATEGORIAS-API] 📍 Posição da categoria 0819565d: ${position2 + 1}`);
    } else {
      console.log(`[CATEGORIAS-API] ❌ Categoria "0819565d" NÃO encontrada na resposta`);
    }
    
    // Log das primeiras 10 categorias para debug completo
    console.log(`[CATEGORIAS-API] 🔍 Primeiras 10 categorias:`, 
      categorias?.slice(0, 10).map((cat, index) => `${index + 1}. ${cat.nome}`) || []);

    const response = NextResponse.json({
      success: true,
      data: categorias || [],
      debug: {
        total: categorias?.length || 0,
        count: count,
        distribuidor_id: params.id,
        has_0855e8eb: !!targetCategory1,
        position_0855e8eb: targetCategory1 ? categorias?.findIndex(cat => cat.nome && cat.nome.includes('0855e8eb')) + 1 : null,
        has_0819565d: !!targetCategory2,
        position_0819565d: targetCategory2 ? categorias?.findIndex(cat => cat.nome && cat.nome.includes('0819565d')) + 1 : null
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
