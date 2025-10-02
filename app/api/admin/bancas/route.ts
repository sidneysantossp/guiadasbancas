import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export type AdminBanca = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  cover: string;
  avatar?: string;
  images?: { cover?: string; avatar?: string };
  addressObj?: { cep?: string; street?: string; number?: string; complement?: string; neighborhood?: string; city?: string; uf?: string };
  location?: { lat?: number; lng?: number };
  contact?: { whatsapp?: string };
  socials?: { facebook?: string; instagram?: string; gmb?: string };
  hours?: Array<{ key: string; label: string; open: boolean; start: string; end: string }>;
  rating?: number;
  tags?: string[];
  payments?: string[];
  gallery?: string[];
  featured?: boolean;
  ctaUrl?: string;
  description?: string;
  categories?: string[];
  active: boolean;
  order: number;
  createdAt?: string;
};

async function readBancas(): Promise<AdminBanca[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .order('name');

    if (error || !data) {
      return [];
    }

    return data.map((banca: any) => ({
      id: banca.id,
      name: banca.name,
      address: banca.address,
      lat: banca.lat,
      lng: banca.lng,
      cover: banca.cover_image || '',
      avatar: banca.cover_image || '',
      description: banca.address,
      categories: banca.categories || [],
      active: banca.active !== false, // Usar valor real do banco
      order: banca.order || 0,
      createdAt: banca.created_at
    }));
  } catch {
    return [];
  }
}

function verifyAdminAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  return Boolean(authHeader && authHeader === "Bearer admin-token");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeInactive = searchParams.get("all") === "true";
  const id = searchParams.get("id");
  const items = await readBancas();
  // Para listagem sem filtro de id, respeite o active, a não ser que all=true
  const list = includeInactive ? items : items.filter((c) => c.active);

  // GET by ID
  if (id) {
    // Ao buscar por ID, considerar TODAS (inclusive inativas) para evitar 404 indevido
    const it = items.find((b) => b.id === id || b.id.endsWith(id));
    if (!it) return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    return NextResponse.json({ success: true, data: it });
  }

  return NextResponse.json({ success: true, data: list.sort((a,b)=>a.order-b.order) });
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { data } = body;

    if (!data || !data.name) {
      return NextResponse.json({ success: false, error: "Nome da banca é obrigatório" }, { status: 400 });
    }

    // Preparar dados para inserção
    const insertData: any = {
      name: data.name,
      address: data.address || '',
      cep: data.addressObj?.cep || '00000-000',
      lat: data.lat || data.location?.lat || -23.5505,
      lng: data.lng || data.location?.lng || -46.6333,
      cover_image: data.cover || data.images?.cover,
      categories: data.categories || [],
      active: data.active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: insertedData, error } = await supabaseAdmin
      .from('bancas')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Insert banca error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao criar banca' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: insertedData });
  } catch (error) {
    console.error('Create banca API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { data } = body;

    if (!data || !data.id) {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    // Preparar dados para atualização
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

    // Log para debug
    console.log('Updating banca with data:', updateData);
    console.log('Original data received:', data);

    // Remover campos undefined
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const { data: updatedData, error } = await supabaseAdmin
      .from('bancas')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      console.error('Update banca error:', error);
      return NextResponse.json({ success: false, error: 'Erro ao atualizar banca' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error('Update banca API error:', error);
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: false, error: "Funcionalidade não implementada para Supabase" }, { status: 501 });
}
