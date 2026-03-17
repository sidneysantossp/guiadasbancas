function readFirstConfiguredSecret(...values: Array<string | undefined>): string | null {
  for (const value of values) {
    const normalized = value?.trim();
    if (normalized) return normalized;
  }

  return null;
}

export function resolveAppAuthSecret(): string | null {
  const configured = readFirstConfiguredSecret(
    process.env.NEXTAUTH_SECRET,
    process.env.AUTH_SECRET,
  );

  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return null;

  return "gb-nextauth-dev-secret";
}

export function hasAppAuthSecret(): boolean {
  return Boolean(resolveAppAuthSecret());
}

export function resolveDistribuidorAuthSecret(): string | null {
  const configured = readFirstConfiguredSecret(
    process.env.DISTRIBUIDOR_AUTH_SECRET,
    process.env.NEXTAUTH_SECRET,
    process.env.AUTH_SECRET,
  );

  if (configured) return configured;
  if (process.env.NODE_ENV === "production") return null;

  return "gb-distribuidor-dev-secret";
}

export function hasDistribuidorAuthSecret(): boolean {
  return Boolean(resolveDistribuidorAuthSecret());
}
