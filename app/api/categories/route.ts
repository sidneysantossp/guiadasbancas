import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { categories as fallbackCategories } from "@/components/categoriesData";

export const revalidate = 300;

export type PublicCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
};

export async function GET(_request: NextRequest) {
  const cacheHeaders = {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
  };

  try {
    console.log('[API Categories] Iniciando busca...');
    
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('id, name, image, link, order, visible')
      .eq('active', true)
      .eq('visible', true)
      .order('order', { ascending: true });

    // Log detalhado
    console.log('[API Categories] Resultado:', {
      error: error ? error.message : null,
      dataLength: data?.length || 0,
      data: data
    });

    // Se houver erro de conexão/permissão, usar fallback
    if (error) {
      console.error('[API Categories] Erro ao buscar categorias:', error);
      
      const fallbackData = fallbackCategories.map((cat, index) => ({
        id: cat.slug,
        name: cat.name,
        image: cat.image || '',
        link: `/categorias/${cat.slug}`,
        order: index
      }));
      
      return NextResponse.json(
        { success: true, data: fallbackData, source: 'fallback-error' },
        { headers: cacheHeaders }
      );
    }

    // Se não houver erro, retornar os dados (mesmo que vazio)
    // Só usar fallback se realmente não houver nenhuma categoria cadastrada
    if (!data || data.length === 0) {
      console.log('[API Categories] Nenhuma categoria cadastrada, usando fallback');
      
      const fallbackData = fallbackCategories.map((cat, index) => ({
        id: cat.slug,
        name: cat.name,
        image: cat.image || '',
        link: `/categorias/${cat.slug}`,
        order: index
      }));
      
      return NextResponse.json(
        { success: true, data: fallbackData, source: 'fallback-empty' },
        { headers: cacheHeaders }
      );
    }

    console.log(`[API Categories] Retornando ${data.length} categorias visíveis do banco`);
    return NextResponse.json(
      { success: true, data, source: 'database' },
      { headers: cacheHeaders }
    );
  } catch (e) {
    console.error('[API Categories] Exception:', e);
    
    // Retornar fallback em caso de exceção
    const fallbackData = fallbackCategories.map((cat, index) => ({
      id: cat.slug,
      name: cat.name,
      image: cat.image || '',
      link: `/categorias/${cat.slug}`,
      order: index
    }));
    
    return NextResponse.json(
      { success: true, data: fallbackData, source: 'fallback-exception' },
      { headers: cacheHeaders }
    );
  }
}
