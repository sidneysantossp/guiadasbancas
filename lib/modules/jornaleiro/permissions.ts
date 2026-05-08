import {
  JOURNALEIRO_ALL_PERMISSION_KEYS,
  normalizeJornaleiroPermissionKeys,
} from "@/lib/jornaleiro-navigation";
import { loadJornaleiroActor } from "@/lib/modules/jornaleiro/access";
import { supabaseAdmin } from "@/lib/supabase";

const OWNER_PERMISSIONS = [...JOURNALEIRO_ALL_PERMISSION_KEYS];
const MEMBER_ADMIN_PERMISSIONS = [...JOURNALEIRO_ALL_PERMISSION_KEYS];

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
    permissions: normalizeJornaleiroPermissionKeys(targetMembership.permissions),
  };
}
