import { NextRequest, NextResponse } from "next/server";
import { sendStatusWhatsAppUpdate } from "@/lib/whatsapp";

/**
 * API para enviar notificação de mudança de status via WhatsApp ao CLIENTE
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerPhone, newStatus, estimatedDelivery } = body;

    // Validações
    if (!orderId || !customerPhone || !newStatus) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    console.log(`[WhatsApp Status Update] Enviando para cliente ${customerPhone} - Pedido #${orderId} - Status: ${newStatus}`);

    // Enviar notificação via WhatsApp
    const sent = await sendStatusWhatsAppUpdate(
      orderId,
      customerPhone,
      newStatus,
      estimatedDelivery
    );

    if (sent) {
      return NextResponse.json({
        success: true,
        message: 'Notificação enviada ao cliente'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha ao enviar notificação (WhatsApp pode estar desconectado)'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[WhatsApp Status Update] Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar notificação WhatsApp' },
      { status: 500 }
    );
  }
}
