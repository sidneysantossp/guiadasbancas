import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import {
  buildDistribuidorSessionCookieClear,
  DISTRIBUIDOR_SESSION_COOKIE,
  verifyDistribuidorSessionToken,
} from "@/lib/security/distribuidor-session";
import { supabaseAdmin } from "@/lib/supabase";

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
      headers: buildNoStoreHeaders({ isPrivate: true }),
    }
  );
}

export async function DELETE() {
  const response = jsonNoStore({ success: true });
  response.cookies.set(buildDistribuidorSessionCookieClear());
  return response;
}
