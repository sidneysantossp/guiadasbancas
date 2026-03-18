import type { JornaleiroAccessLevel } from "@/lib/contracts/auth";
import { normalizePlatformRole } from "@/lib/modules/auth/session";
import { loadUserProfileById } from "@/lib/modules/auth/user-profiles";
import { supabaseAdmin } from "@/lib/supabase";

export interface OwnedBancaRecord {
  id: string;
  name?: string | null;
}

export interface JornaleiroActor {
  userId: string;
  rawRole: string | null;
  role: ReturnType<typeof normalizePlatformRole>;
  isJornaleiro: boolean;
  accessLevel: Exclude<JornaleiroAccessLevel, null>;
  ownedBancaIds: string[];
}

export async function listOwnedBancas<T extends { id: string } = OwnedBancaRecord>(params: {
  userId: string;
  select?: string;
}): Promise<{
  data: T[];
  error: { code?: string | null; message?: string | null } | null;
}> {
  const result = await supabaseAdmin
    .from("bancas")
    .select(params.select || "id, name")
    .eq("user_id", params.userId);

  return {
    data: (result.data as T[] | null) || [],
    error: result.error,
  };
}

export async function loadPrimaryOwnedBanca<T extends { id: string } = OwnedBancaRecord>(params: {
  userId: string;
  select: string;
}): Promise<{
  data: T | null;
  error: { code?: string | null; message?: string | null } | null;
}> {
  const result = await supabaseAdmin
    .from("bancas")
    .select(params.select)
    .eq("user_id", params.userId)
    .maybeSingle();

  return {
    data: (result.data as T | null) || null,
    error: result.error,
  };
}

export async function loadJornaleiroActor(userId: string): Promise<{
  actor: JornaleiroActor;
  error: { code?: string | null; message?: string | null } | null;
}> {
  const [{ data: profile, error: profileError }, { data: ownedBancas, error: ownedBancasError }] =
    await Promise.all([
      loadUserProfileById<{
        role?: string | null;
        jornaleiro_access_level?: string | null;
      }>({
        userId,
        select: "role, jornaleiro_access_level",
      }),
      listOwnedBancas({ userId, select: "id" }),
    ]);

  const rawRole = ((profile as Record<string, unknown> | null)?.role as string | null | undefined) ?? null;
  const role = normalizePlatformRole(rawRole);
  const ownedBancaIds = ownedBancas.map((banca) => String(banca.id));
  const accessLevel =
    (((profile as Record<string, unknown> | null)?.jornaleiro_access_level as
      | Exclude<JornaleiroAccessLevel, null>
      | null
      | undefined) ??
      (ownedBancaIds.length > 0 ? "admin" : "collaborator")) || "collaborator";

  return {
    actor: {
      userId,
      rawRole,
      role,
      isJornaleiro: role === "jornaleiro",
      accessLevel,
      ownedBancaIds,
    },
    error: profileError || ownedBancasError,
  };
}

export async function loadAccessibleBancaForJornaleiro<T = Record<string, unknown>>(params: {
  userId: string;
  bancaId: string;
  select?: string;
}) {
  const { actor, error } = await loadJornaleiroActor(params.userId);

  if (error) {
    throw new Error(error.message || "Erro ao validar acesso do jornaleiro");
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const { data: banca, error: bancaError } = await supabaseAdmin
    .from("bancas")
    .select(params.select || "*")
    .eq("id", params.bancaId)
    .maybeSingle();

  if (bancaError) {
    throw new Error(bancaError.message || "Erro ao carregar banca");
  }

  if (!banca) {
    throw new Error("BANCA_NOT_FOUND");
  }

  const bancaRecord = banca as unknown as { user_id?: string | null };
  const isOwner = bancaRecord.user_id === params.userId;
  let memberAccessLevel: string | null = null;

  if (!isOwner) {
    const { data: membership, error: membershipError } = await supabaseAdmin
      .from("banca_members")
      .select("access_level")
      .eq("banca_id", params.bancaId)
      .eq("user_id", params.userId)
      .maybeSingle();

    if (membershipError) {
      throw new Error(membershipError.message || "Erro ao validar vínculo da banca");
    }

    memberAccessLevel = (membership?.access_level as string | null | undefined) || null;

    if (!memberAccessLevel) {
      throw new Error("UNAUTHORIZED_BANCA_ACCESS");
    }
  }

  return {
    actor,
    banca: banca as T,
    isOwner,
    memberAccessLevel,
  };
}
