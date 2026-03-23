import { supabaseAdmin } from "@/lib/supabase";

export type CanonicalBancaCandidate = {
  id: string;
  user_id?: string | null;
  email?: string | null;
  cotista_id?: string | null;
  cep?: string | null;
  active?: boolean | null;
  approved?: boolean | null;
  cover_image?: string | null;
  profile_image?: string | null;
  logo_url?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function normalizeEmail(value?: string | null): string {
  return String(value || "").trim().toLowerCase();
}

function normalizeCep(value?: string | null): string {
  return String(value || "").replace(/\D/g, "");
}

function toTimestamp(value?: string | null): number {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

export function isSameBancaIdentity(a?: CanonicalBancaCandidate | null, b?: CanonicalBancaCandidate | null): boolean {
  if (!a || !b) return false;
  if (a.id === b.id) return true;

  if (!a.user_id || !b.user_id || a.user_id !== b.user_id) {
    return false;
  }

  const aCotista = String(a.cotista_id || "").trim();
  const bCotista = String(b.cotista_id || "").trim();
  if (aCotista && bCotista && aCotista === bCotista) {
    return true;
  }

  const aEmail = normalizeEmail(a.email);
  const bEmail = normalizeEmail(b.email);
  if (aEmail && bEmail && aEmail === bEmail) {
    return true;
  }

  const aCep = normalizeCep(a.cep);
  const bCep = normalizeCep(b.cep);
  if (aCep && bCep && aCep === bCep) {
    return true;
  }

  return false;
}

export function scoreCanonicalBancaCandidate(banca: CanonicalBancaCandidate): number {
  let score = 0;
  if (banca.active !== false) score += 100;
  if (banca.approved === true) score += 50;
  if (banca.cover_image) score += 20;
  if (banca.profile_image) score += 15;
  if (banca.logo_url) score += 10;
  score += Math.min(10, normalizeEmail(banca.email) ? 3 : 0);
  score += Math.min(5, normalizeCep(banca.cep) ? 2 : 0);
  return score;
}

export function pickCanonicalBanca<T extends CanonicalBancaCandidate>(items: T[]): T | null {
  if (!Array.isArray(items) || items.length === 0) return null;

  return [...items].sort((left, right) => {
    const scoreDiff = scoreCanonicalBancaCandidate(right) - scoreCanonicalBancaCandidate(left);
    if (scoreDiff !== 0) return scoreDiff;

    const approvedDiff = Number(right.approved === true) - Number(left.approved === true);
    if (approvedDiff !== 0) return approvedDiff;

    const activeDiff = Number(right.active !== false) - Number(left.active !== false);
    if (activeDiff !== 0) return activeDiff;

    const updatedDiff = toTimestamp(right.updated_at) - toTimestamp(left.updated_at);
    if (updatedDiff !== 0) return updatedDiff;

    const createdDiff = toTimestamp(left.created_at) - toTimestamp(right.created_at);
    if (createdDiff !== 0) return createdDiff;

    return String(left.id).localeCompare(String(right.id));
  })[0] || null;
}

export function resolveCanonicalOwnedBancaId<T extends CanonicalBancaCandidate>(items: T[], preferredId?: string | null): string | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  if (!preferredId) return null;

  const preferred = items.find((item) => item.id === preferredId);
  if (!preferred) return null;

  const cluster = items.filter((item) => isSameBancaIdentity(item, preferred));
  if (cluster.length <= 1) {
    return preferred.id;
  }

  return pickCanonicalBanca(cluster)?.id || preferred.id;
}

export async function resolveCanonicalBancaRowById<T = any>(id: string): Promise<T | null> {
  if (!id) return null;

  const { data: target, error: targetError } = await supabaseAdmin
    .from("bancas")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (targetError) {
    throw new Error(targetError.message || "Erro ao buscar banca");
  }

  if (!target) return null;

  if (!target.user_id) {
    return target as T;
  }

  const { data: siblings, error: siblingsError } = await supabaseAdmin
    .from("bancas")
    .select("*")
    .eq("user_id", target.user_id)
    .order("created_at", { ascending: false });

  if (siblingsError || !siblings || siblings.length === 0) {
    if (siblingsError) {
      throw new Error(siblingsError.message || "Erro ao listar bancas relacionadas");
    }
    return target as T;
  }

  const cluster = siblings.filter((item: any) => isSameBancaIdentity(item, target));
  if (cluster.length <= 1) {
    return target as T;
  }

  return (pickCanonicalBanca(cluster) || target) as T;
}
