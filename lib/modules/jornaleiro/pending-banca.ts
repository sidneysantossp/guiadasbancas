import { supabaseAdmin } from "@/lib/supabase";

export async function loadPendingJornaleiroBanca(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("jornaleiro_pending_banca")
    .select("banca_data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "42P01") {
      return { success: false, banca_data: null };
    }

    throw new Error(error.message || "Erro ao buscar dados pendentes da banca");
  }

  if (!data) {
    return { success: false, banca_data: null };
  }

  return {
    success: true,
    banca_data: data.banca_data,
  };
}

export async function savePendingJornaleiroBanca(params: {
  userId: string;
  bancaData: unknown;
}) {
  if (!params.bancaData) {
    throw new Error("INVALID_BANCA_DATA");
  }

  const now = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from("jornaleiro_pending_banca")
    .upsert(
      {
        user_id: params.userId,
        banca_data: params.bancaData,
        created_at: now,
        updated_at: now,
      },
      { onConflict: "user_id" }
    );

  if (error) {
    if (error.code === "42P01") {
      return { success: true, warning: "Tabela não existe" };
    }

    throw new Error(error.message || "Erro ao salvar dados pendentes da banca");
  }

  return { success: true };
}

export async function clearPendingJornaleiroBanca(userId: string) {
  const { error } = await supabaseAdmin
    .from("jornaleiro_pending_banca")
    .delete()
    .eq("user_id", userId);

  if (error && error.code !== "42P01") {
    throw new Error(error.message || "Erro ao limpar dados pendentes da banca");
  }

  return { success: true };
}
