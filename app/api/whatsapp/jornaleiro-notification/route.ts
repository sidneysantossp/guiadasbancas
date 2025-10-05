import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

/**
 * API para enviar notificação ao JORNALEIRO sobre mudança de status
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, bancaId, action, oldStatus, newStatus, customerName } = body;

    // Validações
    if (!orderId || !bancaId || !action) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    console.log(`[WhatsApp Jornaleiro] Notificando banca ${bancaId} - Ação: ${action}`);

    // Buscar dados do jornaleiro
    const jornaleiro = await whatsappService.getJornaleiroWhatsApp(bancaId);
    
    if (!jornaleiro || !jornaleiro.isActive) {
      console.log(`[WhatsApp Jornaleiro] Banca ${bancaId} não tem WhatsApp ativo`);
      return NextResponse.json({
        success: false,
        message: 'WhatsApp do jornaleiro não configurado'
      });
    }

    // Montar mensagem baseada na ação
    let message = '';
    
    if (action === 'status_change') {
      const statusLabels: Record<string, string> = {
        'novo': 'Novo',
        'confirmado': 'Confirmado',
        'em_preparo': 'Em Preparo',
        'saiu_para_entrega': 'Saiu para Entrega',
        'entregue': 'Entregue'
      };

      message = `✅ *Atualização de Pedido - ${jornaleiro.bancaName}*\n\n`;
      message += `📋 *Pedido:* #${orderId}\n`;
      message += `👤 *Cliente:* ${customerName}\n`;
      message += `🔄 *Status alterado:* ${statusLabels[oldStatus] || oldStatus} → ${statusLabels[newStatus] || newStatus}\n\n`;
      message += `📱 *Confirmação enviada!*\n`;
      message += `O cliente ${customerName} foi notificado sobre a mudança de status.\n\n`;
      message += `⏰ ${new Date().toLocaleString('pt-BR')}`;
    }

    if (!message) {
      return NextResponse.json({
        success: false,
        message: 'Tipo de ação não suportado'
      });
    }

    // Formatar número
    const cleanPhone = jornaleiro.whatsappNumber.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    // Enviar mensagem
    const sent = await whatsappService.sendMessage({
      number: formattedPhone,
      text: message
    });

    if (sent) {
      console.log(`[WhatsApp Jornaleiro] ✅ Notificação enviada para ${jornaleiro.bancaName} (${formattedPhone})`);
      return NextResponse.json({
        success: true,
        message: 'Notificação enviada ao jornaleiro'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha ao enviar notificação (WhatsApp pode estar desconectado)'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[WhatsApp Jornaleiro] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar notificação WhatsApp' },
      { status: 500 }
    );
  }
}
