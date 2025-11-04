import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = supabaseAdmin;
    const searchParams = request.nextUrl.searchParams;
    
    // Parâmetros de paginação
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log(`[API] Buscando produtos do distribuidor: ${params.id} (limit: ${limit}, offset: ${offset})`);

    // Buscar contagem total
    const { count: totalCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', params.id);

    // Buscar produtos vinculados ao distribuidor com paginação
    const { data: produtos, error } = await supabase
      .from('products')
      .select('id,name,description,price,stock_qty,images,mercos_id,distribuidor_id,created_at,sincronizado_em,origem,category_id')
      .eq('distribuidor_id', params.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    console.log(`[API] Produtos encontrados: ${produtos?.length || 0} de ${totalCount || 0} total`);

    // Buscar categorias do distribuidor para mapear os nomes
    const { data: categorias } = await supabase
      .from('distribuidor_categories')
      .select('id, nome')
      .eq('distribuidor_id', params.id);

    console.log(`[API] Categorias encontradas: ${categorias?.length || 0}`);

    const categoriasMap = new Map();
    if (categorias) {
      categorias.forEach(cat => {
        categoriasMap.set(cat.id, cat.nome);
      });
    }

    console.log(`[API] Mapa de categorias criado com ${categoriasMap.size} entradas`);

    // Adicionar nome da categoria aos produtos
    const produtosComCategoria = produtos?.map(p => ({
      ...p,
      categoria_nome: p.category_id ? (categoriasMap.get(p.category_id) || 'Sem Categoria') : 'Sem Categoria',
    })) || [];

    console.log(`[API] Produtos com categoria mapeados: ${produtosComCategoria.length}`);

    if (error) {
      console.error('[API] Erro ao buscar produtos:', error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: produtosComCategoria,
      total: totalCount || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('[API] Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
