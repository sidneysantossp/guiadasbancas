import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { isAdminAuthorized } from "@/lib/security/admin-auth";
import {
  DISTRIBUIDOR_SESSION_COOKIE,
  verifyDistribuidorSessionToken,
} from "@/lib/security/distribuidor-session";

export const DISTRIBUIDOR_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function requireDistribuidorAccess(
  request: NextRequest,
  distribuidorId: string | null | undefined
): Promise<NextResponse | null> {
  if (!distribuidorId) {
    return NextResponse.json(
      { success: false, error: "ID do distribuidor é obrigatório" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (!DISTRIBUIDOR_UUID_REGEX.test(distribuidorId)) {
    return NextResponse.json(
      { success: false, error: "ID do distribuidor inválido" },
      { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  const adminAccess = await isAdminAuthorized(request);
  if (adminAccess) {
    return null;
  }

  const sessionTokenFromCookie = request.cookies.get(DISTRIBUIDOR_SESSION_COOKIE)?.value || null;
  const sessionPayload = verifyDistribuidorSessionToken(sessionTokenFromCookie);

  if (!sessionPayload) {
    return NextResponse.json(
      { success: false, error: "Sessão do distribuidor inválida ou expirada" },
      { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  if (sessionPayload.sub !== distribuidorId) {
    return NextResponse.json(
      { success: false, error: "Sessão não corresponde ao distribuidor informado" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  const headerDistribuidorId = request.headers.get("x-distribuidor-id");
  if (headerDistribuidorId && headerDistribuidorId !== distribuidorId) {
    return NextResponse.json(
      { success: false, error: "Não autorizado para este distribuidor" },
      { status: 403, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }

  return null;
}
