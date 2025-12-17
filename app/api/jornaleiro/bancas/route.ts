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

  // Backward-compatible: alguns ambientes podem não ter a coluna `jornaleiro_access_level` ainda.
  let profile: any = null;
  let profileError: any = null;
  const primaryProfile = await supabaseAdmin
    .from("user_profiles")
    .select("banca_id, jornaleiro_access_level")
    .eq("id", userId)
    .maybeSingle();

  profile = primaryProfile.data;
  profileError = primaryProfile.error;

  if (
    profileError &&
    (profileError.code === "42703" || /jornaleiro_access_level/i.test(profileError.message || ""))
  ) {
    const fallbackProfile = await supabaseAdmin.from("user_profiles").select("banca_id").eq("id", userId).maybeSingle();
    profile = fallbackProfile.data;
    profileError = fallbackProfile.error;
  }

  if (profileError) {
    console.error("[API/JORNALEIRO/BANCAS] Erro ao buscar profile:", profileError);
  }

  const activeBancaId = (profile as any)?.banca_id || null;
  const accountAccessLevel = ((profile as any)?.jornaleiro_access_level as string | null) || "admin";

  // Bancas onde é dono
  const { data: owned, error: ownedError } = await supabaseAdmin
    .from("bancas")
    .select(
      // OBS: a tabela `bancas` não possui `city`/`uf` em alguns ambientes; manter select apenas com colunas existentes.
      "id, user_id, name, email, address, cep, profile_image, cover_image, active, approved, created_at, updated_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (ownedError) {
    console.error("[API/JORNALEIRO/BANCAS] Erro ao listar bancas (owner):", ownedError);
    return NextResponse.json({ success: false, error: ownedError.message }, { status: 500 });
  }

  // Bancas onde é colaborador (via banca_members)
  const { data: memberships, error: membershipError } = await supabaseAdmin
    .from("banca_members")
    .select("banca_id, access_level")
    .eq("user_id", userId);

  if (membershipError) {
    console.error("[API/JORNALEIRO/BANCAS] Erro ao listar banca_members:", membershipError);
  }

  const membershipMap = new Map<string, string>(
    (memberships || []).map((m: any) => [m.banca_id as string, (m.access_level as string) || "collaborator"])
  );
  const memberBancaIds = Array.from(membershipMap.keys());

  let memberBancas: any[] = [];
  if (memberBancaIds.length > 0) {
    const { data: memberRows, error: memberRowsError } = await supabaseAdmin
      .from("bancas")
      .select("id, user_id, name, email, address, cep, profile_image, cover_image, active, approved, created_at, updated_at")
      .in("id", memberBancaIds)
      .order("created_at", { ascending: false });

    if (memberRowsError) {
      console.error("[API/JORNALEIRO/BANCAS] Erro ao listar bancas (member):", memberRowsError);
    } else {
      memberBancas = memberRows || [];
    }
  }

  const itemsMap = new Map<string, any>();
  (owned || []).forEach((b: any) => {
    itemsMap.set(b.id, { ...b, my_access_level: "admin", my_relation: "owner" });
  });
  memberBancas.forEach((b: any) => {
    if (itemsMap.has(b.id)) return;
    itemsMap.set(b.id, {
      ...b,
      my_access_level: membershipMap.get(b.id) || "collaborator",
      my_relation: "member",
    });
  });

  const items = Array.from(itemsMap.values());

  // Garantir que banca ativa no profile é acessível
  let resolvedActiveBancaId = activeBancaId;
  if (resolvedActiveBancaId && !itemsMap.has(resolvedActiveBancaId)) {
    resolvedActiveBancaId = null;
  }
  if (!resolvedActiveBancaId && items.length > 0) {
    resolvedActiveBancaId = items[0].id;
    const { error: setErr } = await supabaseAdmin
      .from("user_profiles")
      .update({ banca_id: resolvedActiveBancaId })
      .eq("id", userId);
    if (setErr) {
      console.warn("[API/JORNALEIRO/BANCAS] ⚠️ Falha ao atualizar banca_id no profile:", setErr.message);
    }
  }

  return NextResponse.json(
    {
      success: true,
      items,
      active_banca_id: resolvedActiveBancaId,
      account_access_level: accountAccessLevel,
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

  // Permissão: somente jornaleiro admin pode cadastrar novas bancas
  // Backward-compatible: `jornaleiro_access_level` pode não existir em alguns ambientes.
  let requesterProfile: any = null;
  const requesterPrimary = await supabaseAdmin
    .from("user_profiles")
    .select("role, jornaleiro_access_level")
    .eq("id", userId)
    .maybeSingle();

  requesterProfile = requesterPrimary.data;

  if (
    requesterPrimary.error &&
    (requesterPrimary.error.code === "42703" ||
      /jornaleiro_access_level/i.test(requesterPrimary.error.message || ""))
  ) {
    const requesterFallback = await supabaseAdmin.from("user_profiles").select("role").eq("id", userId).maybeSingle();
    requesterProfile = requesterFallback.data;
  }

  const requesterRole = (requesterProfile as any)?.role as string | undefined;
  const isJornaleiroRole = requesterRole === "jornaleiro" || requesterRole === "seller";
  const requesterAccess = ((requesterProfile as any)?.jornaleiro_access_level as string | null) || "admin";

  if (!isJornaleiroRole) {
    return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
  }

  if (requesterAccess === "collaborator") {
    return NextResponse.json({ success: false, error: "Apenas administradores podem cadastrar novas bancas" }, { status: 403 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400 });
  }

  const banca = body?.banca || body;
  const access = body?.access || body?.access_user || null;

  if (!banca?.name || typeof banca.name !== "string" || banca.name.trim().length < 2) {
    return NextResponse.json({ success: false, error: "Nome da banca é obrigatório" }, { status: 400 });
  }

  // Se foi solicitado criar usuário (colaborador/admin) para esta banca, validar e criar antes
  const accessEmail = typeof access?.email === "string" ? access.email.trim().toLowerCase() : "";
  const accessPassword = typeof access?.password === "string" ? access.password : "";
  const accessLevelRaw = typeof access?.access_level === "string" ? access.access_level : typeof access?.level === "string" ? access.level : "";
  const accessLevel = accessLevelRaw === "admin" ? "admin" : accessLevelRaw === "collaborator" ? "collaborator" : "collaborator";

  let createdAccessUser: { id: string; email: string; jornaleiro_access_level: string } | null = null;
  if (accessEmail || accessPassword) {
    if (!accessEmail) {
      return NextResponse.json({ success: false, error: "Email do usuário é obrigatório" }, { status: 400 });
    }
    if (!accessPassword || accessPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Senha do usuário deve ter no mínimo 6 caracteres" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accessEmail)) {
      return NextResponse.json({ success: false, error: "Email do usuário inválido" }, { status: 400 });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: accessEmail,
      password: accessPassword,
      email_confirm: true,
      user_metadata: {
        role: "jornaleiro",
        jornaleiro_access_level: accessLevel,
        created_by: userId,
      },
    });

    if (authError || !authData?.user) {
      return NextResponse.json({ success: false, error: authError?.message || "Erro ao criar usuário" }, { status: 400 });
    }

    createdAccessUser = {
      id: authData.user.id,
      email: authData.user.email || accessEmail,
      jornaleiro_access_level: accessLevel,
    };

    // Criar profile manualmente (se trigger não existir)
    const { error: profileInsertError } = await supabaseAdmin.from("user_profiles").insert({
      id: createdAccessUser.id,
      role: "jornaleiro",
      full_name: access?.full_name || null,
      email_verified: true,
      active: true,
      jornaleiro_access_level: accessLevel,
    } as any);

    if (profileInsertError && profileInsertError.code !== "23505") {
      console.error("[API/JORNALEIRO/BANCAS] Erro ao criar profile do usuário:", profileInsertError);
      // best-effort rollback do usuário
      await supabaseAdmin.auth.admin.deleteUser(createdAccessUser.id);
      return NextResponse.json({ success: false, error: profileInsertError.message }, { status: 500 });
    }
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
    if (createdAccessUser?.id) {
      await supabaseAdmin.auth.admin.deleteUser(createdAccessUser.id);
    }
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

  // Vincular usuário criado (colaborador/admin) à banca
  if (createdAccessUser?.id) {
    const { error: memberErr } = await supabaseAdmin.from("banca_members").insert({
      banca_id: created.id,
      user_id: createdAccessUser.id,
      access_level: createdAccessUser.jornaleiro_access_level,
    } as any);

    if (memberErr && memberErr.code !== "23505") {
      console.error("[API/JORNALEIRO/BANCAS] Erro ao vincular usuário na banca_members:", memberErr);
    }

    const { error: setBancaErr } = await supabaseAdmin
      .from("user_profiles")
      .update({ banca_id: created.id })
      .eq("id", createdAccessUser.id);

    if (setBancaErr) {
      console.error("[API/JORNALEIRO/BANCAS] Erro ao definir banca_id no profile do usuário:", setBancaErr);
    }
  }

  return NextResponse.json({ success: true, data: created, access_user: createdAccessUser }, { status: 201 });
}
