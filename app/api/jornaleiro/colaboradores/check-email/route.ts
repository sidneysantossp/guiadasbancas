import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { doesPlatformEmailExist } from "@/lib/modules/jornaleiro/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedRequestUser(req);
    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: "Não autenticado" },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const email = req.nextUrl.searchParams.get("email");
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email não informado" },
        { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailExists = await doesPlatformEmailExist(normalizedEmail);

    return NextResponse.json({ 
      success: true, 
      exists: emailExists,
      message: emailExists ? "Este email já está cadastrado na plataforma" : null
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  } catch (e: any) {
    console.error("[Check Email] Erro:", e);
    return NextResponse.json(
      { success: false, error: e?.message || "Erro interno" },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
