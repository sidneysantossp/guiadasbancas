import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { AdminBanca } from "@/app/api/admin/bancas/route";

async function loadBancaForUser(userId: string): Promise<AdminBanca | null> {
  try {
    // Buscar banca pelo user_id
    const { data, error } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      console.log("Banca não encontrada para user_id:", userId, error?.message);
      return null;
    }
    
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
  } catch (e) {
    console.error("Erro ao carregar banca:", e);
    return null;
  }
}


export async function GET(request: NextRequest) {
  // Usar NextAuth para pegar o usuário autenticado
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const banca = await loadBancaForUser(session.user.id);
  if (!banca) {
    return NextResponse.json({ success: false, error: "Banca não encontrada para este usuário" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: banca });
}

export async function PUT(request: NextRequest) {
  // Usar NextAuth para pegar o usuário autenticado
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
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

    // Atualizar banca pelo user_id
    const { data: updatedData, error } = await supabaseAdmin
      .from('bancas')
      .update(updateData)
      .eq('user_id', session.user.id)
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
