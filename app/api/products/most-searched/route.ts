import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '24');
    
    const supabase = supabaseAdmin;
    
    // Buscar produtos do banco de dados
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        images,
        banca_id,
        distribuidor_id,
        category_id,
        description,
        stock_qty,
        track_stock,
        active,
        codigo_mercos,
        categories!category_id(name),
        distribuidores!distribuidor_id(nome)
      `)
      .eq('active', true)
      .limit(5000); // Limite alto para buscar todos os produtos disponíveis
    
    const { data: items, error } = await query;
    
    if (error) {
      console.error('[SEARCH] Erro ao buscar produtos:', error);
      return NextResponse.json({ ok: false, success: false, error: error.message }, { status: 500 });
    }
    
    // Filtrar por categoria se especificada
    let filtered = [...(items || [])].filter(p => p.active !== false);
    
    if (category) {
      filtered = filtered.filter(p => {
        const productCategory = p.category_id || '';
        return productCategory.toLowerCase().includes(category.toLowerCase());
      });
    }
    
    // Filtrar por busca se especificada
    if (search) {
      filtered = filtered.filter(p => {
        const searchTerm = search.toLowerCase();
        const categoryName = (p.categories as any)?.name || '';
        const distributorName = (p.distribuidores as any)?.nome || '';
        
        return p.name.toLowerCase().includes(searchTerm) ||
               (p.description || '').toLowerCase().includes(searchTerm) ||
               (p.codigo_mercos || '').toLowerCase().includes(searchTerm) ||
               categoryName.toLowerCase().includes(searchTerm) ||
               distributorName.toLowerCase().includes(searchTerm);
      });
    }
    
    // Ordenar por nome e limitar resultados
    const sorted = filtered
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, limit);

    // Map reduzido para o front com informações da banca
    const data = sorted.map(p => {
      const categoryName = (p.categories as any)?.name || '';
      const distributorName = (p.distribuidores as any)?.nome || '';
      
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        price_original: null,
        images: p.images || [],
        banca_id: p.banca_id,
        distribuidor_id: p.distribuidor_id,
        distribuidor_nome: distributorName,
        category_id: p.category_id,
        category: categoryName, // Nome da categoria para exibição
        description: p.description || '',
        rating_avg: null, // Não implementado ainda
        reviews_count: 0, // Não implementado ainda
        stock_qty: p.stock_qty ?? null,
        track_stock: p.track_stock ?? false,
        sob_encomenda: false,
        pre_venda: false,
        pronta_entrega: true,
        discount_percent: null,
        // Informações da banca/distribuidor
        banca: {
          id: p.banca_id || p.distribuidor_id,
          name: distributorName || getBancaName(p.banca_id),
          avatar: null
        }
      };
    });
    
    return NextResponse.json({ ok: true, success: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, success: false, error: e?.message || "Erro ao buscar produtos" }, { status: 500 });
  }
}

// Função helper para obter nome da banca
function getBancaName(bancaId: string): string {
  const bancaNames: Record<string, string> = {
    'banca-1': 'Banca São Jorge',
    'banca-2': 'Banca Central',
    'banca-3': 'Banca do Centro',
    'seller-1': 'Banca Demo',
    'demo': 'Banca Demo'
  };
  
  return bancaNames[bancaId] || 'Banca';
}
