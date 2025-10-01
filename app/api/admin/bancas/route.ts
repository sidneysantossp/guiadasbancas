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
  const list = includeInactive ? items : items.filter((c) => c.active);

  // GET by ID
  if (id) {
    const it = list.find((b) => b.id === id || b.id.endsWith(id));
    if (!it) return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    return NextResponse.json({ success: true, data: it });
  }

  return NextResponse.json({ success: true, data: list.sort((a,b)=>a.order-b.order) });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ success: false, error: "Funcionalidade não implementada para Supabase" }, { status: 501 });
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ success: false, error: "Funcionalidade não implementada para Supabase" }, { status: 501 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: false, error: "Funcionalidade não implementada para Supabase" }, { status: 501 });
}
