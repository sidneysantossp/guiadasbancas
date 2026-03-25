import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import { getEvolutionInstanceStatus } from "@/lib/evolution-api";
import { buildNoStoreHeaders } from "@/lib/modules/http/no-store";
import { requireAdminAuth } from "@/lib/security/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET - Verificar status da instância Evolution API
export async function GET(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

    const config = await getWhatsAppConfig();
    
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
      }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
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
      authModeUsed: instanceStatus.authModeUsed,
      source: instanceStatus.source,
      hasStateMismatch: instanceStatus.hasStateMismatch || false,
      instanceInfo: {
        name: config.instanceName,
        state: instanceStatus.state || 'unknown',
        connectionState: instanceStatus.connectionState || null,
        fetchState: instanceStatus.fetchState || null,
        profileName: instanceStatus.profileName || null,
        profilePicUrl: instanceStatus.profilePicUrl || null,
        instanceId: instanceStatus.instanceId || null,
      }
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao verificar status WhatsApp:', error);
    
    return NextResponse.json({
      connected: false,
      status: 'Erro na conexão',
      error: error.message || 'Falha ao conectar com Evolution API',
      timestamp: new Date().toISOString()
    }, { headers: buildNoStoreHeaders({ isPrivate: true }) });
  }
}
