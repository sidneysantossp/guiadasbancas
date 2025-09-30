import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbQuery } from "@/lib/mysql";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    // Buscar perfil completo
    const [[profile]] = await dbQuery<any>(
      `SELECT 
        up.user_id as id,
        up.role,
        up.full_name,
        up.phone,
        up.avatar_url,
        up.banca_id,
        up.email_verified,
        up.active,
        b.name as banca_name,
        b.whatsapp as banca_whatsapp,
        b.active as banca_active,
        b.approved as banca_approved
       FROM user_profiles up
       LEFT JOIN bancas b ON b.id = up.banca_id
       WHERE up.user_id = ?
       LIMIT 1`,
      [session.user.id]
    );

    if (!profile) {
      return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        email: session.user.email,
        name: profile.full_name,
        role: profile.role,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        email_verified: Boolean(profile.email_verified),
        active: Boolean(profile.active),
      },
      banca: profile.banca_id
        ? {
            id: profile.banca_id,
            name: profile.banca_name,
            whatsapp: profile.banca_whatsapp,
            active: Boolean(profile.banca_active),
            approved: Boolean(profile.banca_approved),
          }
        : null,
    });
  } catch (error: any) {
    console.error("❌ Erro em /api/me:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil", details: error?.message },
      { status: 500 }
    );
  }
}
