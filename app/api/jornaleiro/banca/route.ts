import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { AdminBanca } from "@/app/api/admin/bancas/route";

async function loadBancaForUser(userId: string): Promise<any> {
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
    
    console.log("Dados carregados da banca:", data);
    
    // Parse do endereço completo para addressObj
    const addressParts = (data.address || '').split(', ');
    const addressObj = {
      cep: data.cep || '',
      street: addressParts[0] || '',
      number: addressParts[1] || '',
      neighborhood: addressParts[2] || '',
      city: addressParts[3] || '',
      uf: addressParts[4] || '',
      complement: ''
    };
    
    const result = {
      id: data.id,
      name: data.name || '',
      description: data.description || '',
      address: data.address || '',
      addressObj: addressObj,
      lat: data.lat,
      lng: data.lng,
      location: {
        lat: data.lat,
        lng: data.lng
      },
      cover: data.cover_image || '',
      avatar: data.profile_image || '',
      cover_image: data.cover_image || '',
      profile_image: data.profile_image || '',
      images: {
        cover: data.cover_image || '',
        avatar: data.profile_image || ''
      },
      gallery: [],
      categories: data.categories || [],
      contact: {
        whatsapp: data.whatsapp || ''
      },
      socials: {
        instagram: data.instagram || '',
        facebook: data.facebook || '',
        gmb: ''
      },
      payments: data.payment_methods || [],
      hours: Array.isArray((data as any).hours) ? (data as any).hours : [],
      featured: false,
      ctaUrl: '',
      active: data.active !== false,
      createdAt: data.created_at,
      delivery_enabled: data.delivery_enabled || false,
      free_shipping_threshold: data.free_shipping_threshold || 120,
      origin_cep: data.origin_cep || '',
    };
    
    console.log("Retornando banca com imagens:", {
      cover_image: result.cover_image,
      cover: result.cover,
      avatar: result.avatar
    });
    
    return result;
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

    console.log('Dados recebidos para atualização:', JSON.stringify(data, null, 2));

    // Preparar endereço completo
    const fullAddress = [
      data.addressObj?.street,
      data.addressObj?.number,
      data.addressObj?.neighborhood,
      data.addressObj?.city,
      data.addressObj?.uf
    ].filter(Boolean).join(', ');

    // Preparar dados para atualização no Supabase
    // APENAS campos que existem na tabela bancas
    const updateData: any = {
      name: data.name,
      description: data.description,
      address: fullAddress || data.address,
      cep: data.addressObj?.cep || data.cep,
      lat: data.location?.lat || data.lat,
      lng: data.location?.lng || data.lng,
      cover_image: data.images?.cover || data.cover,
      profile_image: data.images?.avatar || data.avatar, // Avatar redondo separado
      categories: data.categories || [],
      whatsapp: data.contact?.whatsapp,
      instagram: data.socials?.instagram,
      facebook: data.socials?.facebook,
      payment_methods: data.payments || [],
      hours: Array.isArray(data?.hours) ? data.hours : undefined,
      delivery_enabled: data.delivery_enabled !== undefined ? data.delivery_enabled : false,
      free_shipping_threshold: data.free_shipping_threshold || 120,
      origin_cep: data.origin_cep || null,
      updated_at: new Date().toISOString()
    };

    // Remover campos undefined ou null
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key];
      }
    });

    console.log('Dados que serão atualizados no Supabase:', JSON.stringify(updateData, null, 2));

    // Atualizar banca pelo user_id
    const { data: updatedData, error } = await supabaseAdmin
      .from('bancas')
      .update(updateData)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Update banca error (jornaleiro):', error);
      return NextResponse.json({ 
        success: false, 
        error: `Erro ao atualizar banca: ${error.message}`,
        details: error 
      }, { status: 500 });
    }

    console.log('Banca atualizada com sucesso:', updatedData);
    
    // Retornar dados formatados para o frontend
    const responseData = {
      ...updatedData,
      cover: updatedData.cover_image,
      avatar: updatedData.profile_image,
      images: {
        cover: updatedData.cover_image,
        avatar: updatedData.profile_image
      }
    };
    
    console.log('Retornando para o frontend:', responseData);

    return NextResponse.json({ success: true, data: responseData });
  } catch (e: any) {
    console.error('Update banca API error (jornaleiro):', e);
    return NextResponse.json({ 
      success: false, 
      error: e?.message || "Erro ao atualizar banca",
      stack: e?.stack
    }, { status: 500 });
  }
}
