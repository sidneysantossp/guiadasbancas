import { NextRequest, NextResponse } from "next/server";
import { sendStatusWhatsAppUpdate } from "@/lib/whatsapp";

/**
 * API para enviar notificação de mudança de status via WhatsApp ao CLIENTE
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerPhone, newStatus, estimatedDelivery } = body;

    console.log('[WhatsApp Status Update] ===== INÍCIO =====');
    console.log('[WhatsApp Status Update] Body recebido:', JSON.stringify(body, null, 2));

    // Validações
    if (!orderId || !customerPhone || !newStatus) {
      console.error('[WhatsApp Status Update] ❌ Dados obrigatórios faltando:', { orderId, customerPhone, newStatus });
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando', received: { orderId, customerPhone, newStatus } },
        { status: 400 }
      );
    }

    console.log(`[WhatsApp Status Update] ✅ Dados validados`);
    console.log(`[WhatsApp Status Update] 📞 Telefone: ${customerPhone}`);
    console.log(`[WhatsApp Status Update] 📋 Pedido: ${orderId}`);
    console.log(`[WhatsApp Status Update] 🔄 Status: ${newStatus}`);

    // Enviar notificação via WhatsApp
    console.log('[WhatsApp Status Update] 📤 Chamando sendStatusWhatsAppUpdate...');
    const sent = await sendStatusWhatsAppUpdate(
      orderId,
      customerPhone,
      newStatus,
      estimatedDelivery
    );

    console.log(`[WhatsApp Status Update] Resultado do envio: ${sent ? '✅ SUCESSO' : '❌ FALHOU'}`);

    if (sent) {
      console.log('[WhatsApp Status Update] ===== FIM (SUCESSO) =====');
      return NextResponse.json({
        success: true,
        message: 'Notificação enviada ao cliente'
      });
    } else {
      console.error('[WhatsApp Status Update] ===== FIM (FALHA) =====');
      return NextResponse.json({
        success: false,
        message: 'Falha ao enviar notificação (WhatsApp pode estar desconectado)'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[WhatsApp Status Update] ===== ERRO CRÍTICO =====');
    console.error('[WhatsApp Status Update] Erro:', error);
    console.error('[WhatsApp Status Update] Stack:', error instanceof Error ? error.stack : 'N/A');
    return NextResponse.json(
      { error: 'Erro ao enviar notificação WhatsApp', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
