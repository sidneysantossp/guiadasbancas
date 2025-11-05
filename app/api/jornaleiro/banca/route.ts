import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { AdminBanca } from "@/app/api/admin/bancas/route";

async function loadBancaForUser(userId: string): Promise<any> {
  try {
    console.log('[loadBancaForUser] Buscando banca para user_id:', userId);
    
    // Buscar banca pelo user_id
    const { data, error } = await supabaseAdmin
      .from('bancas')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      console.error("[loadBancaForUser] ❌ Banca NÃO encontrada para user_id:", userId);
      console.error("[loadBancaForUser] Erro Supabase:", error?.message, error?.code);
      return null;
    }
    
    console.log("[loadBancaForUser] ✅ Banca encontrada:", {
      banca_id: data.id,
      banca_name: data.name,
      banca_user_id: data.user_id,
      email: data.email,
      MATCH: data.user_id === userId ? '✅ CORRETO' : '❌ ERRO: user_id não bate!'
    });
    
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
  console.log('\n========== [API /jornaleiro/banca GET] INÍCIO ==========');
  
  // Usar NextAuth para pegar o usuário autenticado
  const session = await auth();
  
  console.log('[GET] 🔐 Sessão recebida:', {
    existe: !!session,
    user_existe: !!session?.user,
    user_id: session?.user?.id,
    user_email: session?.user?.email,
    user_name: session?.user?.name
  });
  
  if (!session?.user?.id) {
    console.error('[GET] ❌ ERRO: Usuário não autenticado');
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  console.log('[GET] ✅ Usuário autenticado:', session.user.email);
  console.log('[GET] 🔍 Buscando banca para user_id:', session.user.id);
  
  const banca = await loadBancaForUser(session.user.id);
  
  if (!banca) {
    console.error('[GET] ❌ Banca não encontrada para user_id:', session.user.id);
    console.error('[GET] Email do usuário:', session.user.email);
    return NextResponse.json({ success: false, error: "Banca não encontrada para este usuário" }, { status: 404 });
  }

  console.log('[GET] ✅ Banca carregada:', {
    banca_id: banca.id,
    banca_name: banca.name,
    banca_email: banca.email,
    user_autenticado: session.user.email
  });
  
  // SEGURANÇA CRÍTICA: Verificar se os emails batem
  if (banca.email && session.user.email && banca.email !== session.user.email) {
    console.error('🚨🚨🚨 ALERTA DE SEGURANÇA: EMAIL NÃO BATE! 🚨🚨🚨');
    console.error('[SECURITY] Email do usuário autenticado:', session.user.email);
    console.error('[SECURITY] Email da banca retornada:', banca.email);
    console.error('[SECURITY] user_id:', session.user.id);
    console.error('[SECURITY] banca_id:', banca.id);
    console.error('🚨🚨🚨 POSSÍVEL VAZAMENTO DE DADOS! 🚨🚨🚨');
  }
  
  console.log('========== [API /jornaleiro/banca GET] FIM ==========\n');
  
  return NextResponse.json({ success: true, data: banca });
}

export async function PUT(request: NextRequest) {
  // Usar NextAuth para pegar o usuário autenticado
  const session = await auth();
  
  console.log('[PUT] Autenticando usuário...');
  console.log('[PUT] Session:', session);
  
  if (!session?.user?.id) {
    console.error('[PUT] Usuário não autenticado');
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  console.log('[PUT] Usuário autenticado com sucesso!');
  console.log('[PUT] Recebendo dados para atualização...');
  
  try {
    const body = await request.json();
    const data = body?.data ?? body;
    
    console.log('[PUT] Dados recebidos:', data);
    
    console.log('Dados recebidos para atualização:', JSON.stringify(data, null, 2));

    // Preparar endereço completo
    const fullAddress = [
      data.addressObj?.street,
      data.addressObj?.number,
      data.addressObj?.neighborhood,
      data.addressObj?.city,
      data.addressObj?.uf
    ].filter(Boolean).join(', ');

    // LOG: Verificar o que está sendo enviado
    console.log('[PUT] 🖼️  Imagens recebidas:', {
      cover_from_images: data.images?.cover,
      cover_from_data: data.cover,
      avatar_from_images: data.images?.avatar,
      avatar_from_data: data.avatar
    });

    // Preparar dados para atualização no Supabase
    // APENAS campos que existem na tabela bancas
    const updateData: any = {
      name: data.name,
      description: data.description,
      address: fullAddress || data.address,
      cep: data.addressObj?.cep || data.cep,
      lat: data.location?.lat || data.lat,
      lng: data.location?.lng || data.lng,
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

    // CRÍTICO: Imagens são completamente independentes
    // Só atualizar se foi explicitamente enviado (aceita string vazia também)
    if (data.images?.cover !== undefined && data.images?.cover !== null) {
      console.log('[PUT] ✅ Atualizando cover_image:', data.images.cover);
      updateData.cover_image = data.images.cover || null; // null se vazio
    } else {
      console.log('[PUT] ⏭️  cover_image não foi enviado, mantendo valor existente');
    }

    if (data.images?.avatar !== undefined && data.images?.avatar !== null) {
      console.log('[PUT] ✅ Atualizando profile_image:', data.images.avatar);
      updateData.profile_image = data.images.avatar || null; // null se vazio
    } else {
      console.log('[PUT] ⏭️  profile_image não foi enviado, mantendo valor existente');
    }

    // Remover apenas campos básicos que são undefined/null (NÃO imagens)
    Object.keys(updateData).forEach(key => {
      if (key !== 'cover_image' && key !== 'profile_image') {
        if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
          delete updateData[key];
        }
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
