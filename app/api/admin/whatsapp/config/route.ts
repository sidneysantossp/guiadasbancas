import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig, setWhatsAppConfig, validateWhatsAppConfig } from "@/lib/whatsapp-config";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { requireAdminAuth } from "@/lib/security/admin-auth";

function sanitizeWhatsAppConfig(config: {
  baseUrl: string;
  apiKey: string;
  instanceName: string;
  isActive: boolean;
}) {
  const apiKey = typeof config.apiKey === "string" ? config.apiKey.trim() : "";

  return {
    baseUrl: config.baseUrl,
    apiKey: "",
    apiKeyConfigured: Boolean(apiKey),
    apiKeySuffix: apiKey ? apiKey.slice(-4) : null,
    instanceName: config.instanceName,
    isActive: config.isActive,
  };
}

// GET - Buscar configurações salvas
export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const config = await getWhatsAppConfig();
    return NextResponse.json(sanitizeWhatsAppConfig(config), {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });
  } catch (error: any) {
    console.error('[ADMIN] Erro ao buscar configurações:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao buscar configurações'
    }, { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) });
  }
}

// POST - Salvar configurações
export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const body = await req.json();
    const { baseUrl, apiKey, instanceName, isActive } = body;
    const currentConfig = await getWhatsAppConfig();
    const normalizedApiKey = typeof apiKey === "string" ? apiKey.trim() : "";
    const effectiveConfig = {
      baseUrl: typeof baseUrl === "string" ? baseUrl.trim() : currentConfig.baseUrl,
      apiKey: normalizedApiKey || currentConfig.apiKey,
      instanceName:
        typeof instanceName === "string" && instanceName.trim()
          ? instanceName.trim()
          : currentConfig.instanceName || 'guiadasbancas',
    };

    // Validar configuração
    const errors = validateWhatsAppConfig(effectiveConfig);
    if (errors.length > 0) {
      return NextResponse.json({
        error: errors.join(', ')
      }, { status: 400, headers: buildNoStoreHeaders({ isPrivate: true }) });
    }

    // Salvar configurações
    const savedConfig = await setWhatsAppConfig({
      baseUrl: effectiveConfig.baseUrl,
      ...(normalizedApiKey ? { apiKey: normalizedApiKey } : {}),
      instanceName: effectiveConfig.instanceName,
      isActive: Boolean(isActive)
    });

    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      data: sanitizeWhatsAppConfig(savedConfig)
    }, {
      headers: buildNoStoreHeaders({ isPrivate: true }),
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao salvar configurações:', error);
    return NextResponse.json({
      error: error.message || 'Erro ao salvar configurações'
    }, { status: 500, headers: buildNoStoreHeaders({ isPrivate: true }) });
  }
}
