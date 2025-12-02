import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import type { AdminBanca } from "@/app/api/admin/bancas/route";

// Parser robusto de endereço brasileiro
// Aceita formatos como:
// - "Rua Exemplo, 1234 - Bairro, Cidade - SP"
// - "Rua Exemplo, Comp, 1234 - Bairro - Cidade - UF"
function smartParseAddress(fullAddress: string, cep: string) {
  // Inicializar objeto vazio
  const result = {
    cep: cep || '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    uf: '',
    complement: ''
  };
  
  if (!fullAddress) return result;

  try {
    // Tentar separar por " - " primeiro (separador maior)
    const parts = fullAddress.split(' - ').map((p: string) => p.trim());
    
    // Parte 1: Rua, Complemento, Número
    const streetPart = parts[0];
    
    if (streetPart) {
      const streetComponents = streetPart.split(',').map((s: string) => s.trim());
      
      if (streetComponents.length >= 3) {
        // Caso: Rua, Complemento, Número
        result.street = streetComponents[0];
        result.complement = streetComponents.slice(1, -1).join(', '); // Pega tudo do meio como complemento
        result.number = streetComponents[streetComponents.length - 1];
      } else if (streetComponents.length === 2) {
        // Caso: Rua, Número
        result.street = streetComponents[0];
        result.number = streetComponents[1];
      } else {
        // Caso: Apenas Rua
        result.street = streetPart;
      }
    }
    
    // Parte 2: Bairro (se existir)
    if (parts.length > 1) {
      const p2 = parts[1];
      const looksLikeUF = /^[A-Z]{2}$/.test(p2);
      
      if (!looksLikeUF) {
        result.neighborhood = p2;
      }
    }
    
    // Procurar UF no final
    const lastPart = parts[parts.length - 1];
    if (/^[A-Z]{2}$/.test(lastPart)) {
      result.uf = lastPart;
      
      // Se tem UF, o anterior pode ser cidade
      if (parts.length >= 3) {
        const penultPart = parts[parts.length - 2];
        if (penultPart !== result.neighborhood && penultPart !== streetPart) {
           result.city = penultPart;
        }
      }
    }
    
    return result;
  } catch (e) {
    console.error('Erro no smartParseAddress:', e);
    return result;
  }
}

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
      is_cotista: data.is_cotista,
      cotista_razao_social: data.cotista_razao_social,
      MATCH: data.user_id === userId ? '✅ CORRETO' : '❌ ERRO: user_id não bate!'
    });
    
    // 🚨 VALIDAÇÃO CRÍTICA: Garantir que o Supabase retornou a banca certa
    if (data.user_id !== userId) {
      console.error("[loadBancaForUser] 🚨🚨🚨 ERRO CRÍTICO: Supabase retornou banca de outro usuário!");
      console.error("[loadBancaForUser] user_id esperado:", userId);
      console.error("[loadBancaForUser] user_id retornado:", data.user_id);
      console.error("[loadBancaForUser] BLOQUEANDO por segurança!");
      return null;
    }
    
    // Buscar perfil do usuário para trazer phone/cpf
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('user_profiles')
      .select('full_name, phone, cpf, avatar_url, updated_at')
      .eq('id', userId)
      .single();
    if (profileErr) {
      console.warn('[loadBancaForUser] ⚠️ Não foi possível carregar profile:', profileErr.message);
    }

    // 🔥 CRITICAL: Usar address_obj do banco se existir (JSON salvo)
    // Senão, criar addressObj vazio (não usar parseAddressString que confunde campos)
    let addressObj;
    
    if (data.address_obj && typeof data.address_obj === 'object') {
      // Usar dados estruturados salvos no banco
      addressObj = data.address_obj;
      console.log('[GET] ✅ Usando address_obj do banco:', addressObj);
    } else {
      // Fallback: Usar parser inteligente para recuperar dados da string
      addressObj = smartParseAddress(data.address || '', data.cep || '');
      console.log('[GET] ⚠️ address_obj não encontrado no banco, usando smartParseAddress:', addressObj);
    }
    
    const result = {
      id: data.id,
      user_id: data.user_id, // 🚨 INCLUIR user_id para validação no frontend
      email: data.email, // 🚨 INCLUIR email para validação
      name: data.name || '',
      description: data.description || '',
      tpu_url: data.tpu_url || '',
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
      updated_at: data.updated_at,
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
      // Dados do cotista
      is_cotista: data.is_cotista || false,
      cotista_id: data.cotista_id || null,
      cotista_codigo: data.cotista_codigo || null,
      cotista_razao_social: data.cotista_razao_social || null,
      cotista_cnpj_cpf: data.cotista_cnpj_cpf || null,
      // Perfil (para preencher formulário mesmo se /profile falhar)
      profile: {
        full_name: (profile as any)?.full_name || '',
        phone: (profile as any)?.phone || '',
        cpf: (profile as any)?.cpf || '',
        avatar_url: (profile as any)?.avatar_url || '',
        updated_at: (profile as any)?.updated_at || null,
      },
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
  
  // 🚨 SEGURANÇA CRÍTICA: BLOQUEAR se os dados não batem
  if (banca.email && session.user.email && banca.email !== session.user.email) {
    console.error('🚨🚨🚨 ALERTA DE SEGURANÇA: EMAIL NÃO BATE! 🚨🚨🚨');
    console.error('[SECURITY] Email do usuário autenticado:', session.user.email);
    console.error('[SECURITY] Email da banca retornada:', banca.email);
    console.error('[SECURITY] user_id da sessão:', session.user.id);
    console.error('[SECURITY] user_id da banca:', banca.user_id);
    console.error('[SECURITY] banca_id:', banca.id);
    console.error('🚨🚨🚨 BLOQUEANDO ACESSO - VAZAMENTO DE DADOS DETECTADO! 🚨🚨🚨');
    
    // BLOQUEAR COMPLETAMENTE - NÃO RETORNAR DADOS DE OUTRA BANCA
    return NextResponse.json({ 
      success: false, 
      error: "Erro de validação de segurança. Faça logout e login novamente.",
      details: "EMAIL_MISMATCH"
    }, { status: 403 });
  }
  
  // Validação adicional: verificar user_id
  if (banca.user_id && banca.user_id !== session.user.id) {
    console.error('🚨🚨🚨 ALERTA DE SEGURANÇA: USER_ID NÃO BATE! 🚨🚨🚨');
    console.error('[SECURITY] user_id esperado:', session.user.id);
    console.error('[SECURITY] user_id da banca:', banca.user_id);
    console.error('🚨🚨🚨 BLOQUEANDO ACESSO! 🚨🚨🚨');
    
    return NextResponse.json({ 
      success: false, 
      error: "Erro de validação de segurança. Faça logout e login novamente.",
      details: "USER_ID_MISMATCH"
    }, { status: 403 });
  }
  
  console.log('========== [API /jornaleiro/banca GET] FIM ==========\n');
  
  return NextResponse.json(
    { success: true, data: banca },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    }
  );
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
    console.log('[PUT] 🏠 addressObj recebido:', data.addressObj);
    
    console.log('Dados recebidos para atualização:', JSON.stringify(data, null, 2));

    // Normalizar endereço para o padrão: "Rua, Número - Bairro, Cidade - UF"
    const numberNeighborhood = [
      data.addressObj?.number,
      data.addressObj?.neighborhood
    ].filter(Boolean).join(' - ');

    const cityUf = [
      data.addressObj?.city,
      data.addressObj?.uf
    ].filter(Boolean).join(' - ');

    // Incluir complemento na string address se existir
    const streetWithComplement = data.addressObj?.complement 
      ? `${data.addressObj?.street}, ${data.addressObj.complement}`
      : data.addressObj?.street;

    const fullAddress = [
      streetWithComplement,
      numberNeighborhood || undefined,
      cityUf || undefined
    ].filter(Boolean).join(', ');

    console.log('[PUT] 🏠 fullAddress montado:', fullAddress);
    console.log('[PUT] 🏠 numberNeighborhood:', numberNeighborhood);
    console.log('[PUT] 🏠 cityUf:', cityUf);

    // LOG: Verificar o que está sendo enviado
    console.log('[PUT] 🖼️  Imagens recebidas:', {
      cover_from_images: data.images?.cover,
      cover_from_data: data.cover,
      avatar_from_images: data.images?.avatar,
      avatar_from_data: data.avatar
    });

    // Preparar dados para atualização no Supabase
    // APENAS campos que sabemos que existem na tabela bancas
    const updateData: any = {};

    // Campos de texto básicos
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.tpu_url) updateData.tpu_url = data.tpu_url;
    
    // Endereço (apenas address e cep)
    if (fullAddress) updateData.address = fullAddress;
    if (data.addressObj?.cep) updateData.cep = data.addressObj.cep;
    
    // 🔥 CRITICAL: NÃO tentar salvar JSON em coluna que pode não existir
    // Confiar apenas na string address concatenada e no parser inteligente
    // if (data.addressObj) {
    //   updateData.address_obj = data.addressObj;
    // }
    
    console.log('[PUT] ℹ️ Salvando apenas string address concatenada (compatibilidade máxima)');
    
    // Localização
    if (data.location?.lat) updateData.lat = data.location.lat;
    if (data.location?.lng) updateData.lng = data.location.lng;
    
    // Arrays e objetos
    if (data.categories) updateData.categories = data.categories;
    if (data.payments) updateData.payment_methods = data.payments;
    if (data.hours) updateData.hours = data.hours;
    
    // Contato e redes sociais
    if (data.contact?.whatsapp) updateData.whatsapp = data.contact.whatsapp;
    if (data.socials?.instagram) updateData.instagram = data.socials.instagram;
    if (data.socials?.facebook) updateData.facebook = data.socials.facebook;
    
    // Delivery
    if (data.delivery_enabled !== undefined) updateData.delivery_enabled = data.delivery_enabled;
    if (data.free_shipping_threshold) updateData.free_shipping_threshold = data.free_shipping_threshold;
    if (data.origin_cep) updateData.origin_cep = data.origin_cep;
    
    // Cotista info
    if (data.is_cotista !== undefined) updateData.is_cotista = data.is_cotista;
    if (data.cotista_id) updateData.cotista_id = data.cotista_id;
    if (data.cotista_codigo) updateData.cotista_codigo = data.cotista_codigo;
    if (data.cotista_razao_social) updateData.cotista_razao_social = data.cotista_razao_social;
    if (data.cotista_cnpj_cpf) updateData.cotista_cnpj_cpf = data.cotista_cnpj_cpf;
    
    // Timestamp sempre
    updateData.updated_at = new Date().toISOString();
    
    console.log('[PUT] 👥 Salvando is_cotista:', updateData.is_cotista);
    console.log('[PUT] 🏢 Salvando cotista_id:', updateData.cotista_id);

    // REMOVIDO: addressObj não existe na tabela bancas
    // Dados do endereço são salvos no campo 'address' (string) e campos individuais se existirem
    console.log('[PUT] ℹ️  addressObj não é salvo (coluna não existe), usando apenas address string');

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

    // Não remover campos - já construímos updateData apenas com campos que existem

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
    
    // 🔥 CRITICAL: Usar address_obj salvo no banco OU reconstruir com smart parser
    // Como removemos o salvamento do JSON, precisamos confiar no smart parser
    let updatedAddressObj = updatedData.address_obj;
    
    if (!updatedAddressObj) {
       updatedAddressObj = smartParseAddress(updatedData.address || '', updatedData.cep || '');
       console.log('[PUT] ⚠️ address_obj não salvo, reconstruído com smartParseAddress:', updatedAddressObj);
    } else {
       console.log('[PUT] ✅ Retornando address_obj salvo:', updatedAddressObj);
    }

    // Retornar dados formatados para o frontend
    const responseData = {
      ...updatedData,
      cover: updatedData.cover_image,
      avatar: updatedData.profile_image,
      addressObj: updatedAddressObj,
      images: {
        cover: updatedData.cover_image,
        avatar: updatedData.profile_image
      }
    };
    
    console.log('Retornando para o frontend:', responseData);

    return NextResponse.json(
      { success: true, data: responseData },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
        },
      }
    );
  } catch (e: any) {
    console.error('Update banca API error (jornaleiro):', e);
    return NextResponse.json({ 
      success: false, 
      error: e?.message || "Erro ao atualizar banca",
      stack: e?.stack
    }, { status: 500 });
  }
}
