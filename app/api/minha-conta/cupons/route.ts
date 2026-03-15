import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPersonalizedCouponsForUser } from "@/lib/minha-conta-coupons";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const userId = (session.user as any).id as string | undefined;
    if (!userId) {
      return NextResponse.json({ error: "Usuario invalido" }, { status: 401 });
    }

    const data = await getPersonalizedCouponsForUser(userId, 16);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("[API Minha Conta Cupons] Erro:", error);
    return NextResponse.json({ error: error?.message || "Erro ao carregar cupons da conta" }, { status: 500 });
  }
}
