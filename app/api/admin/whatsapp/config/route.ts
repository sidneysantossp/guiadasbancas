import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig, setWhatsAppConfig, validateWhatsAppConfig } from "@/lib/whatsapp-config";

// GET - Buscar configurações salvas
export async function GET(req: NextRequest) {
  try {
    const config = getWhatsAppConfig();
    console.log('[ADMIN] Configurações WhatsApp solicitadas:', config);
    return NextResponse.json(config);
  } catch (error: any) {
    console.error('[ADMIN] Erro ao buscar configurações:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao buscar configurações'
    }, { status: 500 });
  }
}

// POST - Salvar configurações
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { baseUrl, apiKey, instanceName, isActive } = body;

    // Validar configuração
    const errors = validateWhatsAppConfig({ baseUrl, apiKey, instanceName });
    if (errors.length > 0) {
      return NextResponse.json({
        error: errors.join(', ')
      }, { status: 400 });
    }

    // Salvar configurações
    const savedConfig = setWhatsAppConfig({
      baseUrl: baseUrl.trim(),
      apiKey: apiKey.trim(),
      instanceName: instanceName?.trim() || 'guiadasbancas-central',
      isActive: Boolean(isActive)
    });

    console.log('[ADMIN] Configurações WhatsApp salvas:', savedConfig);

    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      data: savedConfig
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao salvar configurações:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao salvar configurações'
    }, { status: 500 });
  }
}
