import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('q') || '20057313';
    
    console.log(`🔍 Buscando categoria que começa com: "${searchTerm}"`);
    
    // Buscar categorias que começam com o termo
    const { data: categorias, error } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('*')
      .ilike('nome', `${searchTerm}%`)
      .order('nome', { ascending: true });

    if (error) {
      console.error('❌ Erro na consulta:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    if (!categorias || categorias.length === 0) {
      // Se não encontrou, buscar todas para debug
      const { data: allCategorias } = await supabaseAdmin
        .from('distribuidor_categories')
        .select('nome, mercos_id')
        .order('nome', { ascending: true })
        .limit(20);

      return NextResponse.json({
        success: true,
        found: false,
        message: `Nenhuma categoria encontrada que comece com "${searchTerm}"`,
        searchTerm,
        debug: {
          totalCategorias: allCategorias?.length || 0,
          primeiras20: allCategorias || []
        }
      });
    }

    const resultado = {
      success: true,
      found: true,
      searchTerm,
      totalEncontradas: categorias.length,
      categorias: categorias.map(cat => ({
        id: cat.id,
        mercos_id: cat.mercos_id,
        nome_completo: cat.nome,
        distribuidor_id: cat.distribuidor_id,
        ativo: cat.ativo,
        created_at: cat.created_at
      })),
      resposta: categorias.length > 0 ? categorias[0].nome : null
    };

    console.log(`✅ Encontradas ${categorias.length} categoria(s)`);
    if (categorias.length > 0) {
      console.log(`🎯 Nome completo: "${categorias[0].nome}"`);
    }

    return NextResponse.json(resultado);

  } catch (error: any) {
    console.error('❌ Erro geral:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
