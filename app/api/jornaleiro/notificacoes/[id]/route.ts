import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedRequestUser } from "@/lib/modules/auth/request-user";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { markJornaleiroNotificationRead } from "@/lib/modules/jornaleiro/notifications";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedRequestUser(req);

    if (!user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401, headers: buildNoStoreHeaders({ isPrivate: true }) }
      );
    }

    await req.json().catch(() => null);
    const response = await markJornaleiroNotificationRead({
      userId: user.id,
      notificationId: params.id,
    });

    return NextResponse.json(response, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    console.error('[API] Erro ao marcar notificação:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) }
    );
  }
}
