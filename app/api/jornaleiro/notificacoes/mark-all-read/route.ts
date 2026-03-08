import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  buildJornaleiroNotifications,
  markNotificationKeysAsRead,
} from '@/lib/jornaleiro-notifications';

export const dynamic = 'force-dynamic';

// POST /api/jornaleiro/notificacoes/mark-all-read
// Marca todas as notificações como lidas
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const { notifications } = await buildJornaleiroNotifications(session.user.id);
    const unreadNotificationIds = notifications
      .filter((notification) => !notification.read)
      .map((notification) => notification.id);

    await markNotificationKeysAsRead(session.user.id, unreadNotificationIds);

    return NextResponse.json({
      success: true,
      message: 'Todas notificações marcadas como lidas',
    });
  } catch (error: any) {
    console.error('[API] Erro ao marcar todas notificações:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
