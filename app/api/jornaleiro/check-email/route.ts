import { NextResponse, NextRequest } from "next/server";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { doesJornaleiroBancaEmailExist } from "@/lib/modules/jornaleiro/email";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Email não informado" }, { status: 400, headers: buildNoStoreHeaders() });
    }

    const { exists } = await doesJornaleiroBancaEmailExist(email);

    if (exists) {
      return NextResponse.json({ 
        exists: true, 
        message: "Este e-mail já está associado a uma banca cadastrada. Faça login para continuar." 
      }, { headers: buildNoStoreHeaders() });
    }

    return NextResponse.json({ exists: false }, { headers: buildNoStoreHeaders() });

  } catch (error: any) {
    console.error('[check-email] Erro:', error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500, headers: buildNoStoreHeaders() });
  }
}
