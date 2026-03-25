import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import {
  getEvolutionErrorMessage,
  normalizeEvolutionPhoneDigits,
  sendEvolutionTextMessage,
} from "@/lib/evolution-api";
import { requireAdminAuth } from "@/lib/security/admin-auth";

// POST - Enviar mensagem de teste
export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const body = await req.json();
    const { phone, message } = body;

    console.log('[WHATSAPP TEST] 📱 Iniciando teste de envio:', { phone, messageLength: message?.length });

    if (!phone || !message) {
      console.error('[WHATSAPP TEST] ❌ Dados incompletos:', { phone: !!phone, message: !!message });
      return NextResponse.json({
        success: false,
        error: 'Telefone e mensagem são obrigatórios'
      }, { status: 400 });
    }

    const config = await getWhatsAppConfig();
    
    console.log('[WHATSAPP TEST] 🔧 Configuração:', {
      baseUrl: config.baseUrl,
      instanceName: config.instanceName,
      hasApiKey: !!config.apiKey,
      isActive: config.isActive
    });

    const baseUrl = (config.baseUrl || '').trim().replace(/\/$/, '');
    const apiKey = (config.apiKey || '').trim();
    const instanceName = (config.instanceName || '').trim();

    console.log('[WHATSAPP TEST] 🔑 API Key debug:', {
      length: apiKey.length,
      json: JSON.stringify(apiKey),
    });
    
    if (!baseUrl || !apiKey) {
      console.error('[WHATSAPP TEST] ❌ Configuração incompleta');
      return NextResponse.json({
        success: false,
        error: 'Configure a URL e API Key primeiro'
      }, { status: 400 });
    }

    // Formatar número brasileiro
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = normalizeEvolutionPhoneDigits(phone);

    console.log('[WHATSAPP TEST] 📞 Número formatado:', { original: phone, clean: cleanPhone, formatted: formattedPhone });
    const result = await sendEvolutionTextMessage({
      baseUrl,
      apiKey,
      instanceName,
      number: formattedPhone,
      text: message,
      timeoutMs: 20000,
    });

    if (!result.ok) {
      const unauthorized = result.status === 401 || result.status === 403;
      return NextResponse.json({
        success: false,
        error: unauthorized
          ? `Sem permissão para enviar na instância "${instanceName}" com a API Key atual.`
          : getEvolutionErrorMessage(result, 'Falha ao enviar mensagem de teste'),
        upstreamStatus: result.status,
        timestamp: new Date().toISOString(),
      });
    }

    const data = result.data || {};
    const messageId = result.messageId;
    const success = Boolean(messageId) || result.status === 200 || result.status === 201;

    console.log('[WHATSAPP TEST] 📦 Response data:', data);
    console.log('[ADMIN] Mensagem de teste enviada:', {
      to: result.recipientUsed || formattedPhone,
      success,
      messageId
    });

    return NextResponse.json({
      success,
      message: success ? 'Mensagem enviada com sucesso' : 'Falha ao enviar mensagem',
      data: {
        messageId,
        phone: result.recipientUsed || formattedPhone,
        authModeUsed: result.authMode,
      }
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao enviar mensagem de teste:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao enviar mensagem'
    });
  }
}
