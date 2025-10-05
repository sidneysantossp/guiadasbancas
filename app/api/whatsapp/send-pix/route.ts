import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

/**
 * API para enviar código PIX para o cliente via WhatsApp
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, customerPhone, customerName, pixCode, total, bancaName } = body;

    console.log('[WhatsApp Send PIX] ===== INÍCIO =====');
    console.log('[WhatsApp Send PIX] Pedido:', orderId);
    console.log('[WhatsApp Send PIX] Cliente:', customerName);
    console.log('[WhatsApp Send PIX] Telefone:', customerPhone);

    // Validações
    if (!orderId || !customerPhone || !pixCode) {
      console.error('[WhatsApp Send PIX] Dados obrigatórios faltando');
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      );
    }

    // Formatar telefone
    const cleanPhone = customerPhone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    console.log('[WhatsApp Send PIX] Telefone formatado:', formattedPhone);

    // Montar mensagem - VERSÃO CURTA
    const message = `*${bancaName || 'Banca'}*

Olá, ${customerName}!

✅ Recebemos seu pedido #${orderId.substring(0, 8)}

💰 *Valor: R$ ${(total || 0).toFixed(2)}*

━━━━━━━━━━━━━━━━

💳 *PARA CONFIRMAR:*

Pague via PIX com o código abaixo:

${pixCode}

━━━━━━━━━━━━━━━━

⚠️ *IMPORTANTE:*
Após pagar, envie o comprovante aqui no WhatsApp para confirmarmos!

Aguardamos seu pagamento! 😊`.trim();

    console.log('[WhatsApp Send PIX] Mensagem preparada, enviando...');
    console.log('[WhatsApp Send PIX] Tamanho da mensagem:', message.length, 'caracteres');

    // Enviar mensagem
    console.log('[WhatsApp Send PIX] Chamando whatsappService.sendMessage...');
    const sent = await whatsappService.sendMessage({
      number: formattedPhone,
      text: message
    });

    console.log(`[WhatsApp Send PIX] Resultado do sendMessage: ${sent}`);
    console.log(`[WhatsApp Send PIX] ${sent ? '✅ SUCESSO' : '❌ FALHOU'}`);
    console.log('[WhatsApp Send PIX] ===== FIM =====');

    if (sent) {
      return NextResponse.json({
        success: true,
        message: 'PIX enviado para o cliente com sucesso!'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Falha ao enviar PIX (verifique se WhatsApp está conectado)'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[WhatsApp Send PIX] Erro:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro ao enviar PIX',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
