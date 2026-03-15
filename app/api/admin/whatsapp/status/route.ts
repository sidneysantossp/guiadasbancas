import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import { callEvolutionApi, getEvolutionErrorMessage } from "@/lib/evolution-api";
import { requireAdminAuth } from "@/lib/security/admin-auth";

// GET - Verificar status da instância Evolution API
export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

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

    const result = await callEvolutionApi({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      path: `/instance/connectionState/${encodeURIComponent(config.instanceName)}`,
      method: "GET",
      timeoutMs: 15000,
    });

    if (!result.ok) {
      const unauthorized = result.status === 401 || result.status === 403;
      const unauthorizedHint = unauthorized
        ? `Sem permissão para acessar a instância "${config.instanceName}" com a API Key atual.`
        : null;
      return NextResponse.json({
        connected: false,
        status: unauthorized ? 'Não autorizado' : 'Erro na conexão',
        error: unauthorizedHint || getEvolutionErrorMessage(result, 'Falha ao conectar com Evolution API'),
        upstreamStatus: result.status,
        authModeTried: result.authMode,
        timestamp: new Date().toISOString()
      });
    }

    const data = result.data || {};
    const instance = data?.instance || data;
    const rawState = (instance?.state || instance?.status || instance?.connectionStatus || 'unknown').toString();
    const state = rawState.toLowerCase();
    const isConnected = state === 'open' || state === 'connected' || state === 'online';

    return NextResponse.json({
      connected: isConnected,
      status: isConnected ? 'Conectado e funcionando' : 'Instância não conectada',
      timestamp: new Date().toISOString(),
      authModeUsed: result.authMode,
      instanceInfo: {
        name: config.instanceName,
        state: rawState || 'unknown',
        profileName: instance?.profileName || null,
        profilePicUrl: instance?.profilePicUrl || null
      }
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao verificar status WhatsApp:', error);
    
    return NextResponse.json({
      connected: false,
      status: 'Erro na conexão',
      error: error.message || 'Falha ao conectar com Evolution API',
      timestamp: new Date().toISOString()
    });
  }
}
