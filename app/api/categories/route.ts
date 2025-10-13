import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { categories as fallbackCategories } from "@/components/categoriesData";

export type PublicCategory = {
  id: string;
  name: string;
  image: string;
  link: string;
  order: number;
};

export async function GET(_request: NextRequest) {
  try {
    console.log('[API Categories] Iniciando busca...');
    
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, image, link, order, visible')
      .eq('active', true)
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
      
      return NextResponse.json({ success: true, data: fallbackData, source: 'fallback-error' });
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
      
      return NextResponse.json({ success: true, data: fallbackData, source: 'fallback-empty' });
    }

    // Filtrar apenas categorias visíveis (visible = true ou null para retrocompatibilidade)
    const visibleData = data.filter((cat: any) => cat.visible !== false);
    
    console.log('[API Categories] Filtro de visibilidade:', {
      total: data.length,
      visible: visibleData.length,
      invisible: data.filter((cat: any) => cat.visible === false).map((c: any) => c.name)
    });
    
    // Se não houver categorias visíveis, usar fallback
    if (visibleData.length === 0) {
      console.log('[API Categories] Nenhuma categoria visível, usando fallback');
      
      const fallbackData = fallbackCategories.map((cat, index) => ({
        id: cat.slug,
        name: cat.name,
        image: cat.image || '',
        link: `/categorias/${cat.slug}`,
        order: index
      }));
      
      return NextResponse.json({ success: true, data: fallbackData, source: 'fallback-invisible' });
    }
    
    console.log(`[API Categories] Retornando ${visibleData.length} categorias do banco`);
    return NextResponse.json({ success: true, data: visibleData, source: 'database' });
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
    
    return NextResponse.json({ success: true, data: fallbackData, source: 'fallback-exception' });
  }
}
