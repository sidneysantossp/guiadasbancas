import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

// POST - Enviar mensagem de teste
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, message } = body;

    if (!phone || !message) {
      return NextResponse.json({
        success: false,
        error: 'Telefone e mensagem são obrigatórios'
      }, { status: 400 });
    }

    const config = getWhatsAppConfig();
    
    if (!config.baseUrl || !config.apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Configure a URL e API Key primeiro'
      }, { status: 400 });
    }

    // Formatar número brasileiro
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    // Enviar mensagem via Evolution API
    const response = await fetch(`${config.baseUrl}/message/sendText/${config.instanceName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify({
        number: formattedPhone,
        text: message
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();

    console.log('[ADMIN] Mensagem de teste enviada:', {
      to: formattedPhone,
      success: Boolean(data.key?.id)
    });

    return NextResponse.json({
      success: Boolean(data.key?.id),
      message: data.key?.id ? 'Mensagem enviada com sucesso' : 'Falha ao enviar mensagem',
      data: {
        messageId: data.key?.id,
        phone: formattedPhone
      }
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao enviar mensagem de teste:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao enviar mensagem'
    }, { status: 500 });
  }
}
