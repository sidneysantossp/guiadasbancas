import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

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

    const body = await req.json();
    
    // TODO: Implementar lógica de armazenamento de leitura
    // Por enquanto, apenas retorna sucesso
    // Quando implementar tabela de notificações:
    // - Verificar se notificação pertence ao usuário
    // - Atualizar campo 'read' no banco

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
