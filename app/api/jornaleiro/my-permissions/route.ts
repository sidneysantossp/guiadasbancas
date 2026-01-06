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
    
    console.log("[MyPermissions] ========== INICIANDO ==========");
    console.log("[MyPermissions] userId da sessão:", userId);
    console.log("[MyPermissions] email da sessão:", session.user.email);

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Verificar se o usuário é dono de alguma banca
    const { data: ownedBancas, error: ownedError } = await supabaseAdmin
      .from("bancas")
      .select("id, name, user_id")
      .eq("user_id", userId);

    console.log("[MyPermissions] Bancas do usuário (como dono):", ownedBancas);
    console.log("[MyPermissions] Erro ao buscar bancas:", ownedError);

    // Se é dono de banca, tem todas as permissões
    if (ownedBancas && ownedBancas.length > 0) {
      console.log("[MyPermissions] ✅ USUÁRIO É DONO DE BANCA - Acesso total");
      return NextResponse.json({
        success: true,
        isOwner: true,
        accessLevel: "admin",
        permissions: ["dashboard", "pedidos", "produtos", "catalogo", "campanhas", "distribuidores", "cupons", "relatorios", "configuracoes", "notificacoes", "colaboradores", "bancas", "academy"],
      });
    }
    
    console.log("[MyPermissions] ⚠️ Usuário NÃO é dono de nenhuma banca, verificando memberships...");

    // Buscar banca_id do cookie ou header (se o usuário selecionou uma banca específica)
    const currentBancaId = req.headers.get("x-banca-id") || req.cookies.get("current_banca_id")?.value;
    
    console.log("[MyPermissions] userId:", userId);
    console.log("[MyPermissions] currentBancaId:", currentBancaId);
    
    // IMPORTANTE: Se temos um banca_id específico, verificar se o usuário é dono DESSA banca
    if (currentBancaId) {
      const { data: specificBanca } = await supabaseAdmin
        .from("bancas")
        .select("id, user_id")
        .eq("id", currentBancaId)
        .single();
      
      if (specificBanca && specificBanca.user_id === userId) {
        console.log("[MyPermissions] ✅ Usuário é DONO da banca específica:", currentBancaId);
        return NextResponse.json({
          success: true,
          isOwner: true,
          accessLevel: "admin",
          permissions: ["dashboard", "pedidos", "produtos", "catalogo", "campanhas", "distribuidores", "cupons", "relatorios", "configuracoes", "notificacoes", "colaboradores", "bancas", "academy"],
        });
      }
    }

    // Se não é dono, buscar permissões como colaborador
    const { data: memberships, error: membershipsError } = await supabaseAdmin
      .from("banca_members")
      .select("access_level, permissions, banca_id")
      .eq("user_id", userId);

    console.log("[MyPermissions] memberships:", JSON.stringify(memberships));
    console.log("[MyPermissions] membershipsError:", membershipsError);

    if (!memberships || memberships.length === 0) {
      console.log("[MyPermissions] Nenhum membership encontrado");
      return NextResponse.json({
        success: true,
        isOwner: false,
        accessLevel: "none",
        permissions: [],
      });
    }

    // Encontrar membership da banca atual (se especificada) ou usar a primeira
    let targetMembership = memberships[0];
    
    if (currentBancaId) {
      const found = memberships.find(m => m.banca_id === currentBancaId);
      if (found) {
        targetMembership = found;
        console.log("[MyPermissions] Usando membership da banca atual:", currentBancaId);
      }
    }
    
    // Se usuário tem várias memberships, combinar permissões de todas OU usar apenas da banca atual
    // Por enquanto, usar apenas da banca atual/primeira
    const firstMembership = targetMembership;
    const accessLevel = firstMembership.access_level;
    const bancaId = firstMembership.banca_id;
    
    console.log("[MyPermissions] Banca selecionada:", bancaId);

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
