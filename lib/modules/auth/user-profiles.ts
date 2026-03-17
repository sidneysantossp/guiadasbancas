import { supabaseAdmin } from "@/lib/supabase";

function normalizeSelectFields(select: string): string[] {
  return select
    .split(",")
    .map((field) => field.trim())
    .filter(Boolean);
}

function buildSelectWithOptionalAccessLevel(select: string): {
  primary: string;
  fallback: string;
} {
  const baseFields = normalizeSelectFields(select);
  const fallbackFields = baseFields.filter((field) => field !== "jornaleiro_access_level");
  const primaryFields = fallbackFields.includes("jornaleiro_access_level")
    ? fallbackFields
    : [...fallbackFields, "jornaleiro_access_level"];

  return {
    primary: primaryFields.join(", "),
    fallback: fallbackFields.join(", "),
  };
}

function isMissingJornaleiroAccessLevelError(error: { code?: string | null; message?: string | null } | null) {
  if (!error) return false;

  return error.code === "42703" || /jornaleiro_access_level/i.test(error.message || "");
}

export async function loadUserProfileById<T = Record<string, unknown>>(params: {
  userId: string;
  select: string;
}): Promise<{ data: T | null; error: { code?: string | null; message?: string | null } | null }> {
  const { primary, fallback } = buildSelectWithOptionalAccessLevel(params.select);

  const primaryResult = await supabaseAdmin
    .from("user_profiles")
    .select(primary)
    .eq("id", params.userId)
    .maybeSingle();

  if (!isMissingJornaleiroAccessLevelError(primaryResult.error) || !fallback) {
    return {
      data: (primaryResult.data as T | null) ?? null,
      error: primaryResult.error,
    };
  }

  const fallbackResult = await supabaseAdmin
    .from("user_profiles")
    .select(fallback)
    .eq("id", params.userId)
    .maybeSingle();

  return {
    data: (fallbackResult.data as T | null) ?? null,
    error: fallbackResult.error,
  };
}
