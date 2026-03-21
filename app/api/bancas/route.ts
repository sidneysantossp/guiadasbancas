import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type StoreBanca = { 
  id: string; 
  name: string; 
  address?: string; 
  lat?: number; 
  lng?: number; 
  cover: string; 
  avatar?: string; 
  description?: string; 
  categories?: string[]; 
  active: boolean; 
  order: number; 
};

async function fetchPublishedBancas() {
  if (!supabaseAdmin) return [] as any[];

  const baseQuery = () =>
    supabaseAdmin
      .from('bancas')
      .select('*')
      .eq('active', true);

  const approvedResult = await baseQuery()
    .eq('approved', true)
    .order('name');

  if (!approvedResult.error && approvedResult.data && approvedResult.data.length > 0) {
    return approvedResult.data as any[];
  }

  const fallbackResult = await baseQuery().order('name');
  if (fallbackResult.error || !fallbackResult.data) {
    return [];
  }

  return fallbackResult.data as any[];
}

async function readStore(): Promise<StoreBanca[]> {
  try {
    if (!supabaseAdmin) return [];

    const data = await fetchPublishedBancas();
    if (!data || data.length === 0) {
      return [];
    }

    return (data as any[]).map((banca: any) => ({
      id: banca.id,
      name: banca.name,
      address: banca.address,
      lat: banca.lat,
      lng: banca.lng,
      cover: banca.cover_image || '',
      avatar: banca.cover_image || '',
      description: banca.address,
      categories: banca.categories || [],
      active: banca.active !== false,
      order: banca.order || 0
    }));
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json([]);
    }

    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const radiusKm = url.searchParams.get("radiusKm");

    const allPublishedBancas = await fetchPublishedBancas();
    let filteredBancas = allPublishedBancas;

    // Se temos coordenadas e raio, aplicar filtro geográfico
    if (lat && lng && radiusKm) {
      const la = parseFloat(lat);
      const ln = parseFloat(lng);
      const r = parseFloat(radiusKm);
      
      if (!Number.isNaN(la) && !Number.isNaN(ln) && !Number.isNaN(r)) {
        const degLat = r / 111; // approx degrees per km
        const degLng = r / (111 * Math.cos((la * Math.PI) / 180));
        
        filteredBancas = allPublishedBancas.filter((banca: any) => {
          const bancaLat = typeof banca?.lat === 'number' ? banca.lat : Number(banca?.lat);
          const bancaLng = typeof banca?.lng === 'number' ? banca.lng : Number(banca?.lng);
          if (Number.isNaN(bancaLat) || Number.isNaN(bancaLng)) return false;
          return (
            bancaLat >= la - degLat &&
            bancaLat <= la + degLat &&
            bancaLng >= ln - degLng &&
            bancaLng <= ln + degLng
          );
        });
      }
    }

    // Transformar para o formato esperado
    const list = (filteredBancas as any[] || []).map((banca: any) => ({
      id: banca.id,
      name: banca.name,
      address: banca.address,
      lat: banca.lat,
      lng: banca.lng,
      cover: banca.cover_image || '',
      cover_image: banca.cover_image || '',
      avatar: banca.avatar || banca.cover_image || '',
      description: banca.address,
      categories: banca.categories || [],
      active: banca.active !== false,
      order: banca.order || 0,
      is_cotista: banca.is_cotista || false,
      cotista_id: banca.cotista_id || null
    }));

    return NextResponse.json({ data: list });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao listar bancas" }, { status: 500 });
  }
}

// POST desabilitado na API pública; criação é via /api/admin/bancas
