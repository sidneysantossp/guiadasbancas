import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

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

async function readStore(): Promise<StoreBanca[]> {
  try {
    if (!supabaseAdmin) return [];
    
    const { data, error } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .order('name');

    if (error || !data) {
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
      active: true, // Assumindo que todas as bancas no DB são ativas
      order: 0
    }));
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  try {
    if (!supabase) {
      return NextResponse.json([]);
    }

    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lng = url.searchParams.get("lng");
    const radiusKm = url.searchParams.get("radiusKm");

    let query = supabase
      .from('bancas')
      .select('*');

    // Se temos coordenadas e raio, aplicar filtro geográfico
    if (lat && lng && radiusKm) {
      const la = parseFloat(lat);
      const ln = parseFloat(lng);
      const r = parseFloat(radiusKm);
      
      if (!Number.isNaN(la) && !Number.isNaN(ln) && !Number.isNaN(r)) {
        const degLat = r / 111; // approx degrees per km
        const degLng = r / (111 * Math.cos((la * Math.PI) / 180));
        
        query = query
          .gte('lat', la - degLat)
          .lte('lat', la + degLat)
          .gte('lng', ln - degLng)
          .lte('lng', ln + degLng);
      }
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Erro ao buscar bancas:', error);
      return NextResponse.json([]);
    }

    // Transformar para o formato esperado
    const list = (data as any[] || []).map((banca: any) => ({
      id: banca.id,
      name: banca.name,
      address: banca.address,
      lat: banca.lat,
      lng: banca.lng,
      cover: banca.cover_image || '',
      avatar: banca.cover_image || '',
      description: banca.address,
      categories: banca.categories || [],
      active: true,
      order: 0
    }));

    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro ao listar bancas" }, { status: 500 });
  }
}

// POST desabilitado na API pública; criação é via /api/admin/bancas
