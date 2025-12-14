import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '24');

    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
    
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
        bancas!banca_id(name, cover_image, avatar:cover_image, contact:whatsapp, lat, lng)
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

    // Importante: para ordenar por proximidade, buscamos mais itens antes do sort
    const fetchLimit = (userLat && userLng) ? Math.min(Math.max((limit || 20) * 5, (limit || 20)), 200) : (limit || 20);
    query = query.limit(fetchLimit);
    
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

      const bancaLat = bancaData.lat != null ? parseFloat(bancaData.lat) : null;
      const bancaLng = bancaData.lng != null ? parseFloat(bancaData.lng) : null;
      let distance: number | null = null;
      if (userLat && userLng && bancaLat != null && bancaLng != null) {
        distance = calculateDistance(userLat, userLng, bancaLat, bancaLng);
      }
      
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
        distance,
        // Informações da banca já populadas
        banca: {
          id: p.banca_id || p.distribuidor_id,
          name: bancaName,
          avatar: bancaAvatar,
          phone: bancaPhone,
          lat: bancaLat,
          lng: bancaLng
        }
      };
    });

    // Ordenar:
    // - sempre por nome (alfabético)
    // - para nomes iguais, ordenar por distância (quando houver)
    const sorted = data.slice().sort((a: any, b: any) => {
      const nameA = String(a?.name || '');
      const nameB = String(b?.name || '');
      const nameCmp = nameA.localeCompare(nameB, 'pt-BR', { sensitivity: 'base' });
      if (nameCmp !== 0) return nameCmp;

      const ad = typeof a.distance === 'number' ? a.distance : Number.POSITIVE_INFINITY;
      const bd = typeof b.distance === 'number' ? b.distance : Number.POSITIVE_INFINITY;
      if (ad !== bd) return ad - bd;

      return String(a?.id || '').localeCompare(String(b?.id || ''));
    });

    const finalData = sorted.slice(0, limit || 20);
    
    return NextResponse.json({ ok: true, success: true, data: finalData });
  } catch (e: any) {
    return NextResponse.json({ ok: false, success: false, error: e?.message || "Erro ao buscar produtos" }, { status: 500 });
  }
}

// Função para calcular distância entre duas coordenadas (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
