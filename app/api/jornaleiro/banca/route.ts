import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import type { AdminBanca } from "@/app/api/admin/bancas/route";

const SELLER_TOKEN = "seller-token";
const SELLER_BANCA_MAP: Record<string, string> = {
  "seller-001": "banca-1758901610179",
};

function extractSellerId(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  if (!token) return null;
  if (token === SELLER_TOKEN) return "seller-001";
  return null;
}

async function loadBancaForSeller(sellerId: string): Promise<AdminBanca | null> {
  try {
    const bancaId = SELLER_BANCA_MAP[sellerId];
    if (!bancaId || !supabaseAdmin) return null;
    const { data, error } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .eq('id', bancaId)
      .single();
    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      cover: data.cover_image || '',
      avatar: data.cover_image || '',
      description: data.address,
      categories: data.categories || [],
      active: data.active !== false,
      order: data.order || 0,
      createdAt: data.created_at,
    } as AdminBanca;
  } catch {
    return null;
  }
}


export async function GET(request: NextRequest) {
  const sellerId = extractSellerId(request);
  if (!sellerId) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const banca = await loadBancaForSeller(sellerId);
  if (!banca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: banca });
}

export async function PUT(request: NextRequest) {
  const sellerId = extractSellerId(request);
  if (!sellerId) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const bancaId = SELLER_BANCA_MAP[sellerId];
  if (!bancaId || !supabaseAdmin) {
    return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const data = body?.data ?? body;

    // Preparar dados para atualização no Supabase
    const updateData: any = {
      name: data.name,
      address: data.address || data.addressObj?.street,
      cep: data.addressObj?.cep || data.cep,
      lat: data.lat || data.location?.lat,
      lng: data.lng || data.location?.lng,
      cover_image: data.cover || data.images?.cover,
      avatar: data.avatar || data.images?.avatar,
      categories: data.categories || [],
      active: data.active !== false,
      featured: data.featured || false,
      updated_at: new Date().toISOString()
    };

    // Remover campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data: updatedData, error } = await supabaseAdmin
      .from('bancas')
      .update(updateData)
      .eq('id', bancaId)
      .select()
      .single();

    if (error) {
      console.error('Update banca error (jornaleiro):', error);
      return NextResponse.json({ success: false, error: 'Erro ao atualizar banca' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (e: any) {
    console.error('Update banca API error (jornaleiro):', e);
    return NextResponse.json({ success: false, error: e?.message || "Erro ao atualizar banca" }, { status: 500 });
  }
}
