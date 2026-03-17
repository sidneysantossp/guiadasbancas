export const LEGACY_ADMIN_API_TOKEN = "admin-token";
export const LEGACY_JORNALEIRO_API_TOKEN = "jornaleiro-token";
export const LEGACY_ADMIN_AUTHORIZATION_HEADER = `Bearer ${LEGACY_ADMIN_API_TOKEN}`;

function normalizeBearerToken(token: string | null | undefined): string | null {
  const normalized = token?.trim();
  return normalized || null;
}

export function getConfiguredAdminApiTokens(): Set<string> {
  const raw = [
    process.env.ADMIN_API_TOKEN,
    process.env.INTERNAL_ADMIN_API_TOKEN,
    process.env.ADMIN_BEARER_TOKEN,
  ]
    .map((token) => normalizeBearerToken(token))
    .filter(Boolean) as string[];

  return new Set(raw);
}

export function isLegacyAdminTokenAllowed(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ALLOW_LEGACY_ADMIN_TOKEN === "true";
}

export function matchesAdminBearerToken(token: string | null | undefined): boolean {
  const normalized = normalizeBearerToken(token);
  if (!normalized) return false;

  const configuredTokens = getConfiguredAdminApiTokens();
  if (configuredTokens.has(normalized)) return true;

  return normalized === LEGACY_ADMIN_API_TOKEN && isLegacyAdminTokenAllowed();
}

export function isLegacyUploadTokenAllowed(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.ALLOW_LEGACY_UPLOAD_TOKEN === "true";
}

export function hasLegacyUploadAuthorizationHeader(authHeader: string | null | undefined): boolean {
  if (!authHeader || !isLegacyUploadTokenAllowed()) return false;

  return authHeader === LEGACY_ADMIN_AUTHORIZATION_HEADER || authHeader === `Bearer ${LEGACY_JORNALEIRO_API_TOKEN}`;
}
