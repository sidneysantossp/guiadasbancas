import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/security/admin-auth";
import { getAsaasConfig } from "@/lib/asaas";

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const { apiKey, baseUrl, environment } = await getAsaasConfig();

    const response = await fetch(`${baseUrl}/myAccount`, {
      headers: {
        access_token: apiKey,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.errors?.[0]?.description || `Erro ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      environment,
      walletId: data.walletId,
      name: data.name,
      email: data.email,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao testar conexão com o Asaas" },
      { status: 500 }
    );
  }
}

