import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { supabaseAdmin } from "@/lib/supabase";

const OWNER_PERMISSIONS = [
  "dashboard",
  "pedidos",
  "produtos",
  "catalogo",
  "campanhas",
  "distribuidores",
  "cupons",
  "relatorios",
  "configuracoes",
  "notificacoes",
  "colaboradores",
  "bancas",
  "academy",
] as const;

const MEMBER_ADMIN_PERMISSIONS = [
  "dashboard",
  "pedidos",
  "produtos",
  "catalogo",
  "campanhas",
  "distribuidores",
  "cupons",
  "relatorios",
  "configuracoes",
  "notificacoes",
] as const;

function parseMembershipPermissions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((permission): permission is string => typeof permission === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.filter((permission): permission is string => typeof permission === "string")
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

export async function resolveJornaleiroPermissions(params: {
  userId: string;
  currentBancaId?: string | null;
}) {
  const { actor, error: actorError } = await loadJornaleiroActor(params.userId);

  if (actorError) {
    console.error("[JornaleiroPermissions] Erro ao carregar ator:", actorError);
  }

  if (!actor.isJornaleiro) {
    throw new Error("FORBIDDEN_JORNALEIRO");
  }

  const currentBancaId = params.currentBancaId || null;
  const ownsCurrentBanca =
    !!currentBancaId && actor.ownedBancaIds.some((ownedBancaId) => ownedBancaId === currentBancaId);

  if (ownsCurrentBanca || (!currentBancaId && actor.ownedBancaIds.length > 0)) {
    return {
      success: true,
      isOwner: true,
      accessLevel: "admin",
      permissions: [...OWNER_PERMISSIONS],
    };
  }

  const { data: memberships, error: membershipsError } = await supabaseAdmin
    .from("banca_members")
    .select("access_level, permissions, banca_id")
    .eq("user_id", params.userId);

  if (membershipsError) {
    throw new Error(membershipsError.message || "Erro ao carregar permissões");
  }

  if (!memberships || memberships.length === 0) {
    return {
      success: true,
      isOwner: false,
      accessLevel: "none",
      permissions: [] as string[],
    };
  }

  const targetMembership =
    (currentBancaId
      ? memberships.find((membership) => membership.banca_id === currentBancaId)
      : memberships[0]) || memberships[0];

  if (!targetMembership) {
    return {
      success: true,
      isOwner: false,
      accessLevel: "none",
      permissions: [] as string[],
    };
  }

  if (targetMembership.access_level === "admin") {
    return {
      success: true,
      isOwner: false,
      accessLevel: "admin",
      permissions: [...MEMBER_ADMIN_PERMISSIONS],
    };
  }

  return {
    success: true,
    isOwner: false,
    accessLevel: "collaborator",
    permissions: parseMembershipPermissions(targetMembership.permissions),
  };
}
