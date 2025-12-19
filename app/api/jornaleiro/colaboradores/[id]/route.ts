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

    // Buscar bancas do usuário atual
    const { data: userBancas } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", userId);

    const bancaIds = userBancas?.map((b) => b.id) || [];

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

    const firstMembership = memberships[0];
    
    console.log("[Colaborador GET] Raw permissions from DB:", firstMembership?.permissions);
    console.log("[Colaborador GET] Type:", typeof firstMembership?.permissions);

    // Parse permissions se for string
    let parsedPermissions: string[] = [];
    if (Array.isArray(firstMembership?.permissions)) {
      parsedPermissions = firstMembership.permissions;
    } else if (typeof firstMembership?.permissions === 'string') {
      try {
        parsedPermissions = JSON.parse(firstMembership.permissions);
      } catch {
        parsedPermissions = [];
      }
    }
    
    console.log("[Colaborador GET] Parsed permissions:", parsedPermissions);

    const colaborador = {
      id: colaboradorId,
      email: authUsers?.email || "Email não disponível",
      full_name: userProfile?.full_name || null,
      access_level: firstMembership?.access_level || "collaborator",
      active: userProfile?.active ?? true,
      created_at: authUsers?.created_at || null,
      bancas: memberships.map((m) => ({
        id: (m.bancas as any)?.id,
        name: (m.bancas as any)?.name || "Sem nome",
      })),
      permissions: parsedPermissions,
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

    // Buscar bancas do usuário atual
    const { data: userBancas } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", userId);

    const userBancaIds = userBancas?.map((b) => b.id) || [];

    // Verificar se o colaborador tem acesso a alguma banca do usuário
    const { data: existingMemberships } = await supabaseAdmin
      .from("banca_members")
      .select("banca_id")
      .eq("user_id", colaboradorId)
      .in("banca_id", userBancaIds);

    if (!existingMemberships || existingMemberships.length === 0) {
      return NextResponse.json({ success: false, error: "Colaborador não encontrado" }, { status: 404 });
    }

    // Atualizar perfil
    if (full_name !== undefined) {
      await supabaseAdmin
        .from("user_profiles")
        .update({ full_name, jornaleiro_access_level: access_level })
        .eq("id", colaboradorId);
    }

    // Atualizar memberships
    const targetBancaIds = banca_ids && banca_ids.length > 0 
      ? banca_ids.filter((id: string) => userBancaIds.includes(id))
      : existingMemberships.map((m: any) => m.banca_id);

    console.log("[Colaborador PUT] Atualizando memberships:", targetBancaIds);
    console.log("[Colaborador PUT] Permissões a salvar:", permissions);

    // Remover memberships antigas das bancas do usuário
    await supabaseAdmin
      .from("banca_members")
      .delete()
      .eq("user_id", colaboradorId)
      .in("banca_id", userBancaIds);

    // Criar novas memberships com as permissões atualizadas
    for (const bancaId of targetBancaIds) {
      const { error: upsertError } = await supabaseAdmin
        .from("banca_members")
        .upsert({
          user_id: colaboradorId,
          banca_id: bancaId,
          access_level: access_level || "collaborator",
          permissions: permissions || [],
        });
      
      if (upsertError) {
        console.error("[Colaborador PUT] Erro ao salvar membership:", upsertError);
      }
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
