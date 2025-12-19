import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// DEBUG ENDPOINT - REMOVER DEPOIS
export async function GET(req: NextRequest) {
  const session = await auth();
  const loggedUserId = session?.user?.id;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // ID da Maria
  const mariaId = "a04ea366-84a3-455c-afbd-ae4f4a13cf1b";
  // ID da Banca Interlagos
  const bancaInterlagosId = "f96f1115-ece6-46d8-a948-20424a80ece0";

  // 1. Quem é o dono da Banca Interlagos?
  const { data: bancaInterlagos } = await supabaseAdmin
    .from("bancas")
    .select("id, name, user_id")
    .eq("id", bancaInterlagosId)
    .single();

  // 2. Bancas que o usuário logado é DONO
  const { data: ownedByLoggedUser } = await supabaseAdmin
    .from("bancas")
    .select("id, name")
    .eq("user_id", loggedUserId || "");

  // 3. Buscar TODAS memberships da Maria
  const { data: allMemberships } = await supabaseAdmin
    .from("banca_members")
    .select("user_id, banca_id, access_level, permissions")
    .eq("user_id", mariaId);

  // 4. Buscar membership específica da Banca Interlagos
  const { data: interlagosMembership } = await supabaseAdmin
    .from("banca_members")
    .select("user_id, banca_id, access_level, permissions")
    .eq("user_id", mariaId)
    .eq("banca_id", bancaInterlagosId)
    .single();

  // 5. Buscar perfil da Maria
  const { data: profile } = await supabaseAdmin
    .from("user_profiles")
    .select("id, full_name, jornaleiro_access_level")
    .eq("id", mariaId)
    .single();

  // 6. Buscar nome das bancas
  const { data: bancas } = await supabaseAdmin
    .from("bancas")
    .select("id, name, user_id")
    .in("id", allMemberships?.map(m => m.banca_id) || []);

  return NextResponse.json({
    logged_user_id: loggedUserId,
    logged_user_owns_bancas: ownedByLoggedUser,
    banca_interlagos: bancaInterlagos,
    banca_interlagos_owner_id: bancaInterlagos?.user_id,
    logged_user_is_owner_of_interlagos: bancaInterlagos?.user_id === loggedUserId,
    maria_id: mariaId,
    all_memberships: allMemberships?.map(m => ({
      ...m,
      banca_name: bancas?.find(b => b.id === m.banca_id)?.name,
      banca_owner_id: bancas?.find(b => b.id === m.banca_id)?.user_id
    })),
    interlagos_membership: interlagosMembership,
    interlagos_permissions: interlagosMembership?.permissions,
    profile: profile,
  });
}
