const HTTP_URL_REGEX = /^https?:\/\//i;

export function sanitizePublicImageUrl(value: unknown): string {
  if (typeof value !== "string") return "";

  const normalized = value.trim();
  if (!normalized) return "";

  if (normalized.toLowerCase().startsWith("data:image/")) return "";
  if (normalized.startsWith("/")) return normalized;
  if (HTTP_URL_REGEX.test(normalized)) return normalized;

  return "";
}
