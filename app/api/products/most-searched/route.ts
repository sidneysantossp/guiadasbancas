import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '24');
    
    const supabase = supabaseAdmin;
    
    // Buscar produtos do banco de dados com JOIN para bancas
    // Otimização: limitar a 20 produtos em vez de 5000
    // Ordenar por created_at desc para pegar produtos recentes (simulando "trending")
    let query = supabase
      .from('products')
      .select(`
        id,
        name,
        price,
        price_original,
        discount_percent,
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
        distribuidores!distribuidor_id(nome),
        bancas!banca_id(name, cover_image, avatar:cover_image, contact:whatsapp)
      `)
      .eq('active', true)
      .order('created_at', { ascending: false }); // Produtos mais recentes primeiro

    // Aplicar filtros no banco se existirem
    if (category) {
      // Filtrar no banco se possível, ou manter memória se complexo
      // Como category_id é string, podemos usar ilike
      query = query.ilike('category_id', `%${category}%`);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,codigo_mercos.ilike.%${searchTerm}%`);
    }

    query = query.limit(limit || 20); // Limitar no banco
    
    const { data: items, error } = await query;
    
    if (error) {
      console.error('[SEARCH] Erro ao buscar produtos:', error);
      return NextResponse.json({ ok: false, success: false, error: error.message }, { status: 500 });
    }
    
    // Map reduzido para o front com informações da banca extraídas do JOIN
    const data = (items || []).map((p: any) => {
      const categoryName = p.categories?.name || '';
      const distributorName = p.distribuidores?.nome || '';
      const bancaData = p.bancas || {};
      const bancaName = bancaData.name || distributorName || 'Banca';
      const bancaAvatar = bancaData.cover_image || bancaData.avatar || null;
      const bancaPhone = bancaData.contact || null; // Ajustar conforme estrutura do JOIN (pode vir como objeto ou string dependendo do select)
      // O select pede 'contact:whatsapp', então deve vir como 'contact'
      
      return {
        id: p.id,
        name: p.name,
        price: p.price,
        price_original: p.price_original,
        images: p.images || [],
        banca_id: p.banca_id,
        distribuidor_id: p.distribuidor_id,
        distribuidor_nome: distributorName,
        category_id: p.category_id,
        category: categoryName,
        description: p.description || '',
        rating_avg: null,
        reviews_count: 0,
        stock_qty: p.stock_qty ?? null,
        track_stock: p.track_stock ?? false,
        sob_encomenda: false,
        pre_venda: false,
        pronta_entrega: true,
        discount_percent: p.discount_percent,
        // Informações da banca já populadas
        banca: {
          id: p.banca_id || p.distribuidor_id,
          name: bancaName,
          avatar: bancaAvatar,
          phone: bancaPhone
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
