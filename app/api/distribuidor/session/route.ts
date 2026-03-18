import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  findActiveDistribuidorById,
  sanitizeDistribuidorSessionData,
} from "@/lib/modules/distribuidor/session";
import {
  buildDistribuidorSessionCookieClear,
  DISTRIBUIDOR_SESSION_COOKIE,
  verifyDistribuidorSessionToken,
} from "@/lib/security/distribuidor-session";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getSessionToken(request: NextRequest) {
  const tokenFromCookie = request.cookies.get(DISTRIBUIDOR_SESSION_COOKIE)?.value || null;
  return tokenFromCookie;
}

function jsonNoStore(body: Record<string, any>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: buildNoStoreHeaders({ isPrivate: true }),
  });
}

function clearSessionResponse(status = 200) {
  const response = NextResponse.json(
    { success: false, error: "Sessão do distribuidor inválida ou expirada" },
    {
      status,
      headers: buildNoStoreHeaders({ isPrivate: true }),
    }
  );
  response.cookies.set(buildDistribuidorSessionCookieClear());
  return response;
}

export async function GET(request: NextRequest) {
  const token = getSessionToken(request);
  const sessionPayload = verifyDistribuidorSessionToken(token);

  if (!sessionPayload) {
    return clearSessionResponse();
  }

  const distribuidor = await findActiveDistribuidorById(sessionPayload.sub).catch(() => null);
  if (!distribuidor) {
    return clearSessionResponse();
  }

  return NextResponse.json(
    {
      success: true,
      distribuidor: sanitizeDistribuidorSessionData(distribuidor, sessionPayload.email),
    },
    {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    }
  );
}

export async function DELETE() {
  const response = jsonNoStore({ success: true });
  response.cookies.set(buildDistribuidorSessionCookieClear());
  return response;
}
