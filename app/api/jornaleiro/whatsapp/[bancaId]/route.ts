import { NextRequest, NextResponse } from "next/server";

// Simulação de banco de dados dos jornaleiros
let JORNALEIROS_WHATSAPP: Record<string, {
  jornaleiroId: string;
  whatsappNumber: string;
  bancaName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> = {};

// GET - Buscar WhatsApp do jornaleiro
export async function GET(req: NextRequest, { params }: { params: { bancaId: string } }) {
  try {
    const { bancaId } = params;
    
    // Em produção, buscar do banco de dados
    // const jornaleiro = await db.jornaleiroWhatsApp.findUnique({
    //   where: { bancaId }
    // });
    
    const jornaleiro = JORNALEIROS_WHATSAPP[bancaId];
    
    if (!jornaleiro) {
      return NextResponse.json({
        jornaleiroId: bancaId,
        whatsappNumber: '',
        bancaName: '',
        isActive: false
      });
    }

    return NextResponse.json(jornaleiro);
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || 'Erro ao buscar dados do jornaleiro'
    }, { status: 500 });
  }
}

// POST - Salvar/Atualizar WhatsApp do jornaleiro
export async function POST(req: NextRequest, { params }: { params: { bancaId: string } }) {
  try {
    const { bancaId } = params;
    const body = await req.json();
    const { whatsappNumber, bancaName, isActive } = body;

    // Validações
    if (!whatsappNumber) {
      return NextResponse.json({
        error: 'Número do WhatsApp é obrigatório'
      }, { status: 400 });
    }

    // Validar formato do número (apenas números, 10-11 dígitos)
    const cleanNumber = whatsappNumber.replace(/\D/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 11) {
      return NextResponse.json({
        error: 'Número de WhatsApp inválido. Use formato: 11999999999'
      }, { status: 400 });
    }

    const now = new Date().toISOString();
    const existingJornaleiro = JORNALEIROS_WHATSAPP[bancaId];

    // Atualizar ou criar registro
    JORNALEIROS_WHATSAPP[bancaId] = {
      jornaleiroId: bancaId,
      whatsappNumber: cleanNumber,
      bancaName: bancaName || existingJornaleiro?.bancaName || 'Banca',
      isActive: Boolean(isActive),
      createdAt: existingJornaleiro?.createdAt || now,
      updatedAt: now
    };

    // Em produção, salvar no banco de dados
    // await db.jornaleiroWhatsApp.upsert({
    //   where: { bancaId },
    //   update: {
    //     whatsappNumber: cleanNumber,
    //     bancaName,
    //     isActive: Boolean(isActive),
    //     updatedAt: now
    //   },
    //   create: {
    //     bancaId,
    //     whatsappNumber: cleanNumber,
    //     bancaName,
    //     isActive: Boolean(isActive),
    //     createdAt: now,
    //     updatedAt: now
    //   }
    // });

    console.log('[JORNALEIRO] WhatsApp configurado:', {
      bancaId,
      whatsappNumber: cleanNumber,
      isActive: Boolean(isActive)
    });

    return NextResponse.json({
      success: true,
      message: 'WhatsApp configurado com sucesso',
      data: JORNALEIROS_WHATSAPP[bancaId]
    });

  } catch (error: any) {
    console.error('[JORNALEIRO] Erro ao configurar WhatsApp:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao salvar configurações'
    }, { status: 500 });
  }
}

// DELETE - Remover configuração do WhatsApp
export async function DELETE(req: NextRequest, { params }: { params: { bancaId: string } }) {
  try {
    const { bancaId } = params;
    
    // Remover da "base de dados"
    delete JORNALEIROS_WHATSAPP[bancaId];
    
    // Em produção, remover do banco de dados
    // await db.jornaleiroWhatsApp.delete({
    //   where: { bancaId }
    // });

    console.log('[JORNALEIRO] WhatsApp removido:', { bancaId });

    return NextResponse.json({
      success: true,
      message: 'Configuração removida com sucesso'
    });

  } catch (error: any) {
    console.error('[JORNALEIRO] Erro ao remover WhatsApp:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao remover configuração'
    }, { status: 500 });
  }
}
