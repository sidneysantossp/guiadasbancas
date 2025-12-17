import { supabaseAdmin } from "@/lib/supabase";

export async function getActiveBancaRowForUser(userId: string, select: string = "*"): Promise<any | null> {
  const admin = supabaseAdmin as any;

  const { data: profile, error: profileError } = await admin
    .from("user_profiles")
    .select("banca_id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.warn("[getActiveBancaRowForUser] ⚠️ Erro ao buscar profile:", profileError.message);
  }

  const activeBancaId = (profile as any)?.banca_id as string | null | undefined;

  const canAccessBanca = async (bancaId: string): Promise<any | null> => {
    const { data: banca } = await admin.from("bancas").select(select).eq("id", bancaId).maybeSingle();
    if (!banca) return null;

    // Dono da banca
    if ((banca as any).user_id === userId) return banca;

    // Colaborador vinculado
    const { data: membership } = await admin
      .from("banca_members")
      .select("access_level")
      .eq("banca_id", bancaId)
      .eq("user_id", userId)
      .maybeSingle();

    if (membership) return banca;
    return null;
  };

  // 1) Tenta pela banca ativa do profile
  if (activeBancaId) {
    const banca = await canAccessBanca(activeBancaId);
    if (banca) return banca;
  }

  // 2) Fallback: banca mais recente do usuário (dono)
  const { data: ownedFallback } = await admin
    .from("bancas")
    .select(select)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ownedFallback) {
    // Best-effort: garantir que o profile aponta para uma banca válida
    if (!activeBancaId || activeBancaId !== (ownedFallback as any)?.id) {
      const { error: setErr } = await admin.from("user_profiles").update({ banca_id: (ownedFallback as any).id }).eq("id", userId);
      if (setErr) {
        console.warn("[getActiveBancaRowForUser] ⚠️ Falha ao atualizar banca_id no profile:", setErr.message);
      }
    }
    return ownedFallback;
  }

  // 3) Fallback: banca mais recente em que é colaborador
  const { data: memberFallback } = await admin
    .from("banca_members")
    .select("banca_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (memberFallback?.banca_id) {
    const banca = await canAccessBanca(memberFallback.banca_id as string);
    if (banca) {
      if (!activeBancaId || activeBancaId !== (banca as any).id) {
        const { error: setErr } = await admin.from("user_profiles").update({ banca_id: (banca as any).id }).eq("id", userId);
        if (setErr) {
          console.warn("[getActiveBancaRowForUser] ⚠️ Falha ao atualizar banca_id no profile:", setErr.message);
        }
      }
      return banca;
    }
  }

  return null;
}
