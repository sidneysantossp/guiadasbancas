import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export type AdminBanca = {
  id: string;
  name: string;
  address?: string;
  cep?: string;
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
  // Admin-only helper fields
  user_id?: string | null;
  ownerEmail?: string | null;
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
      cep: banca.cep,
      lat: typeof banca.lat === 'number' ? banca.lat : (banca.lat != null ? parseFloat(banca.lat) : undefined),
      lng: typeof banca.lng === 'number' ? banca.lng : (banca.lng != null ? parseFloat(banca.lng) : undefined),
      cover: banca.cover_image || '',
      avatar: banca.cover_image || '',
      description: banca.address,
      addressObj: banca.addressObj || undefined,
      location: banca.location || undefined,
      categories: banca.categories || [],
      active: banca.active !== false, // Usar valor real do banco
      order: banca.order || 0,
      createdAt: banca.created_at,
      user_id: banca.user_id || null
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

    // Enriquecer com email do jornaleiro (dono) quando possível
    let ownerEmail: string | null = null;
    try {
      // Garantir que temos user_id; se não, buscar diretamente a banca
      let ownerId = it.user_id as string | undefined;
      if (!ownerId) {
        const { data: rawBanca } = await supabaseAdmin
          .from('bancas')
          .select('user_id')
          .eq('id', it.id)
          .single();
        ownerId = rawBanca?.user_id as string | undefined;
      }
      if (ownerId) {
        const { data: userData, error: getErr } = await supabaseAdmin.auth.admin.getUserById(ownerId);
        if (!getErr && userData?.user?.email) {
          ownerEmail = userData.user.email;
        }
      }
    } catch {}

    return NextResponse.json({ success: true, data: { ...it, ownerEmail } });
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
      lat: (data.lat != null ? Number(data.lat) : (data.location?.lat != null ? Number(data.location.lat) : -23.5505)),
      lng: (data.lng != null ? Number(data.lng) : (data.location?.lng != null ? Number(data.location.lng) : -46.6333)),
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
      lat: (data.lat != null ? Number(data.lat) : (data.location?.lat != null ? Number(data.location.lat) : undefined)),
      lng: (data.lng != null ? Number(data.lng) : (data.location?.lng != null ? Number(data.location.lng) : undefined)),
      cover_image: data.cover || data.images?.cover,
      description: data.description || null,
      whatsapp: data.contact?.whatsapp || null,
      facebook: data.socials?.facebook || null,
      instagram: data.socials?.instagram || null,
      gmb: data.socials?.gmb || null,
      hours: data.hours || null,
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
