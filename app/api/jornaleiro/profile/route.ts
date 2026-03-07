import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/lib/auth";
import { ensureBancaHasOnboardingPlan } from "@/lib/banca-subscription";

export const dynamic = 'force-dynamic';

// Helper para identificar o usuário autenticado
async function getUserFromRequest(request: NextRequest) {
  console.log('🔐 [getUserFromRequest] Iniciando autenticação...');
  
  // 1) Tentar via Bearer token (Supabase)
  const authHeader = request.headers.get("authorization");
  console.log('🔐 [getUserFromRequest] Auth header:', authHeader ? 'Presente' : 'Ausente');
  
  if (authHeader?.startsWith("Bearer ") && supabaseAdmin) {
    try {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (!error && user) {
        console.log('✅ [getUserFromRequest] Autenticado via Bearer token:', user.id);
        return user as any;
      }
      console.log('❌ [getUserFromRequest] Erro no Bearer token:', error);
    } catch (err) {
      console.error('❌ [getUserFromRequest] Exceção no Bearer token:', err);
    }
  }

  // 2) Fallback: sessão padrão do app (NextAuth/Auth.js)
  try {
    console.log('🔐 [getUserFromRequest] Tentando NextAuth session...');
    const session = await auth();
    console.log('🔐 [getUserFromRequest] Session:', session ? 'Presente' : 'Ausente');
    
    if ((session as any)?.user?.id) {
      console.log('✅ [getUserFromRequest] Autenticado via NextAuth:', (session as any).user.id);
      return { id: (session as any).user.id, email: (session as any).user.email } as any;
    }
  } catch (err) {
    console.error('❌ [getUserFromRequest] Erro no NextAuth:', err);
  }

  console.error('❌ [getUserFromRequest] Nenhum método de autenticação funcionou');
  return null;
}

