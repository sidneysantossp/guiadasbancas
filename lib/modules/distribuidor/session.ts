import { supabaseAdmin } from "@/lib/supabase";

export function normalizeDistribuidorIdentifier(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

export function extractDistribuidorEmailLocalPart(value: string | null | undefined): string {
  if (!value) return "";
  const normalized = value.trim().toLowerCase();
  if (!normalized.includes("@")) return normalized;
  return normalized.split("@")[0] || "";
}

function buildDistribuidorAliases(distribuidor: { nome?: string | null; email?: string | null }) {
  const aliases = new Set<string>();
  const normalizedName = normalizeDistribuidorIdentifier(distribuidor.nome || "");
  const normalizedEmail = normalizeDistribuidorIdentifier(distribuidor.email || "");
  const normalizedEmailLocalPart = normalizeDistribuidorIdentifier(
    extractDistribuidorEmailLocalPart(distribuidor.email)
  );

  if (normalizedName) {
    aliases.add(normalizedName);

    const nameWords = (distribuidor.nome || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => normalizeDistribuidorIdentifier(word));

    for (const word of nameWords) {
      if (word) aliases.add(word);
    }
  }

  if (normalizedEmail) aliases.add(normalizedEmail);
  if (normalizedEmailLocalPart) aliases.add(normalizedEmailLocalPart);

  return aliases;
}

export async function findActiveDistribuidorById(distribuidorId: string) {
  const { data, error } = await supabaseAdmin
    .from("distribuidores")
    .select("*")
    .eq("id", distribuidorId)
    .eq("ativo", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function findActiveDistribuidorForLogin(
  identifier: string,
  options: { allowLegacyIdentifierLogin?: boolean } = {}
) {
  const emailLower = identifier.toLowerCase().trim();
  const searchTerm = normalizeDistribuidorIdentifier(
    emailLower.includes("@") ? extractDistribuidorEmailLocalPart(emailLower) : emailLower
  );

  const { data: distByEmail, error: emailError } = await supabaseAdmin
    .from("distribuidores")
    .select("*")
    .eq("email", emailLower)
    .eq("ativo", true)
    .maybeSingle();

  if (emailError) {
    throw emailError;
  }

  if (distByEmail) {
    return distByEmail;
  }

  if (!options.allowLegacyIdentifierLogin) {
    return null;
  }

  const { data: allDist, error: allDistError } = await supabaseAdmin
    .from("distribuidores")
    .select("*")
    .eq("ativo", true);

  if (allDistError) {
    throw allDistError;
  }

  return (
    allDist?.find((distribuidor: any) => {
      const aliases = buildDistribuidorAliases(distribuidor);
      return aliases.has(searchTerm);
    }) || null
  );
}

export function sanitizeDistribuidorSessionData(distribuidor: any, fallbackEmail?: string | null) {
  const { senha, password, application_token, company_token, ...distribuidorSeguro } = distribuidor || {};

  return {
    ...distribuidorSeguro,
    email: distribuidor?.email || fallbackEmail || null,
  };
}
