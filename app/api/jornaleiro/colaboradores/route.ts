import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;

    // Criar cliente admin diretamente com service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Buscar bancas do usuário atual
    const { data: userBancas, error: bancasError } = await supabaseAdmin
      .from("bancas")
      .select("id, name")
      .eq("user_id", userId);

    if (bancasError) {
      console.error("[Colaboradores GET] Erro ao buscar bancas:", bancasError);
      return NextResponse.json({ success: false, error: "Erro ao buscar bancas" }, { status: 500 });
    }

    const bancaIds = userBancas?.map((b) => b.id) || [];

    if (bancaIds.length === 0) {
      return NextResponse.json({ success: true, colaboradores: [] });
    }

    console.log("[Colaboradores GET] Buscando memberships para bancas:", bancaIds);
    console.log("[Colaboradores GET] Excluindo user_id:", userId);

    // Tentar buscar da tabela banca_members (pode não existir ainda)
    const { data: memberships, error: membershipsError } = await supabaseAdmin
      .from("banca_members")
      .select("user_id, banca_id, access_level, permissions")
      .in("banca_id", bancaIds)
      .neq("user_id", userId);

    console.log("[Colaboradores GET] Memberships encontrados:", memberships?.length || 0);
    console.log("[Colaboradores GET] Memberships data:", JSON.stringify(memberships));

    // Se a tabela não existe, retornar lista vazia
    if (membershipsError) {
      console.error("[Colaboradores GET] Erro ao buscar memberships:", membershipsError);
      // Retornar lista vazia - a tabela será criada quando cadastrar o primeiro colaborador
      return NextResponse.json({ 
        success: true, 
        colaboradores: [],
        message: "Nenhum colaborador cadastrado ainda",
        debug: { error: membershipsError.message, code: membershipsError.code }
      });
    }

    // Agrupar por user_id
    const userIds = [...new Set(memberships?.map((m) => m.user_id) || [])];

    if (userIds.length === 0) {
      return NextResponse.json({ success: true, colaboradores: [] });
    }

    // Buscar dados dos usuários
    const { data: users } = await supabaseAdmin
      .from("user_profiles")
      .select("id, full_name, active, email")
      .in("id", userIds);

    // Montar lista de colaboradores
    const colaboradores = userIds.map((uid) => {
      const userProfile = users?.find((u) => u.id === uid);
      const userMemberships = memberships?.filter((m) => m.user_id === uid) || [];
      const firstMembership = userMemberships[0];

      // Mapear banca_ids para nomes
      const userBancasList = userMemberships.map((m) => {
        const banca = userBancas?.find((b) => b.id === m.banca_id);
        return {
          id: m.banca_id,
          name: banca?.name || "Sem nome",
        };
      });

      return {
        id: uid,
        email: userProfile?.email || "Email não disponível",
        full_name: userProfile?.full_name || null,
        access_level: firstMembership?.access_level || "collaborator",
        active: userProfile?.active ?? true,
        created_at: null,
        bancas: userBancasList,
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
    const { full_name, email, whatsapp, password, access_level, banca_ids, permissions } = body;

    // Criar cliente admin diretamente com service role
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

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
      
      // Traduzir mensagens de erro do Supabase
      let errorMessage = createError?.message || "Erro ao criar usuário";
      if (errorMessage.includes("already been registered") || errorMessage.includes("already exists")) {
        errorMessage = "Este email já está cadastrado na plataforma.";
      } else if (errorMessage.includes("invalid email")) {
        errorMessage = "Email inválido.";
      } else if (errorMessage.includes("password")) {
        errorMessage = "Senha inválida. Deve ter no mínimo 6 caracteres.";
      }
      
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }

    const newUserId = newUser.user.id;

    // Criar perfil do usuário
    // IMPORTANTE: Definir banca_id para que o colaborador seja associado à banca correta
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: newUserId,
        full_name: full_name || null,
        email: email.toLowerCase(),
        whatsapp: whatsapp || null,
        role: "jornaleiro",
        jornaleiro_access_level: access_level || "collaborator",
        banca_id: banca_ids[0], // Associar à primeira banca selecionada
        active: true,
        email_verified: true,
      });

    if (profileError) {
      console.error("[Colaboradores POST] Erro ao criar perfil:", profileError);
    }

    // Criar memberships para cada banca
    const membershipErrors: string[] = [];
    for (const bancaId of banca_ids) {
      console.log(`[Colaboradores POST] Criando membership: user_id=${newUserId}, banca_id=${bancaId}`);
      
      const { data: memberData, error: memberError } = await supabaseAdmin
        .from("banca_members")
        .upsert({
          user_id: newUserId,
          banca_id: bancaId,
          access_level: access_level || "collaborator",
          permissions: permissions || [],
        })
        .select();

      if (memberError) {
        console.error("[Colaboradores POST] Erro ao criar membership:", memberError);
        membershipErrors.push(`${bancaId}: ${memberError.message}`);
      } else {
        console.log("[Colaboradores POST] Membership criado com sucesso:", memberData);
      }
    }

    // Verificar se o membership foi criado
    const { data: verifyMembership } = await supabaseAdmin
      .from("banca_members")
      .select("*")
      .eq("user_id", newUserId);
    
    console.log("[Colaboradores POST] Verificação de memberships criados:", verifyMembership);

    return NextResponse.json({
      success: true,
      colaborador: {
        id: newUserId,
        email: email.toLowerCase(),
        full_name,
        access_level,
      },
      debug: {
        membershipErrors: membershipErrors.length > 0 ? membershipErrors : null,
        membershipsCreated: verifyMembership?.length || 0,
      }
    });
  } catch (e: any) {
    console.error("[Colaboradores POST] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}
