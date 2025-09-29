import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

// GET - Verificar status da conexão WhatsApp
export async function GET(req: NextRequest) {
  try {
    const config = getWhatsAppConfig();
    
    if (!config.baseUrl || !config.apiKey) {
      return NextResponse.json({
        connected: false,
        status: 'WhatsApp não configurado',
        error: 'Configure a Evolution API no painel admin primeiro',
        timestamp: new Date().toISOString()
      });
    }

    // Verificar conexão com a Evolution API
    const response = await fetch(`${config.baseUrl}/instance/connectionState/${config.instanceName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const isConnected = data.instance?.state === 'open';
    
    return NextResponse.json({
      connected: isConnected,
      status: isConnected ? 'Conectado e funcionando' : 'Instância não conectada',
      timestamp: new Date().toISOString(),
      instanceInfo: {
        name: config.instanceName,
        state: data.instance?.state || 'unknown'
      }
    });
  } catch (error: any) {
    console.error('[JORNALEIRO] Erro ao verificar status WhatsApp:', error);
    return NextResponse.json({
      connected: false,
      status: 'Erro na verificação',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

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
        error: 'WhatsApp não configurado. Configure no painel admin primeiro.'
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
    const success = Boolean(data.key?.id);

    console.log('[JORNALEIRO] Mensagem de teste enviada:', {
      to: formattedPhone,
      success,
      messageId: data.key?.id
    });

    return NextResponse.json({
      success,
      message: success ? 'Mensagem enviada com sucesso' : 'Falha ao enviar mensagem',
      timestamp: new Date().toISOString(),
      data: {
        messageId: data.key?.id,
        phone: formattedPhone
      }
    });
  } catch (error: any) {
    console.error('[JORNALEIRO] Erro ao enviar mensagem de teste:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao enviar mensagem',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
