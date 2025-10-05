import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

/**
 * Teste SUPER SIMPLES de envio WhatsApp
 * Acesse: /api/whatsapp/test-simple?phone=11999999999
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({
        error: 'Informe o telefone: ?phone=11999999999'
      }, { status: 400 });
    }

    console.log('[Test Simple] ===== TESTE SIMPLES =====');
    console.log('[Test Simple] Telefone recebido:', phone);

    // Formatar telefone
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    console.log('[Test Simple] Telefone formatado:', formattedPhone);

    // Mensagem SUPER SIMPLES
    const message = 'Teste simples WhatsApp';

    console.log('[Test Simple] Enviando mensagem simples...');

    // Enviar
    const sent = await whatsappService.sendMessage({
      number: formattedPhone,
      text: message
    });

    console.log(`[Test Simple] Resultado: ${sent ? 'SUCESSO ✅' : 'FALHOU ❌'}`);
    console.log('[Test Simple] ===== FIM =====');

    if (sent) {
      return NextResponse.json({
        success: true,
        message: '✅ Mensagem simples enviada!',
        phone: formattedPhone
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Falha ao enviar mensagem simples',
        phone: formattedPhone,
        hint: 'Verifique os logs do terminal'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[Test Simple] ERRO:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
