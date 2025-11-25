import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 segundos para processar várias bancas

// Geocodifica um endereço usando Nominatim
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", address);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "br");
    
    const res = await fetch(url.toString(), {
      headers: { 
        "Accept-Language": "pt-BR", 
        "User-Agent": "guiadasbancas/0.1" 
      },
      cache: 'no-store'
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    
    if (Array.isArray(data) && data.length > 0 && data[0].lat && data[0].lon) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Geocodifica usando CEP via BrasilAPI
async function geocodeByCep(cep: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return null;
    
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`, { cache: 'no-store' });
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data?.location?.coordinates?.latitude && data?.location?.coordinates?.longitude) {
      return {
        lat: parseFloat(data.location.coordinates.latitude),
        lng: parseFloat(data.location.coordinates.longitude)
      };
    }
    
    // Se BrasilAPI não tem coordenadas, tentar geocodificar pelo endereço
    if (data?.city && data?.state) {
      const address = [data.street, data.neighborhood, data.city, data.state, 'Brasil']
        .filter(Boolean)
        .join(', ');
      return geocodeAddress(address);
    }
    
    return null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação admin
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== "Bearer admin-token") {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    // Buscar bancas com coordenadas padrão de São Paulo ou sem coordenadas
    const { data: bancas, error } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, cep, lat, lng')
      .or('lat.is.null,lng.is.null,and(lat.eq.-23.5505,lng.eq.-46.6333)');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!bancas || bancas.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Todas as bancas já têm coordenadas válidas",
        updated: 0 
      });
    }

    const results: Array<{ id: string; name: string; status: string; lat?: number; lng?: number }> = [];

    for (const banca of bancas) {
      let coords: { lat: number; lng: number } | null = null;

      // 1. Tentar pelo CEP
      if (banca.cep) {
        coords = await geocodeByCep(banca.cep);
        if (coords) {
          console.log(`[Geocode] ${banca.name}: coordenadas obtidas via CEP`);
        }
      }

      // 2. Se não conseguiu pelo CEP, tentar pelo endereço
      if (!coords && banca.address) {
        coords = await geocodeAddress(`${banca.address}, Brasil`);
        if (coords) {
          console.log(`[Geocode] ${banca.name}: coordenadas obtidas via endereço`);
        }
      }

      // 3. Atualizar no banco se conseguiu geocodificar
      if (coords) {
        const { error: updateError } = await supabaseAdmin
          .from('bancas')
          .update({ lat: coords.lat, lng: coords.lng })
          .eq('id', banca.id);

        if (updateError) {
          results.push({ id: banca.id, name: banca.name, status: `erro: ${updateError.message}` });
        } else {
          results.push({ id: banca.id, name: banca.name, status: 'atualizado', lat: coords.lat, lng: coords.lng });
        }
      } else {
        results.push({ id: banca.id, name: banca.name, status: 'não encontrado' });
      }

      // Throttle para não sobrecarregar APIs externas
      await new Promise(r => setTimeout(r, 300));
    }

    const updated = results.filter(r => r.status === 'atualizado').length;
    
    return NextResponse.json({ 
      success: true, 
      message: `${updated} de ${bancas.length} bancas atualizadas`,
      updated,
      total: bancas.length,
      results 
    });

  } catch (err: any) {
    console.error('[Geocode API] Erro:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// GET para verificar quais bancas precisam de geocodificação
export async function GET(request: NextRequest) {
  try {
    const { data: bancas, error } = await supabaseAdmin
      .from('bancas')
      .select('id, name, address, cep, lat, lng')
      .or('lat.is.null,lng.is.null,and(lat.eq.-23.5505,lng.eq.-46.6333)');

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      count: bancas?.length || 0,
      bancas: bancas || []
    });

  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
