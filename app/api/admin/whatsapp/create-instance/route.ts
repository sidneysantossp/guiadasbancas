import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";

// POST - Criar nova instância na Evolution API
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { instanceName } = body;

    const config = getWhatsAppConfig();
    
    if (!config.baseUrl || !config.apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Configure a URL e API Key primeiro'
      }, { status: 400 });
    }

    const finalInstanceName = instanceName || config.instanceName;

    // Criar instância na Evolution API
    const response = await fetch(`${config.baseUrl}/instance/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': config.apiKey
      },
      body: JSON.stringify({
        instanceName: finalInstanceName,
        token: config.apiKey, // Usar a mesma API key como token
        qrcode: true,
        integration: "WHATSAPP-BAILEYS"
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();

    console.log('[ADMIN] Instância WhatsApp criada:', {
      instanceName: finalInstanceName,
      success: true
    });

    return NextResponse.json({
      success: true,
      message: 'Instância criada com sucesso',
      data: {
        instanceName: finalInstanceName,
        ...data
      }
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao criar instância WhatsApp:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao criar instância'
    }, { status: 500 });
  }
}
