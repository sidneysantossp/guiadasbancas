import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`[CATEGORIAS-API] 🔍 Buscando categorias para distribuidor: ${params.id}`);
    
    const { data: categorias, error } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*')
      .eq('distribuidor_id', params.id)
      .order('nome', { ascending: true });

    if (error) {
      console.error('[CATEGORIAS-API] ❌ Erro ao buscar categorias:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log(`[CATEGORIAS-API] ✅ Encontradas ${categorias?.length || 0} categorias`);
    
    // Log específico para debug da categoria 0855e8eb
    const targetCategory = categorias?.find(cat => cat.nome && cat.nome.includes('0855e8eb'));
    if (targetCategory) {
      console.log(`[CATEGORIAS-API] 🎯 Categoria "0855e8eb" ENCONTRADA: "${targetCategory.nome}"`);
    } else {
      console.log(`[CATEGORIAS-API] ❌ Categoria "0855e8eb" NÃO encontrada na resposta`);
    }

    return NextResponse.json({
      success: true,
      data: categorias || [],
      debug: {
        total: categorias?.length || 0,
        distribuidor_id: params.id,
        has_0855e8eb: !!targetCategory
      }
    });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
