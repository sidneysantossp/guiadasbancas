import type { AuthenticatedUserClaims, PlatformRawUserRole, PlatformUserRole } from "@/lib/contracts/auth";

export function normalizePlatformRole(rawRole: PlatformRawUserRole): PlatformUserRole {
  const normalized = typeof rawRole === "string" ? rawRole.trim().toLowerCase() : "";

  if (normalized === "admin") return "admin";
  if (normalized === "jornaleiro" || normalized === "seller") return "jornaleiro";

  return "cliente";
}

export function isAdminRole(rawRole: PlatformRawUserRole): boolean {
  return normalizePlatformRole(rawRole) === "admin";
}

export function isJornaleiroRole(rawRole: PlatformRawUserRole): boolean {
  return normalizePlatformRole(rawRole) === "jornaleiro";
}

export function readAuthenticatedUserClaims(session: unknown): AuthenticatedUserClaims | null {
  if (!session || typeof session !== "object" || !("user" in session)) {
    return null;
  }

  const user = (session as { user?: Record<string, unknown> }).user;
  if (!user || typeof user !== "object") {
    return null;
  }

  const rawRole = typeof user.role === "string" ? user.role : null;

  return {
    id: typeof user.id === "string" && user.id ? user.id : null,
    email: typeof user.email === "string" && user.email ? user.email : null,
    name: typeof user.name === "string" ? user.name : null,
    rawRole,
    role: normalizePlatformRole(rawRole),
    bancaId: typeof user.banca_id === "string" ? user.banca_id : null,
    avatarUrl: typeof user.avatar_url === "string" ? user.avatar_url : null,
  };
}
