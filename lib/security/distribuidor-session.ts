import { createHmac, timingSafeEqual } from "crypto";

export type DistribuidorSessionPayload = {
  sub: string;
  email: string | null;
  nome: string | null;
  iat: number;
  exp: number;
};

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const DISTRIBUIDOR_SESSION_COOKIE = "gb_distribuidor_session";

function resolveDistribuidorSessionSecret(): string | null {
  if (process.env.DISTRIBUIDOR_AUTH_SECRET) {
    return process.env.DISTRIBUIDOR_AUTH_SECRET;
  }

  if (process.env.NEXTAUTH_SECRET) {
    return process.env.NEXTAUTH_SECRET;
  }

  if (process.env.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return "gb-distribuidor-dev-secret";
}

export function hasDistribuidorSessionSecret(): boolean {
  return Boolean(resolveDistribuidorSessionSecret());
}

function encodeBase64Url(input: string): string {
  return Buffer.from(input, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function decodeBase64Url(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + padding, "base64").toString("utf8");
}

function signPayload(encodedPayload: string): string {
  const secret = resolveDistribuidorSessionSecret();

  if (!secret) {
    throw new Error("DISTRIBUIDOR_AUTH_SECRET não configurado");
  }

  return createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function issueDistribuidorSessionToken(input: {
  id: string;
  email?: string | null;
  nome?: string | null;
}) {
  const now = Math.floor(Date.now() / 1000);
  const payload: DistribuidorSessionPayload = {
    sub: input.id,
    email: input.email || null,
    nome: input.nome || null,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return {
    token: `${encodedPayload}.${signature}`,
    payload,
    expiresAt: new Date(payload.exp * 1000).toISOString(),
  };
}

export function verifyDistribuidorSessionToken(token: string | null | undefined): DistribuidorSessionPayload | null {
  if (!token) return null;
  if (!resolveDistribuidorSessionSecret()) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const parsed = JSON.parse(decodeBase64Url(encodedPayload)) as DistribuidorSessionPayload;
    const now = Math.floor(Date.now() / 1000);
    if (!parsed?.sub || !parsed?.exp || parsed.exp <= now) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function buildDistribuidorSessionCookie(token: string) {
  return {
    name: DISTRIBUIDOR_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function buildDistribuidorSessionCookieClear() {
  return {
    name: DISTRIBUIDOR_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
