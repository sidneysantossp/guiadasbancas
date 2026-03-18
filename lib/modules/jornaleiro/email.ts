import { supabaseAdmin } from "@/lib/supabase";

export async function doesJornaleiroBancaEmailExist(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabaseAdmin
    .from("bancas")
    .select("id, name")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao verificar email da banca");
  }

  return {
    exists: Boolean(data),
    banca: data || null,
  };
}

export async function doesPlatformEmailExist(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (!error && data?.users) {
      const match = data.users.some((user) => user.email?.toLowerCase() === normalizedEmail);
      if (match) {
        return true;
      }
    }
  } catch (error) {
    console.error("[JornaleiroEmail] Erro ao listar usuários:", error);
  }

  const [{ data: profileData, error: profileError }, { data: bancaData, error: bancaError }] =
    await Promise.all([
      supabaseAdmin.from("user_profiles").select("id").ilike("email", normalizedEmail).limit(1),
      supabaseAdmin.from("bancas").select("id").ilike("email", normalizedEmail).limit(1),
    ]);

  if (profileError) {
    console.error("[JornaleiroEmail] Erro ao buscar email em user_profiles:", profileError);
  }

  if (bancaError) {
    console.error("[JornaleiroEmail] Erro ao buscar email em bancas:", bancaError);
  }

  return Boolean((profileData && profileData.length > 0) || (bancaData && bancaData.length > 0));
}
