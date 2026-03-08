import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { markNotificationKeysAsRead } from '@/lib/jornaleiro-notifications';

// PATCH /api/jornaleiro/notificacoes/:id
// Marca uma notificação como lida
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    await req.json().catch(() => null);
    await markNotificationKeysAsRead(session.user.id, [params.id]);

    return NextResponse.json({
      success: true,
      message: 'Notificação marcada como lida',
    });
  } catch (error: any) {
    console.error('[API] Erro ao marcar notificação:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
