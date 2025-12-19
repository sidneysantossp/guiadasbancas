import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// DEBUG ENDPOINT - REMOVER DEPOIS
export async function GET(req: NextRequest) {
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ID da Maria
  const mariaId = "a04ea366-84a3-455c-afbd-ae4f4a13cf1b";

  // 1. Verificar se Maria é dona de alguma banca
  const { data: ownedBancas } = await supabaseAdmin
    .from("bancas")
    .select("id, name, user_id")
    .eq("user_id", mariaId);

  // 2. Buscar memberships da Maria
  const { data: memberships } = await supabaseAdmin
    .from("banca_members")
    .select("user_id, banca_id, access_level, permissions")
    .eq("user_id", mariaId);

  // 3. Buscar perfil da Maria
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, full_name, jornaleiro_access_level")
    .eq("id", mariaId)
    .single();

  return NextResponse.json({
    maria_id: mariaId,
    is_owner: ownedBancas && ownedBancas.length > 0,
    owned_bancas: ownedBancas,
    memberships: memberships,
    profile: profile,
    permissions_type: memberships?.[0]?.permissions ? typeof memberships[0].permissions : "null",
    permissions_raw: memberships?.[0]?.permissions,
  });
}
