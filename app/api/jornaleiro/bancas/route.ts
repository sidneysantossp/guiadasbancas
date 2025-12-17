import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .select("banca_id")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error("[API/JORNALEIRO/BANCAS] Erro ao buscar profile:", profileError);
  }

  const activeBancaId = (profile as any)?.banca_id || null;

  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select(
      // OBS: a tabela `bancas` não possui `city`/`uf` em alguns ambientes; manter select apenas com colunas existentes.
      "id, user_id, name, email, address, cep, profile_image, cover_image, active, approved, created_at, updated_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[API/JORNALEIRO/BANCAS] Erro ao listar bancas:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      items: data || [],
      active_banca_id: activeBancaId,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Não autorizado" }, { status: 401 });
  }

  const userId = session.user.id;

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 });
  }

  const banca = body?.banca || body;

  if (!banca?.name || typeof banca.name !== "string" || banca.name.trim().length < 2) {
    return NextResponse.json({ success: false, error: "Nome da banca é obrigatório" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const insertData: any = {
    user_id: userId,
    name: banca.name?.trim(),
    description: banca.description || "",
    profile_image: banca.profile_image || banca.logo_url || banca.profileImage || null,
    cover_image: banca.cover_image || banca.cover || banca.coverImage || null,
    phone: banca.phone || null,
    whatsapp: banca.whatsapp || null,
    email: banca.email || session.user.email || null,
    instagram: banca.instagram || null,
    facebook: banca.facebook || null,
    cep: banca.cep || "",
    address: banca.address || "",
    lat: banca.lat ?? banca.location?.lat ?? null,
    lng: banca.lng ?? banca.location?.lng ?? null,
    tpu_url: banca.tpu_url || null,
    hours: banca.hours || null,
    opening_hours: banca.opening_hours || banca.hours || null,
    delivery_fee: banca.delivery_fee ?? 0,
    min_order_value: banca.min_order_value ?? 0,
    delivery_radius: banca.delivery_radius ?? 5,
    preparation_time: banca.preparation_time ?? 30,
    payment_methods: banca.payment_methods || ["pix", "dinheiro"],
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

  const { data: created, error: createError } = await supabaseAdmin
    .from("bancas")
    .insert(insertData)
    .select()
    .single();

  if (createError || !created) {
    console.error("[API/JORNALEIRO/BANCAS] Erro ao criar banca:", createError);
    return NextResponse.json(
      { success: false, error: createError?.message || "Erro ao criar banca", details: createError },
      { status: 500 }
    );
  }

  // Definir como banca ativa no painel (user_profiles.banca_id)
  const { error: profileError } = await supabaseAdmin
    .from("user_profiles")
    .update({ banca_id: created.id })
    .eq("id", userId);

  if (profileError) {
    console.error("[API/JORNALEIRO/BANCAS] Erro ao atualizar banca_id no perfil:", profileError);
    return NextResponse.json(
      {
        success: false,
        error: "Banca criada, mas falha ao definir como banca ativa. Recarregue e tente novamente.",
        details: profileError,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
