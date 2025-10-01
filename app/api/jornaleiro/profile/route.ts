import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Helper para pegar user_id do header de autenticação
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ") || !supabase) {
    return null;
  }

  const token = authHeader.substring(7);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  return user;
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

    if (!supabase) {
      return NextResponse.json({ error: "Serviço indisponível" }, { status: 503 });
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabase
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

    // Verificar se é jornaleiro
    if ((profile as any).role !== "jornaleiro") {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Buscar banca associada
    const { data: banca, error: bancaError } = await supabase
      .from("bancas")
      .select("*")
      .eq("user_id", user.id)
      .single() as any;

    return NextResponse.json({
      success: true,
      profile,
      banca: banca || null,
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
    
    if (!user || !supabase) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profile: profileUpdates, banca: bancaUpdates } = body;

    // Buscar perfil atual
    const { data: currentProfile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single() as any;

    if (!currentProfile || (currentProfile as any).role !== "jornaleiro") {
      return NextResponse.json(
        { error: "Acesso negado" },
        { status: 403 }
      );
    }

    // Atualizar perfil se houver dados
    if (profileUpdates) {
      const { error: profileError } = await (supabase
        .from("user_profiles")
        .update({
          full_name: profileUpdates.full_name,
          phone: profileUpdates.phone,
          avatar_url: profileUpdates.avatar_url,
        } as any)
        .eq("id", user.id) as any);

      if (profileError) {
        throw profileError;
      }
    }

    // Atualizar ou criar banca
    if (bancaUpdates) {
      // Verificar se já existe banca
      const { data: existingBanca } = await (supabase
        .from("bancas")
        .select("id")
        .eq("user_id", user.id)
        .single() as any);

      if (existingBanca) {
        // Atualizar banca existente
        const { error: bancaError } = await (supabase
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
        const { error: bancaError } = await (supabase
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
        const { data: newBanca } = await (supabase
          .from("bancas")
          .select("id")
          .eq("user_id", user.id)
          .single() as any);

        if (newBanca) {
          await (supabase
            .from("user_profiles")
            .update({ banca_id: (newBanca as any).id } as any)
            .eq("id", user.id) as any);
        }
      }
    }

    // Buscar dados atualizados
    const { data: updatedProfile } = await (supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single() as any);

    const { data: updatedBanca } = await (supabase
      .from("bancas")
      .select("*")
      .eq("user_id", user.id)
      .single() as any);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      banca: updatedBanca,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
