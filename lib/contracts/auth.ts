export type PlatformUserRole = "admin" | "jornaleiro" | "cliente";
export type PlatformRawUserRole = PlatformUserRole | "seller" | string | null | undefined;
export type JornaleiroAccessLevel = "admin" | "collaborator" | null;

export interface AuthenticatedUserClaims {
  id: string | null;
  email: string | null;
  name: string | null;
  rawRole: string | null;
  role: PlatformUserRole;
  bancaId: string | null;
  avatarUrl: string | null;
}

export interface DistribuidorSessionPayload {
  sub: string;
  email: string | null;
  nome: string | null;
  iat: number;
  exp: number;
}
