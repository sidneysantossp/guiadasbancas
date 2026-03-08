import { NextRequest, NextResponse } from "next/server";
import {
  buildDistribuidorSessionCookieClear,
  DISTRIBUIDOR_SESSION_COOKIE,
  verifyDistribuidorSessionToken,
} from "@/lib/security/distribuidor-session";
import { supabaseAdmin } from "@/lib/supabase";

function getSessionToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : null;
  const tokenFromCookie = request.cookies.get(DISTRIBUIDOR_SESSION_COOKIE)?.value || null;
  return tokenFromHeader || tokenFromCookie;
}

function clearSessionResponse(status = 401) {
  const response = NextResponse.json(
    { success: false, error: "Sessão do distribuidor inválida ou expirada" },
    {
      status,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
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

  const { data: distribuidor, error } = await supabaseAdmin
    .from("distribuidores")
    .select("*")
    .eq("id", sessionPayload.sub)
    .eq("ativo", true)
    .maybeSingle();

  if (error || !distribuidor) {
    return clearSessionResponse();
  }

  const { senha, password, application_token, company_token, ...distribuidorSeguro } = distribuidor;

  return NextResponse.json(
    {
      success: true,
      distribuidor: {
        ...distribuidorSeguro,
        email: distribuidor.email || sessionPayload.email || null,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}

export async function DELETE() {
  const response = NextResponse.json(
    { success: true },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
  response.cookies.set(buildDistribuidorSessionCookieClear());
  return response;
}
