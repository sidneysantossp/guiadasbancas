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
    console.log('[loadBancaForUser] Buscando banca ativa para user_id:', userId);

    // Buscar profile (inclui banca_id ativa)
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from('user_profiles')
      .select('banca_id, full_name, phone, cpf, avatar_url, updated_at')
      .eq('id', userId)
      .maybeSingle();

    if (profileErr) {
      console.warn('[loadBancaForUser] ⚠️ Não foi possível carregar profile:', profileErr.message);
    }

    const activeBancaId = (profile as any)?.banca_id as string | null | undefined;

    // 1) Tentar carregar pela banca ativa do profile
    let data: any = null;
    let error: any = null;

    if (activeBancaId) {
      const res = await supabaseAdmin
        .from('bancas')
        .select('*')
        .eq('id', activeBancaId)
        .eq('user_id', userId)
        .maybeSingle();

      data = res.data;
      error = res.error;

      if (error) {
        console.warn('[loadBancaForUser] ⚠️ Erro ao buscar banca ativa por ID:', error.message);
      }
    }

    // 2) Fallback: pegar a banca mais recente do usuário
    if (!data) {
      const res = await supabaseAdmin
        .from('bancas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      data = res.data;
      error = res.error;
    }

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

    // 🚨 VALIDAÇÃO CRÍTICA: Garantir que a banca pertence ao usuário
    if (data.user_id !== userId) {
      console.error("[loadBancaForUser] 🚨🚨🚨 ERRO CRÍTICO: Banca pertence a outro usuário!");
      console.error("[loadBancaForUser] user_id esperado:", userId);
      console.error("[loadBancaForUser] user_id retornado:", data.user_id);
      console.error("[loadBancaForUser] BLOQUEANDO por segurança!");
      return null;
    }

    // Se o profile não tinha banca_id ou estava desatualizado, atualizar para a banca carregada
    if ((profile as any)?.banca_id !== data.id) {
      const { error: setErr } = await supabaseAdmin
        .from('user_profiles')
        .update({ banca_id: data.id })
        .eq('id', userId);

      if (setErr) {
        console.warn('[loadBancaForUser] ⚠️ Falha ao atualizar banca_id no profile:', setErr.message);
      }
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
      delivery_fee: data.delivery_fee ?? 0,
      min_order_value: data.min_order_value ?? 0,
      delivery_radius: data.delivery_radius ?? 5,
      preparation_time: data.preparation_time ?? 30,
      payment_methods: data.payment_methods || [],
      whatsapp: data.whatsapp || '',
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

export async function POST(request: NextRequest) {
  console.log('\n========== [API /jornaleiro/banca POST] INÍCIO ==========');
  const session = await auth();

  if (!session?.user?.id) {
    console.error('[POST] ❌ Usuário não autenticado');
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const banca = body?.banca || body;
    const profile = body?.profile || {};

    if (!banca?.name) {
      return NextResponse.json({ success: false, error: "Nome da banca é obrigatório" }, { status: 400 });
    }

    // Se já existe banca vinculada ao usuário, retorna sem recriar
    const existing = await loadBancaForUser(session.user.id);
    if (existing) {
      console.log('[POST] ✅ Banca já existe, retornando existente');
      return NextResponse.json({ success: true, data: existing, alreadyExists: true });
    }

    const now = new Date().toISOString();
    const insertData = {
      user_id: session.user.id,
      name: banca.name || '',
      description: banca.description || '',
      profile_image: banca.profile_image || banca.profileImage || null,
      cover_image: banca.cover_image || banca.coverImage || null,
      phone: banca.phone || null,
      whatsapp: banca.whatsapp || null,
      email: banca.email || session.user.email || null,
      instagram: banca.instagram || null,
      facebook: banca.facebook || null,
      cep: banca.cep || '',
      address: banca.address || '',
      lat: banca.lat ?? banca.location?.lat ?? null,
      lng: banca.lng ?? banca.location?.lng ?? null,
      tpu_url: banca.tpu_url || null,
      hours: banca.hours || null,
      opening_hours: banca.opening_hours || banca.hours || null,
      delivery_fee: banca.delivery_fee ?? 0,
      min_order_value: banca.min_order_value ?? 0,
      delivery_radius: banca.delivery_radius ?? 5,
      preparation_time: banca.preparation_time ?? 30,
      payment_methods: banca.payment_methods || [],
      is_cotista: banca.is_cotista ?? false,
      cotista_id: banca.cotista_id ?? null,
      cotista_codigo: banca.cotista_codigo ?? null,
      cotista_razao_social: banca.cotista_razao_social ?? null,
      cotista_cnpj_cpf: banca.cotista_cnpj_cpf ?? null,
      active: false,
      approved: false,
      created_at: now,
      updated_at: now,
    };

    const { data, error } = await supabaseAdmin
      .from('bancas')
      .insert(insertData)
      .select()
      .single();

    if (error || !data) {
      console.error('[POST] ❌ Erro ao criar banca:', error);
      return NextResponse.json({ success: false, error: error?.message || 'Erro ao criar banca' }, { status: 500 });
    }

    // Atualizar perfil com banca_id e dados básicos
    const profileUpdates: any = { banca_id: data.id };
    if (profile.phone) profileUpdates.phone = profile.phone;
    if (profile.cpf) profileUpdates.cpf = profile.cpf;

    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .update(profileUpdates)
      .eq('id', session.user.id);

    if (profileError) {
      console.error('[POST] ❌ Erro ao atualizar user_profiles:', profileError);
      return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
    }

    console.log('[POST] ✅ Banca criada e perfil atualizado');
    return NextResponse.json({ success: true, data });
  } catch (e: any) {
    console.error('[POST] ❌ Erro inesperado na criação da banca:', e);
    return NextResponse.json({ success: false, error: e?.message || 'Erro inesperado' }, { status: 500 });
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
  
  // 🔐 Segurança: o bloqueio real deve ser por `user_id` (email pode variar entre bancas do mesmo usuário)
  if (banca.email && session.user.email && banca.email !== session.user.email) {
    console.warn('[SECURITY] ⚠️ Email da banca difere do email da conta (permitido):', {
      user_email: session.user.email,
      banca_email: banca.email,
      banca_id: banca.id,
    });
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

    // Descobrir banca ativa do usuário (suporta múltiplas bancas por conta)
    const activeBanca = await loadBancaForUser(session.user.id);
    if (!activeBanca?.id) {
      return NextResponse.json({ success: false, error: "Banca não encontrada" }, { status: 404 });
    }
    
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
    if (data.payment_methods !== undefined) updateData.payment_methods = data.payment_methods;
    if (data.hours) updateData.hours = data.hours;
    
    // Contato e redes sociais
    if (data.contact?.whatsapp) updateData.whatsapp = data.contact.whatsapp;
    if (data.socials?.instagram) updateData.instagram = data.socials.instagram;
    if (data.socials?.facebook) updateData.facebook = data.socials.facebook;
    
    // Delivery
    if (data.delivery_enabled !== undefined) updateData.delivery_enabled = data.delivery_enabled;
    if (data.free_shipping_threshold !== undefined) updateData.free_shipping_threshold = data.free_shipping_threshold;
    if (data.origin_cep !== undefined) updateData.origin_cep = data.origin_cep || null;
    if (data.delivery_fee !== undefined) updateData.delivery_fee = data.delivery_fee;
    if (data.min_order_value !== undefined) updateData.min_order_value = data.min_order_value;
    if (data.delivery_radius !== undefined) updateData.delivery_radius = data.delivery_radius;
    if (data.preparation_time !== undefined) updateData.preparation_time = data.preparation_time;
    
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

    // Atualizar APENAS a banca ativa
    const { data: updatedData, error } = await supabaseAdmin
      .from('bancas')
      .update(updateData)
      .eq('id', activeBanca.id)
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
