import { NextRequest, NextResponse } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { checkJornaleiroDocumentAvailability } from "@/lib/modules/jornaleiro/check-cpf";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { cpf } = await req.json();
    const response = await checkJornaleiroDocumentAvailability(String(cpf || ""));
    return NextResponse.json(response, { headers: buildNoStoreHeaders() });
  } catch (error: any) {
    if (error?.message === "CPF_REQUIRED") {
      return NextResponse.json(
        { error: "CPF não informado" },
        { status: 400, headers: buildNoStoreHeaders() }
      );
    }

    if (error?.message === "INVALID_DOCUMENT") {
      return NextResponse.json(
        { error: "CPF/CNPJ inválido" },
        { status: 400, headers: buildNoStoreHeaders() }
      );
    }

    console.error("[check-cpf] ERRO CRÍTICO:", error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error.message 
      },
      { status: 500, headers: buildNoStoreHeaders() }
    );
  }
}
