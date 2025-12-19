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
  // ID da Banca Interlagos
  const bancaInterlagosId = "f96f1115-ece6-46d8-a948-20424a80ece0";

  // 1. Verificar se Maria é dona de alguma banca
  const { data: ownedBancas } = await supabaseAdmin
    .from("bancas")
    .select("id, name, user_id")
    .eq("user_id", mariaId);

  // 2. Buscar TODAS memberships da Maria
  const { data: allMemberships } = await supabaseAdmin
    .from("banca_members")
    .select("user_id, banca_id, access_level, permissions")
    .eq("user_id", mariaId);

  // 3. Buscar membership específica da Banca Interlagos
  const { data: interlagosMembership } = await supabaseAdmin
    .from("banca_members")
    .select("user_id, banca_id, access_level, permissions")
    .eq("user_id", mariaId)
    .eq("banca_id", bancaInterlagosId)
    .single();

  // 4. Buscar perfil da Maria
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, full_name, jornaleiro_access_level")
    .eq("id", mariaId)
    .single();

  // 5. Buscar nome das bancas
  const { data: bancas } = await supabaseAdmin
    .from("bancas")
    .select("id, name")
    .in("id", allMemberships?.map(m => m.banca_id) || []);

  return NextResponse.json({
    maria_id: mariaId,
    banca_interlagos_id: bancaInterlagosId,
    is_owner: ownedBancas && ownedBancas.length > 0,
    owned_bancas: ownedBancas,
    all_memberships: allMemberships?.map(m => ({
      ...m,
      banca_name: bancas?.find(b => b.id === m.banca_id)?.name
    })),
    interlagos_membership: interlagosMembership,
    interlagos_permissions: interlagosMembership?.permissions,
    profile: profile,
  });
}
