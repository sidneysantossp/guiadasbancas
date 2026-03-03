import { NextResponse } from "next/server";

/**
 * API para tentar reconectar WhatsApp
 * Acesse: /api/whatsapp/reconnect
 */
export async function POST() {
  try {
    const baseUrl = process.env.EVOLUTION_API_URL || 'https://api.guiadasbancas.com.br';
    const apiKey = process.env.EVOLUTION_API_KEY || '';
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'guiadasbancas-central';

    console.log('[WhatsApp Reconnect] Tentando reconectar instância:', instanceName);

    // Tentar conectar
    const connectResponse = await fetch(`${baseUrl}/instance/connect/${instanceName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      }
    });

    if (!connectResponse.ok) {
      throw new Error(`HTTP error! status: ${connectResponse.status}`);
    }

    const connectData = await connectResponse.json();
    console.log('[WhatsApp Reconnect] Resposta:', connectData);

    // Se retornar QR Code
    if (connectData.qrcode) {
      return NextResponse.json({
        success: true,
        message: '📱 QR Code gerado! Escaneie com WhatsApp',
        qrcode: connectData.qrcode,
        base64: connectData.base64,
        instructions: [
          '1. Abra WhatsApp no celular',
          '2. Menu → Dispositivos Conectados',
          '3. Conectar Dispositivo',
          '4. Escaneie o QR Code abaixo'
        ]
      });
    }

    // Se já estiver conectado
    if (connectData.state === 'open') {
      return NextResponse.json({
        success: true,
        message: '✅ WhatsApp já está CONECTADO!',
        state: connectData.state
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Tentativa de conexão iniciada',
      data: connectData
    });

  } catch (error) {
    console.error('[WhatsApp Reconnect] Erro:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao reconectar',
      recommendation: 'Acesse manualmente: https://api.guiadasbancas.com.br'
    }, { status: 500 });
  }
}

/**
 * Verificar status da conexão
 */
export async function GET() {
  try {
    const baseUrl = process.env.EVOLUTION_API_URL || 'https://api.guiadasbancas.com.br';
    const apiKey = process.env.EVOLUTION_API_KEY || '';
    const instanceName = process.env.EVOLUTION_INSTANCE_NAME || 'guiadasbancas-central';

    console.log('[WhatsApp Status] Verificando status da instância:', instanceName);

    const statusResponse = await fetch(`${baseUrl}/instance/connectionState/${instanceName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      }
    });

    if (!statusResponse.ok) {
      throw new Error(`HTTP error! status: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    console.log('[WhatsApp Status] Resposta:', statusData);

    const isConnected = statusData.instance?.state === 'open';

    return NextResponse.json({
      connected: isConnected,
      state: statusData.instance?.state || 'unknown',
      message: isConnected 
        ? '✅ WhatsApp está CONECTADO' 
        : '❌ WhatsApp está DESCONECTADO',
      instance: instanceName,
      details: statusData,
      nextSteps: isConnected ? [] : [
        'Acesse: https://api.guiadasbancas.com.br',
        'Vá em Instâncias',
        'Conecte a instância guiadasbancas-central',
        'Escaneie o QR Code'
      ]
    });

  } catch (error) {
    console.error('[WhatsApp Status] Erro:', error);
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar status',
      recommendation: 'Verifique se Evolution API está acessível'
    }, { status: 500 });
  }
}
