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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verificar se o usuário é dono de alguma banca
    const { data: ownedBancas } = await supabaseAdmin
      .from("bancas")
      .select("id")
      .eq("user_id", userId);

    // Se é dono de banca, tem todas as permissões
    if (ownedBancas && ownedBancas.length > 0) {
      return NextResponse.json({
        success: true,
        isOwner: true,
        accessLevel: "admin",
        permissions: ["dashboard", "pedidos", "produtos", "catalogo", "campanhas", "distribuidores", "cupons", "relatorios", "configuracoes", "notificacoes", "colaboradores", "bancas"],
      });
    }

    // Se não é dono, buscar permissões como colaborador
    const { data: memberships, error: membershipsError } = await supabaseAdmin
      .from("banca_members")
      .select("access_level, permissions, banca_id")
      .eq("user_id", userId);

    console.log("[MyPermissions] userId:", userId);
    console.log("[MyPermissions] memberships:", JSON.stringify(memberships));
    console.log("[MyPermissions] membershipsError:", membershipsError);

    if (!memberships || memberships.length === 0) {
      // Sem memberships - não deveria acontecer, mas retorna permissões vazias
      console.log("[MyPermissions] Nenhum membership encontrado");
      return NextResponse.json({
        success: true,
        isOwner: false,
        accessLevel: "none",
        permissions: [],
      });
    }

    const firstMembership = memberships[0];
    const accessLevel = firstMembership.access_level;

    console.log("[MyPermissions] accessLevel:", accessLevel);
    console.log("[MyPermissions] permissions do banco:", firstMembership.permissions);

    // Se é admin da banca, tem todas as permissões
    if (accessLevel === "admin") {
      return NextResponse.json({
        success: true,
        isOwner: false,
        accessLevel: "admin",
        permissions: ["dashboard", "pedidos", "produtos", "catalogo", "campanhas", "distribuidores", "cupons", "relatorios", "configuracoes", "notificacoes"],
      });
    }

    // Colaborador - usa permissões específicas do banco
    // Se permissions for array de strings, usar diretamente
    // Se for JSONB com estrutura diferente, extrair corretamente
    let permissions: string[] = [];
    
    if (Array.isArray(firstMembership.permissions)) {
      permissions = firstMembership.permissions;
    } else if (typeof firstMembership.permissions === 'string') {
      try {
        permissions = JSON.parse(firstMembership.permissions);
      } catch {
        permissions = [];
      }
    }

    console.log("[MyPermissions] Permissões finais:", permissions);

    return NextResponse.json({
      success: true,
      isOwner: false,
      accessLevel: "collaborator",
      permissions,
    });
  } catch (e: any) {
    console.error("[MyPermissions] Erro:", e);
    return NextResponse.json({ success: false, error: e?.message || "Erro interno" }, { status: 500 });
  }
}
