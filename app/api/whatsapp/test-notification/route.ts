import { NextRequest, NextResponse } from "next/server";
import { whatsappService } from "@/lib/whatsapp";

/**
 * API de TESTE para verificar envio de WhatsApp
 * Acesse: /api/whatsapp/test-notification?phone=11999999999
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

    console.log('[WhatsApp Test] ===== TESTE DE NOTIFICAÇÃO =====');
    console.log('[WhatsApp Test] Telefone:', phone);

    // 1. Verificar conexão
    console.log('[WhatsApp Test] 1️⃣ Verificando conexão...');
    const isConnected = await whatsappService.checkConnection();
    console.log(`[WhatsApp Test] Conexão: ${isConnected ? '✅ CONECTADO' : '❌ DESCONECTADO'}`);

    if (!isConnected) {
      return NextResponse.json({
        success: false,
        message: '❌ WhatsApp está DESCONECTADO',
        connection: false
      }, { status: 500 });
    }

    // 2. Formatar telefone
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    console.log(`[WhatsApp Test] 2️⃣ Telefone formatado: ${formattedPhone}`);

    // 3. Enviar mensagem de teste
    console.log('[WhatsApp Test] 3️⃣ Enviando mensagem de teste...');
    const message = `🧪 *TESTE DE NOTIFICAÇÃO*\n\n` +
                   `✅ Este é um teste do sistema de notificações.\n\n` +
                   `📱 Se você recebeu esta mensagem, o WhatsApp está funcionando corretamente!\n\n` +
                   `⏰ ${new Date().toLocaleString('pt-BR')}`;

    const sent = await whatsappService.sendMessage({
      number: formattedPhone,
      text: message
    });

    console.log(`[WhatsApp Test] Resultado: ${sent ? '✅ ENVIADO' : '❌ FALHOU'}`);
    console.log('[WhatsApp Test] ===== FIM DO TESTE =====');

    if (sent) {
      return NextResponse.json({
        success: true,
        message: '✅ Mensagem de teste ENVIADA com sucesso!',
        connection: true,
        phone: formattedPhone
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Falha ao enviar mensagem de teste',
        connection: true,
        phone: formattedPhone
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[WhatsApp Test] ERRO:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
