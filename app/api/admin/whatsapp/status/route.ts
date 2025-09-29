import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

// GET - Verificar status da instância Evolution API
export async function GET(req: NextRequest) {
  try {
    const config = getWhatsAppConfig();
    
    console.log('[ADMIN] Verificando status com configurações:', {
      baseUrl: config.baseUrl,
      instanceName: config.instanceName,
      hasApiKey: !!config.apiKey
    });
    
    if (!config.baseUrl || !config.apiKey) {
      return NextResponse.json({
        connected: false,
        status: 'Configurações não encontradas',
        error: 'Configure a URL e API Key primeiro',
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
        state: data.instance?.state || 'unknown',
        profileName: data.instance?.profileName || null,
        profilePicUrl: data.instance?.profilePicUrl || null
      }
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao verificar status WhatsApp:', error);
    
    return NextResponse.json({
      connected: false,
      status: 'Erro na conexão',
      error: error.message || 'Falha ao conectar com Evolution API',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
