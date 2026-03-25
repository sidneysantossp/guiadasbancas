import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import { getEvolutionInstanceStatus } from "@/lib/evolution-api";

// GET - Verificar status da conexão WhatsApp
export async function GET(req: NextRequest) {
  try {
    const config = await getWhatsAppConfig();
    
    if (!config.baseUrl || !config.apiKey) {
      return NextResponse.json({
        connected: false,
        status: 'WhatsApp não configurado',
        error: 'Configure a Evolution API no painel admin primeiro',
        timestamp: new Date().toISOString()
      });
    }

    const instanceStatus = await getEvolutionInstanceStatus({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      instanceName: config.instanceName,
      timeoutMs: 15000,
    });
    
    return NextResponse.json({
      connected: instanceStatus.connected,
      status: instanceStatus.connected ? 'Conectado e funcionando' : 'Instância não conectada',
      timestamp: new Date().toISOString(),
      instanceInfo: {
        name: config.instanceName,
        state: instanceStatus.state || 'unknown',
        profileName: instanceStatus.profileName || null,
        profilePicUrl: instanceStatus.profilePicUrl || null,
        instanceId: instanceStatus.instanceId || null,
      },
      source: instanceStatus.source,
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

    const config = await getWhatsAppConfig();
    
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
