import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name, role } = await request.json();

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: "Email, password, full_name e role são obrigatórios" },
        { status: 400 }
      );
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/jornaleiro/dashboard`,
      },
    });

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Falha ao criar usuário" },
        { status: 500 }
      );
    }

    // Aguardar um pouco para o trigger criar o perfil
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Se for jornaleiro, criar banca de teste
    if (role === "jornaleiro") {
      const { error: bancaError } = await supabase
        .from("bancas")
        .insert({
          user_id: authData.user.id,
          name: `Banca de ${full_name}`,
          cep: "01310-100",
          address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
          lat: -23.5505,
          lng: -46.6333,
          whatsapp: "11999999999",
          email: email,
          delivery_fee: 5.00,
          min_order_value: 10.00,
          delivery_radius: 5,
          preparation_time: 30,
          payment_methods: ["pix", "dinheiro"],
          active: true,
          approved: true, // Auto-aprovar para teste
        });

      if (bancaError) {
        console.error("Erro ao criar banca:", bancaError);
      }

      // Atualizar perfil com banca_id
      const { data: banca } = await supabase
        .from("bancas")
        .select("id")
        .eq("user_id", authData.user.id)
        .single();

      if (banca) {
        await supabase
          .from("user_profiles")
          .update({ banca_id: banca.id })
          .eq("id", authData.user.id);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso!",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        role,
      },
      credentials: {
        email,
        password,
      },
      next_steps: [
        `1. Acesse: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login`,
        `2. Entre com: ${email} / ${password}`,
        "3. Você será redirecionado para o dashboard",
      ],
    });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
