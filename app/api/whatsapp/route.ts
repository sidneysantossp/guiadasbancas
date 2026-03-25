import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import {
  getEvolutionInstanceStatus,
  normalizeEvolutionPhoneDigits,
  sendEvolutionTextMessage,
} from "@/lib/evolution-api";

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
      deliveryReady: instanceStatus.deliveryReady,
      status: instanceStatus.deliveryReady
        ? 'Conectado e funcionando'
        : instanceStatus.connected
          ? 'Conectado com inconsistência de sessão'
          : 'Instância não conectada',
      timestamp: new Date().toISOString(),
      instanceInfo: {
        name: config.instanceName,
        state: instanceStatus.state || 'unknown',
        connectionState: instanceStatus.connectionState || null,
        fetchState: instanceStatus.fetchState || null,
        profileName: instanceStatus.profileName || null,
        profilePicUrl: instanceStatus.profilePicUrl || null,
        instanceId: instanceStatus.instanceId || null,
      },
      source: instanceStatus.source,
      hasStateMismatch: instanceStatus.hasStateMismatch || false,
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
    const formattedPhone = normalizeEvolutionPhoneDigits(phone);
    const result = await sendEvolutionTextMessage({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      instanceName: config.instanceName,
      number: formattedPhone,
      text: message,
      timeoutMs: 20000,
    });

    if (!result.ok) {
      throw new Error(`HTTP ${result.status}: ${result.raw || result.error}`);
    }
    const success = Boolean(result.messageId);

    console.log('[JORNALEIRO] Mensagem de teste enviada:', {
      to: result.recipientUsed || formattedPhone,
      success,
      messageId: result.messageId
    });

    return NextResponse.json({
      success,
      message: success ? 'Mensagem enviada com sucesso' : 'Falha ao enviar mensagem',
      timestamp: new Date().toISOString(),
      data: {
        messageId: result.messageId,
        phone: result.recipientUsed || formattedPhone
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
