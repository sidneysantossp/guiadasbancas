import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

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

    // TODO: Implementar lógica de armazenamento de leitura
    // Por enquanto, apenas retorna sucesso
    // Quando implementar tabela de notificações:
    // - Buscar todas notificações não lidas do usuário
    // - Atualizar todas para read = true

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
