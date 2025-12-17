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

  // 1) Tenta pela banca ativa do profile
  if (activeBancaId) {
    const { data: banca } = await admin
      .from("bancas")
      .select(select)
      .eq("id", activeBancaId)
      .eq("user_id", userId)
      .maybeSingle();
    if (banca) return banca;
  }

  // 2) Fallback: banca mais recente do usuário
  const { data: bancaFallback } = await admin
    .from("bancas")
    .select(select)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (bancaFallback) {
    // Best-effort: garantir que o profile aponta para uma banca válida
    if (!activeBancaId || activeBancaId !== (bancaFallback as any)?.id) {
      const { error: setErr } = await admin
        .from("user_profiles")
        .update({ banca_id: (bancaFallback as any).id })
        .eq("id", userId);
      if (setErr) {
        console.warn("[getActiveBancaRowForUser] ⚠️ Falha ao atualizar banca_id no profile:", setErr.message);
      }
    }
    return bancaFallback;
  }

  return null;
}
