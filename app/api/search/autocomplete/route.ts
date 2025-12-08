import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

// Função para calcular distância entre duas coordenadas (Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '6');
    const bancaId = searchParams.get('banca_id');
    
    // Coordenadas do usuário para cálculo de distância
    const userLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
    const userLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;

    if (!search || search.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const searchTerm = search.toLowerCase();
    const supabase = supabaseAdmin;

    console.log(`[Search API] Buscando por: "${searchTerm}"`);

    type SearchResultItem = {
      type: 'product' | 'banca';
      id: string;
      name: string;
      image: string | null;
      price: number | null;
      category: string;
      banca_name: string;
      banca_id: string;
      address?: string;
      distance?: number; // Distância em km
      banca_lat?: number;
      banca_lng?: number;
    };

    const results: SearchResultItem[] = [];

    // Verificar se o termo de busca corresponde a nomes de bancas
    // Se sim, buscar apenas bancas para evitar misturar resultados
    const { data: bancasCheck, error: bancasCheckError } = await supabase
      .from('bancas')
      .select('name')
      .ilike('name', `%${searchTerm}%`)
      .limit(1);

    const isBancaSearch = !bancasCheckError && bancasCheck && bancasCheck.length > 0;

    console.log(`[Search API] Termo "${searchTerm}" ${isBancaSearch ? 'corresponde a banca' : 'não corresponde a banca'}`);

    // 1. Buscar produtos (apenas se não for busca específica de banca)
    let products = null;
    if (!isBancaSearch) {
      // Usando Left Join (sem !) para não excluir produtos sem categoria/banca
      let productsQuery = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          images,
          banca_id,
          category_id,
          categories(name),
          bancas(name, lat, lng)
        `)
        .eq('active', true)
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(limit);

      if (bancaId) {
        productsQuery = productsQuery.eq('banca_id', bancaId);
      }

      const { data: productsData, error: productsError } = await productsQuery;
      products = productsData;
    } else {
      products = null;
    }

    if (products) {
      products.forEach((p: any) => {
        const bancaLat = p.bancas?.lat ? parseFloat(p.bancas.lat) : null;
        const bancaLng = p.bancas?.lng ? parseFloat(p.bancas.lng) : null;
        let distance: number | undefined;
        
        if (userLat && userLng && bancaLat && bancaLng) {
          distance = calculateDistance(userLat, userLng, bancaLat, bancaLng);
        }
        
        results.push({
          type: 'product',
          id: p.id,
          name: p.name,
          image: p.images && p.images.length > 0 ? p.images[0] : null,
          price: p.price,
          category: p.categories?.name || 'Produto',
          banca_name: p.bancas?.name || 'Banca não identificada',
          banca_id: p.banca_id,
          distance,
          banca_lat: bancaLat ?? undefined,
          banca_lng: bancaLng ?? undefined
        });
      });
    }

    // 2. Buscar bancas (apenas se não estiver filtrando por uma banca específica)
    if (!bancaId) {
      const { data: bancas, error: bancasError } = await supabase
        .from('bancas')
        .select('id, name, cover_image, address, rating, lat, lng')
        .or(`name.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
        .limit(limit);

      if (bancasError) {
        console.error('Erro na busca de bancas:', bancasError);
      } else if (bancas) {
        bancas.forEach((b: any) => {
          const bancaLat = b.lat ? parseFloat(b.lat) : null;
          const bancaLng = b.lng ? parseFloat(b.lng) : null;
          let distance: number | undefined;
          
          if (userLat && userLng && bancaLat && bancaLng) {
            distance = calculateDistance(userLat, userLng, bancaLat, bancaLng);
          }
          
          results.push({
            type: 'banca',
            id: b.id,
            name: b.name,
            image: b.cover_image,
            price: null,
            category: 'Banca',
            banca_name: b.name,
            banca_id: b.id,
            address: b.address,
            distance,
            banca_lat: bancaLat ?? undefined,
            banca_lng: bancaLng ?? undefined
          });
        });
      }
    }

    // Ordenar resultados por proximidade (se tiver coordenadas) e relevância
    results.sort((a, b) => {
      // Se ambos têm distância, ordenar por proximidade
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      // Se apenas um tem distância, priorizar quem tem
      if (a.distance !== undefined && b.distance === undefined) return -1;
      if (a.distance === undefined && b.distance !== undefined) return 1;
      
      // Fallback: ordenar por relevância (nome começa com o termo)
      const aStarts = a.name.toLowerCase().startsWith(searchTerm);
      const bStarts = b.name.toLowerCase().startsWith(searchTerm);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

    // Limitar total de resultados
    const finalResults = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      results: finalResults
    });

  } catch (error: any) {
    console.error('Erro geral na busca:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
