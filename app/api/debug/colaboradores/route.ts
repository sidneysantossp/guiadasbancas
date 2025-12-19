import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. Verificar se tabela banca_members existe
    const { data: tableCheck, error: tableError } = await supabase
      .from("banca_members")
      .select("id")
      .limit(1);

    const tableExists = !tableError || !tableError.message.includes("does not exist");

    // 2. Buscar bancas do usuário
    const { data: userBancas, error: bancasError } = await supabase
      .from("bancas")
      .select("id, name, user_id, email")
      .eq("user_id", userId);

    // 3. Buscar TODOS os memberships (sem filtro)
    let allMemberships = null;
    let membershipsError = null;
    if (tableExists) {
      const { data, error } = await supabase
        .from("banca_members")
        .select("*");
      allMemberships = data;
      membershipsError = error;
    }

    // 4. Buscar todos os user_profiles
    const { data: allProfiles } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role, jornaleiro_access_level")
      .limit(20);

    // 5. Listar últimos usuários criados no Auth
    let recentAuthUsers = null;
    try {
      const { data } = await supabase.auth.admin.listUsers({ page: 1, perPage: 10 });
      recentAuthUsers = data?.users?.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        role: u.user_metadata?.role,
      }));
    } catch (e) {
      console.error("Erro ao listar auth users:", e);
    }

    return NextResponse.json({
      currentUser: {
        id: userId,
        email: userEmail,
      },
      tableExists,
      tableError: tableError?.message || null,
      userBancas: {
        count: userBancas?.length || 0,
        data: userBancas,
        error: bancasError?.message || null,
      },
      allMemberships: {
        count: allMemberships?.length || 0,
        data: allMemberships,
        error: membershipsError?.message || null,
      },
      allProfiles: {
        count: allProfiles?.length || 0,
        data: allProfiles,
      },
      recentAuthUsers: {
        count: recentAuthUsers?.length || 0,
        data: recentAuthUsers,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message }, { status: 500 });
  }
}