// GET - Buscar perfil e banca do jornaleiro
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Serviço indisponível" }, { status: 503 });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Perfil não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se é jornaleiro (aceitando roles legadas como 'seller')
    const role = (profile as any).role;
    const isJornaleiroRole = role === 'jornaleiro' || role === 'seller';
    if (typeof role !== 'undefined' && !isJornaleiroRole) {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Buscar banca associada
    const { data: banca, error: bancaError } = await supabaseAdmin
      .from("bancas")
      .select("*")
      .eq("user_id", user.id)
      .single() as any;

    return NextResponse.json({
      success: true,
      profile,
      banca: banca || null,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar perfil e banca do jornaleiro
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user || !supabaseAdmin) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profile: profileUpdates, banca: bancaUpdates } = body;

    console.log('📥 [API Profile PUT] Body recebido:', body);
    console.log('📥 [API Profile PUT] profileUpdates:', profileUpdates);
    console.log('📥 [API Profile PUT] User ID:', user.id);

    // Buscar perfil atual
    const { data: currentProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single() as any;

    console.log('👤 [API Profile PUT] Perfil atual:', currentProfile);

    // Verificar se é jornaleiro (aceitando roles legadas como 'seller')
    const role = (currentProfile as any)?.role;
    const isJornaleiroRole = role === 'jornaleiro' || role === 'seller';
    
    if (!currentProfile || !isJornaleiroRole) {
      console.error('❌ [API Profile PUT] Acesso negado - role:', role, '- não é jornaleiro/seller');
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Atualizar perfil se houver dados
    if (profileUpdates) {
      console.log('💾 [API Profile PUT] Atualizando perfil com dados:', {
        full_name: profileUpdates.full_name,
        phone: profileUpdates.phone,
        cpf: profileUpdates.cpf,
        avatar_url: profileUpdates.avatar_url,
      });

      const { data: updatedProfile, error: profileError, count } = await (supabaseAdmin
        .from("user_profiles")
        .update({
          full_name: profileUpdates.full_name,
          phone: profileUpdates.phone,
          cpf: profileUpdates.cpf,
          avatar_url: profileUpdates.avatar_url,
        } as any)
        .eq("id", user.id)
        .select() as any);

      if (profileError) {
        console.error('❌ [API Profile PUT] Erro ao atualizar perfil:', profileError);
        throw profileError;
      }

      console.log('✅ [API Profile PUT] Perfil atualizado com sucesso!');
      console.log('📊 [API Profile PUT] Linhas afetadas:', updatedProfile?.length || 0);
      console.log('📝 [API Profile PUT] Dados atualizados:', updatedProfile);
      
      if (!updatedProfile || updatedProfile.length === 0) {
        console.error('⚠️ [API Profile PUT] AVISO: Nenhuma linha foi atualizada! Possível problema de RLS ou user_id incorreto.');
      }
    } else {
      console.log('⏭️  [API Profile PUT] Nenhum dado de perfil para atualizar');
    }

    // Atualizar ou criar banca
    if (bancaUpdates) {
      // Verificar se já existe banca
      const { data: existingBanca } = await (supabaseAdmin
        .from("bancas")
        .select("id")
        .eq("user_id", user.id)
        .single() as any);

      if (existingBanca) {
        // Atualizar banca existente
        const { error: bancaError } = await (supabaseAdmin
          .from("bancas")
          .update({
            name: bancaUpdates.name,
            description: bancaUpdates.description,
            logo_url: bancaUpdates.logo_url,
            cover_image: bancaUpdates.cover_image,
            phone: bancaUpdates.phone,
            whatsapp: bancaUpdates.whatsapp,
            email: bancaUpdates.email,
            instagram: bancaUpdates.instagram,
            facebook: bancaUpdates.facebook,
            cep: bancaUpdates.cep,
            address: bancaUpdates.address,
            lat: bancaUpdates.lat,
            lng: bancaUpdates.lng,
            opening_hours: bancaUpdates.opening_hours,
            delivery_fee: bancaUpdates.delivery_fee,
            min_order_value: bancaUpdates.min_order_value,
            delivery_radius: bancaUpdates.delivery_radius,
            preparation_time: bancaUpdates.preparation_time,
            payment_methods: bancaUpdates.payment_methods,
          } as any)
          .eq("id", (existingBanca as any).id) as any);

        if (bancaError) {
          throw bancaError;
        }
      } else {
        // Criar nova banca
        const { error: bancaError } = await (supabaseAdmin
          .from("bancas")
          .insert({
            user_id: user.id,
            name: bancaUpdates.name,
            description: bancaUpdates.description,
            logo_url: bancaUpdates.logo_url,
            cover_image: bancaUpdates.cover_image,
            phone: bancaUpdates.phone,
            whatsapp: bancaUpdates.whatsapp,
            email: bancaUpdates.email,
            instagram: bancaUpdates.instagram,
            facebook: bancaUpdates.facebook,
            cep: bancaUpdates.cep || "00000-000",
            address: bancaUpdates.address || "Endereço não informado",
            lat: bancaUpdates.lat || -23.5505,
            lng: bancaUpdates.lng || -46.6333,
            opening_hours: bancaUpdates.opening_hours,
            delivery_fee: bancaUpdates.delivery_fee || 0,
            min_order_value: bancaUpdates.min_order_value || 0,
            delivery_radius: bancaUpdates.delivery_radius || 5,
            preparation_time: bancaUpdates.preparation_time || 30,
            payment_methods: bancaUpdates.payment_methods || ["pix", "dinheiro"],
            active: false, // Aguardando aprovação
            approved: false,
          } as any) as any);

        if (bancaError) {
          throw bancaError;
        }

        // Atualizar perfil com banca_id
        const { data: newBanca } = await (supabaseAdmin
          .from("bancas")
          .select("id")
          .eq("user_id", user.id)
          .single() as any);

        if (newBanca) {
          await (supabaseAdmin
            .from("user_profiles")
            .update({ banca_id: (newBanca as any).id } as any)
            .eq("id", user.id) as any);

          try {
            await ensureBancaHasOnboardingPlan((newBanca as any).id);
          } catch (subscriptionError: any) {
            console.warn(
              "[API Profile PUT] ⚠️ Banca criada, mas não foi possível atribuir plano inicial:",
              subscriptionError?.message || subscriptionError
            );
          }
        }
      }
    }

    // Buscar dados atualizados
    console.log('🔄 [API Profile PUT] Buscando dados atualizados...');
    
    const { data: updatedProfile } = await (supabaseAdmin
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single() as any);

    const { data: updatedBanca } = await (supabaseAdmin
      .from("bancas")
      .select("*")
      .eq("user_id", user.id)
      .single() as any);

    if ((updatedBanca as any)?.id) {
      try {
        await ensureBancaHasOnboardingPlan((updatedBanca as any).id);
      } catch (subscriptionError: any) {
        console.warn(
          "[API Profile PUT] ⚠️ Não foi possível garantir plano inicial após atualização:",
          subscriptionError?.message || subscriptionError
        );
      }
    }

    console.log('✅ [API Profile PUT] Dados atualizados:', {
      profile: updatedProfile,
      banca: updatedBanca
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      banca: updatedBanca,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
