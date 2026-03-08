import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { buildJornaleiroNotifications } from "@/lib/jornaleiro-notifications";

export const dynamic = 'force-dynamic';

// GET /api/jornaleiro/notificacoes
// Lista notificações do jornaleiro: pedidos recentes e produtos novos (para cotistas)
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { banca, notifications } = await buildJornaleiroNotifications(userId);

    if (!banca) {
      return NextResponse.json(
        { success: false, error: 'Banca não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      notifications: notifications.slice(0, 30), // Limitar a 30
      total: notifications.length,
    });
  } catch (error: any) {
    console.error('[API] Erro ao buscar notificações:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
