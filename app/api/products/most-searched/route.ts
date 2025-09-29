import { NextRequest, NextResponse } from "next/server";
import { readProducts, type ProdutoItem } from "@/lib/server/productsStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '24');
    
    let items: ProdutoItem[] = await readProducts();
    if (!items.length) {
      const legacy = (globalThis as any).__PRODUCTS_STORE__ as ProdutoItem[] | undefined;
      if (Array.isArray(legacy) && legacy.length) items = legacy;
    }
    
    // Filtrar por categoria se especificada
    let filtered = [...items].filter(p => p.active !== false);
    
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
        return p.name.toLowerCase().includes(searchTerm) ||
               (p.description || '').toLowerCase().includes(searchTerm) ||
               (p.category_id || '').toLowerCase().includes(searchTerm);
      });
    }
    
    // Heurística simples de "mais buscados": ordena por reviews_count desc, depois rating_avg desc, depois featured
    const sorted = filtered
      .sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0) || (b.rating_avg || 0) - (a.rating_avg || 0) || (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      .slice(0, limit);

    // Map reduzido para o front com informações da banca
    const data = sorted.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      price_original: (p as any).price_original ?? null,
      images: p.images || [],
      banca_id: p.banca_id,
      category_id: p.category_id,
      category: p.category_id, // Para compatibilidade
      description: p.description || '',
      rating_avg: p.rating_avg || null,
      reviews_count: p.reviews_count || 0,
      stock_qty: p.stock_qty ?? null,
      track_stock: p.track_stock ?? false,
      sob_encomenda: (p as any).sob_encomenda ?? false,
      pre_venda: (p as any).pre_venda ?? false,
      pronta_entrega: (p as any).pronta_entrega ?? false,
      discount_percent: (p as any).discount_percent ?? null,
      // Informações mock da banca para o slider
      banca: {
        id: p.banca_id,
        name: getBancaName(p.banca_id),
        avatar: null
      }
    }));
    
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
