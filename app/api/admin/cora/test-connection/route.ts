import { NextRequest, NextResponse } from "next/server";
import { testCoraConnection } from "@/lib/cora";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const result = await testCoraConnection();

    return NextResponse.json(
      {
        success: true,
        environment: result.environment,
        baseUrl: result.baseUrl,
      },
      { headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Erro ao testar conexão com a Cora" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
