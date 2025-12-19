import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const colaboradorId = params.id;
    const userId = session.user.id;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Buscar bancas do usuário atual (dono logado)
    const { data: userBancas } = await supabaseAdmin
      .from("bancas")
      .select("id, name")
      .eq("user_id", userId);

    const bancaIds = userBancas?.map((b) => b.id) || [];
    
    console.log("[Colaborador GET] userId (dono logado):", userId);
    console.log("[Colaborador GET] Bancas do dono:", userBancas);
    console.log("[Colaborador GET] bancaIds:", bancaIds);

    // Verificar se o colaborador tem acesso a alguma banca do usuário
    const { data: memberships, error: membershipsError } = await supabaseAdmin
      .from("banca_members")
      .select(`
        user_id,
        banca_id,
        access_level,
        permissions,
        bancas:banca_id (id, name)
      `)
      .eq("user_id", colaboradorId)
      .in("banca_id", bancaIds);

    console.log("[Colaborador GET] Memberships encontradas:", JSON.stringify(memberships));
    console.log("[Colaborador GET] Erro:", membershipsError);

    if (membershipsError || !memberships || memberships.length === 0) {
      return NextResponse.json({ success: false, error: "Colaborador não encontrado" }, { status: 404 });
    }

    // Buscar dados do usuário
    const { data: userProfile } = await supabaseAdmin
      .from("user_profiles")
      .select("id, full_name, active")
      .eq("id", colaboradorId)
      .single();

    const { data: authUsers } = await supabaseAdmin
      .from("auth_users_view")
      .select("id, email, created_at")
      .eq("id", colaboradorId)
      .single();

    // Função para parsear permissões
    const parsePermissions = (perms: any): string[] => {
      if (Array.isArray(perms)) return perms;
      if (typeof perms === 'string') {
        try { return JSON.parse(perms); } catch { return []; }
      }
      return [];
    };

    // Retornar permissões POR BANCA para permitir edição correta
    const bancasComPermissoes = memberships.map((m) => ({
      id: (m.bancas as any)?.id,
      name: (m.bancas as any)?.name || "Sem nome",
      access_level: m.access_level,
      permissions: parsePermissions(m.permissions),
    }));

    console.log("[Colaborador GET] Bancas com permissões:", JSON.stringify(bancasComPermissoes));

    // Para compatibilidade, usar permissões da primeira banca
    const firstMembership = memberships[0];
    const firstPermissions = parsePermissions(firstMembership?.permissions);

    const colaborador = {
      id: colaboradorId,
      email: authUsers?.email || "Email não disponível",
      full_name: userProfile?.full_name || null,
      access_level: firstMembership?.access_level || "collaborator",
      active: userProfile?.active ?? true,
      created_at: authUsers?.created_at || null,
      bancas: bancasComPermissoes, // Agora inclui permissões por banca
      permissions: firstPermissions, // Mantém para compatibilidade
    };

    return NextResponse.json({ success: true, colaborador });
  } catch (e: any) {
    console.error("[Colaborador GET] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const colaboradorId = params.id;
    const userId = session.user.id;
    const body = await req.json();
    const { full_name, access_level, banca_ids, permissions } = body;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Buscar bancas que o usuário atual é DONO
    const { data: ownedBancas } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", userId);

    const ownedBancaIds = ownedBancas?.map((b) => b.id) || [];
    
    console.log("[Colaborador PUT] userId (logado):", userId);
    console.log("[Colaborador PUT] Bancas que o usuário é dono:", ownedBancaIds);
    console.log("[Colaborador PUT] banca_ids recebidos do form:", banca_ids);

    // Verificar se o colaborador tem membership em alguma banca do dono
    const { data: existingMemberships } = await supabaseAdmin
      .from("banca_members")
      .select("banca_id, permissions")
      .eq("user_id", colaboradorId)
      .in("banca_id", ownedBancaIds);

    console.log("[Colaborador PUT] Memberships existentes do colaborador:", existingMemberships);

    if (!existingMemberships || existingMemberships.length === 0) {
      return NextResponse.json({ success: false, error: "Colaborador não encontrado nas suas bancas" }, { status: 404 });
    }

    // Atualizar perfil
    if (full_name !== undefined) {
      await supabaseAdmin
        .from("user_profiles")
        .update({ full_name, jornaleiro_access_level: access_level })
        .eq("id", colaboradorId);
    }

    // Determinar quais bancas atualizar
    // Se banca_ids foi enviado, usar apenas as que o dono possui
    // Senão, usar as memberships existentes
    const targetBancaIds = banca_ids && banca_ids.length > 0 
      ? banca_ids.filter((id: string) => ownedBancaIds.includes(id))
      : existingMemberships.map((m: any) => m.banca_id);

    console.log("[Colaborador PUT] Bancas alvo para atualização:", targetBancaIds);
    console.log("[Colaborador PUT] Permissões a salvar:", permissions);

    // Atualizar APENAS as memberships das bancas do dono (não deletar outras)
    for (const bancaId of targetBancaIds) {
      console.log("[Colaborador PUT] Atualizando banca:", bancaId, "com permissões:", permissions);
      
      const { error: updateError } = await supabaseAdmin
        .from("banca_members")
        .update({
          access_level: access_level || "collaborator",
          permissions: permissions || [],
        })
        .eq("user_id", colaboradorId)
        .eq("banca_id", bancaId);
      
      if (updateError) {
        console.error("[Colaborador PUT] Erro ao atualizar membership:", updateError);
      }
    }
    
    // Se há bancas novas que o colaborador não tinha acesso, criar
    const existingBancaIds = existingMemberships.map((m: any) => m.banca_id);
    const newBancaIds = targetBancaIds.filter((id: string) => !existingBancaIds.includes(id));
    
    for (const bancaId of newBancaIds) {
      console.log("[Colaborador PUT] Criando nova membership para banca:", bancaId);
      await supabaseAdmin
        .from("banca_members")
        .insert({
          user_id: colaboradorId,
          banca_id: bancaId,
          access_level: access_level || "collaborator",
          permissions: permissions || [],
        });
    }
    
    // Remover acesso de bancas que foram desmarcadas
    const removedBancaIds = existingBancaIds.filter((id: string) => !targetBancaIds.includes(id));
    if (removedBancaIds.length > 0) {
      console.log("[Colaborador PUT] Removendo acesso das bancas:", removedBancaIds);
      await supabaseAdmin
        .from("banca_members")
        .delete()
        .eq("user_id", colaboradorId)
        .in("banca_id", removedBancaIds);
    }

    // Verificar se salvou corretamente
    const { data: verifyData } = await supabaseAdmin
      .from("banca_members")
      .select("permissions")
      .eq("user_id", colaboradorId)
      .in("banca_id", targetBancaIds);
    
    console.log("[Colaborador PUT] Permissões salvas:", verifyData);

    return NextResponse.json({ success: true, debug: { savedPermissions: verifyData } });
  } catch (e: any) {
    console.error("[Colaborador PUT] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Não autenticado" }, { status: 401 });
    }

    const colaboradorId = params.id;
    const userId = session.user.id;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Buscar bancas do usuário atual
    const { data: userBancas } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", userId);

    const bancaIds = userBancas?.map((b) => b.id) || [];

    // Verificar se o colaborador tem acesso a alguma banca do usuário
    const { data: memberships } = await supabaseAdmin
      .from("banca_members")
      .select("banca_id")
      .eq("user_id", colaboradorId)
      .in("banca_id", bancaIds);

    if (!memberships || memberships.length === 0) {
      return NextResponse.json({ success: false, error: "Colaborador não encontrado" }, { status: 404 });
    }

    // Remover apenas as memberships das bancas do usuário atual
    const { error: deleteError } = await supabaseAdmin
      .from("banca_members")
      .delete()
      .eq("user_id", colaboradorId)
      .in("banca_id", bancaIds);

    if (deleteError) {
      console.error("[Colaborador DELETE] Erro ao remover memberships:", deleteError);
      return NextResponse.json({ success: false, error: "Erro ao remover colaborador" }, { status: 500 });
    }

    // Verificar se o colaborador ainda tem acesso a outras bancas
    const { data: remainingMemberships } = await supabaseAdmin
      .from("banca_members")
      .select("id")
      .eq("user_id", colaboradorId);

    // Se não tem mais memberships, desativar o usuário
    if (!remainingMemberships || remainingMemberships.length === 0) {
      await supabaseAdmin
        .from("user_profiles")
        .update({ active: false })
        .eq("id", colaboradorId);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("[Colaborador DELETE] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}
