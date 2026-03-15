import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json().catch(() => ({}));

    const syncResponse = await fetch(new URL("/api/mercos/sync-sandbox-categories", request.url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        distribuidorId: params.id,
        alteradoApos: body?.alteradoApos,
        nomePrefix: body?.nomePrefix,
        maxPages: body?.maxPages,
      }),
      cache: "no-store",
    });

    const payload = await syncResponse.json().catch(() => ({
      success: false,
      error: "Resposta inválida ao sincronizar categorias do sandbox",
    }));

    return NextResponse.json(payload, { status: syncResponse.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Erro ao sincronizar categorias do sandbox",
      },
      { status: 500 }
    );
  }
}
