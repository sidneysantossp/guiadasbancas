import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Buscar bancas do usuário atual
    const { data: userBancas, error: bancasError } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", userId);

    if (bancasError) {
      console.error("[Colaboradores GET] Erro ao buscar bancas:", bancasError);
      return NextResponse.json({ success: false, error: "Erro ao buscar bancas" }, { status: 500 });
    }

    const bancaIds = userBancas?.map((b) => b.id) || [];

    if (bancaIds.length === 0) {
      return NextResponse.json({ success: true, colaboradores: [] });
    }

    // Buscar colaboradores que têm acesso às bancas do usuário
    const { data: memberships, error: membershipsError } = await supabaseAdmin
      .from("banca_members")
      .select(`
        user_id,
        banca_id,
        access_level,
        permissions,
        bancas:banca_id (id, name)
      `)
      .in("banca_id", bancaIds)
      .neq("user_id", userId);

    if (membershipsError) {
      console.error("[Colaboradores GET] Erro ao buscar memberships:", membershipsError);
      return NextResponse.json({ success: false, error: "Erro ao buscar colaboradores" }, { status: 500 });
    }

    // Agrupar por user_id
    const userIds = [...new Set(memberships?.map((m) => m.user_id) || [])];

    if (userIds.length === 0) {
      return NextResponse.json({ success: true, colaboradores: [] });
    }

    // Buscar dados dos usuários
    const { data: users, error: usersError } = await supabaseAdmin
      .from("user_profiles")
      .select("id, full_name, active")
      .in("id", userIds);

    if (usersError) {
      console.error("[Colaboradores GET] Erro ao buscar users:", usersError);
    }

    // Buscar emails dos usuários via auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin
      .from("auth_users_view")
      .select("id, email, created_at")
      .in("id", userIds);

    // Montar lista de colaboradores
    const colaboradores = userIds.map((uid) => {
      const userProfile = users?.find((u) => u.id === uid);
      const authUser = authUsers?.find((a) => a.id === uid);
      const userMemberships = memberships?.filter((m) => m.user_id === uid) || [];
      const firstMembership = userMemberships[0];

      return {
        id: uid,
        email: authUser?.email || "Email não disponível",
        full_name: userProfile?.full_name || null,
        access_level: firstMembership?.access_level || "collaborator",
        active: userProfile?.active ?? true,
        created_at: authUser?.created_at || null,
        bancas: userMemberships.map((m) => ({
          id: (m.bancas as any)?.id,
          name: (m.bancas as any)?.name || "Sem nome",
        })),
        permissions: firstMembership?.permissions || [],
      };
    });

    return NextResponse.json({ success: true, colaboradores });
  } catch (e: any) {
    console.error("[Colaboradores GET] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { full_name, email, password, access_level, banca_ids, permissions } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email e senha são obrigatórios" }, { status: 400 });
    }

    if (!banca_ids || banca_ids.length === 0) {
      return NextResponse.json({ success: false, error: "Selecione pelo menos uma banca" }, { status: 400 });
    }

    // Verificar se as bancas pertencem ao usuário
    const { data: userBancas, error: bancasError } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", userId)
      .in("id", banca_ids);

    if (bancasError || !userBancas || userBancas.length !== banca_ids.length) {
      return NextResponse.json({ success: false, error: "Você não tem permissão para essas bancas" }, { status: 403 });
    }

    // Verificar se email já existe
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const emailExists = existingUser?.users?.some((u) => u.email?.toLowerCase() === email.toLowerCase());

    if (emailExists) {
      return NextResponse.json({ success: false, error: "Este email já está cadastrado" }, { status: 400 });
    }

    // Criar usuário no Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role: "jornaleiro",
      },
    });

    if (createError || !newUser?.user) {
      console.error("[Colaboradores POST] Erro ao criar usuário:", createError);
      return NextResponse.json({ success: false, error: createError?.message || "Erro ao criar usuário" }, { status: 500 });
    }

    const newUserId = newUser.user.id;

    // Criar perfil do usuário
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: newUserId,
        full_name: full_name || null,
        role: "jornaleiro",
        jornaleiro_access_level: access_level || "collaborator",
        active: true,
        email_verified: true,
      });

    if (profileError) {
      console.error("[Colaboradores POST] Erro ao criar perfil:", profileError);
    }

    // Criar memberships para cada banca
    for (const bancaId of banca_ids) {
      const { error: memberError } = await supabaseAdmin
        .from("banca_members")
        .upsert({
          user_id: newUserId,
          banca_id: bancaId,
          access_level: access_level || "collaborator",
          permissions: permissions || [],
        });

      if (memberError) {
        console.error("[Colaboradores POST] Erro ao criar membership:", memberError);
      }
    }

    return NextResponse.json({
      success: true,
      colaborador: {
        id: newUserId,
        email: email.toLowerCase(),
        full_name,
        access_level,
      },
    });
  } catch (e: any) {
    console.error("[Colaboradores POST] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}
