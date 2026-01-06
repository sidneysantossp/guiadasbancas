import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// DEBUG ENDPOINT - REMOVER DEPOIS
export async function GET(req: NextRequest) {
  const session = await auth();
  
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const url = new URL(req.url);
  const userId = url.searchParams.get("user_id") || session?.user?.id;
  const bancaId = url.searchParams.get("banca_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id não fornecido" }, { status: 400 });
  }

  // 1. Verificar se é dono de alguma banca
  const { data: ownedBancas, error: ownedError } = await supabaseAdmin
    .from("bancas")
    .select("id, name, user_id")
    .eq("user_id", userId);

  // 2. Buscar memberships do usuário
  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("banca_members")
    .select("*")
    .eq("user_id", userId);

  // 3. Se bancaId foi fornecido, verificar se é dono dessa banca específica
  let specificBancaOwner = null;
  if (bancaId) {
    const { data: specificBanca } = await supabaseAdmin
      .from("bancas")
      .select("id, user_id, name")
      .eq("id", bancaId)
      .single();
    
    specificBancaOwner = {
      banca: specificBanca,
      isOwner: specificBanca?.user_id === userId,
    };
  }

  // 4. Buscar perfil do usuário
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, full_name, email, jornaleiro_access_level")
    .eq("id", userId)
    .single();

  // Simular o que a API my-permissions retornaria
  let simulatedResponse: any = null;
  
  if (ownedBancas && ownedBancas.length > 0) {
    simulatedResponse = {
      isOwner: true,
      accessLevel: "admin",
      permissions: "TODAS (é dono de banca)",
    };
  } else if (memberships && memberships.length > 0) {
    const targetMembership = bancaId 
      ? memberships.find((m: any) => m.banca_id === bancaId) || memberships[0]
      : memberships[0];
    
    if (targetMembership.access_level === "admin") {
      simulatedResponse = {
        isOwner: false,
        accessLevel: "admin",
        permissions: "TODAS (é admin da banca)",
      };
    } else {
      simulatedResponse = {
        isOwner: false,
        accessLevel: "collaborator",
        permissions: targetMembership.permissions || [],
      };
    }
  } else {
    simulatedResponse = {
      isOwner: false,
      accessLevel: "none",
      permissions: [],
    };
  }

  return NextResponse.json({
    session_user_id: session?.user?.id,
    query_user_id: userId,
    query_banca_id: bancaId,
    profile,
    owned_bancas: ownedBancas,
    owned_bancas_error: ownedError?.message,
    is_owner_of_any_banca: ownedBancas && ownedBancas.length > 0,
    memberships,
    memberships_error: membershipsError?.message,
    specific_banca_check: specificBancaOwner,
    simulated_my_permissions_response: simulatedResponse,
    diagnostico: {
      is_owner: ownedBancas && ownedBancas.length > 0,
      is_collaborator: memberships && memberships.length > 0 && (!ownedBancas || ownedBancas.length === 0),
      permissions_from_membership: memberships?.[0]?.permissions || [],
      access_level_from_membership: memberships?.[0]?.access_level || "none",
    },
  });
}
