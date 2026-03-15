import { NextRequest, NextResponse } from "next/server";
import { getWhatsAppConfig } from "@/lib/whatsapp-config";
import { callEvolutionApi, getEvolutionErrorMessage } from "@/lib/evolution-api";
import { requireAdminAuth } from "@/lib/security/admin-auth";

// POST - Criar nova instância na Evolution API
export async function POST(req: NextRequest) {
  try {
    const authError = await requireAdminAuth(req);
    if (authError) return authError;

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

    const payload = {
      instanceName: finalInstanceName,
      token: config.apiKey,
      qrcode: true,
      integration: "WHATSAPP-BAILEYS"
    };

    const result = await callEvolutionApi({
      baseUrl: config.baseUrl,
      apiKey: config.apiKey,
      path: '/instance/create',
      method: 'POST',
      body: payload,
      timeoutMs: 20000,
    });

    if (!result.ok) {
      const errMsg = getEvolutionErrorMessage(result, 'Erro ao criar instância');
      const alreadyExists =
        (result.status === 403 || result.status === 409) &&
        /already in use|já está em uso|already exists|exist/i.test(errMsg);

      if (alreadyExists) {
        // Quando o nome já existe, validar se a chave atual possui acesso a essa instância.
        // Se retornar 401/403, o nome está em uso por outro tenant/chave.
        const ownershipCheck = await callEvolutionApi({
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
          path: `/instance/connectionState/${encodeURIComponent(finalInstanceName)}`,
          method: "GET",
          timeoutMs: 10000,
        });

        if (!ownershipCheck.ok && (ownershipCheck.status === 401 || ownershipCheck.status === 403)) {
          return NextResponse.json({
            success: false,
            error: `A instância \"${finalInstanceName}\" já existe, mas não pertence a esta API Key. Use um nome novo de instância.`,
            upstreamStatus: ownershipCheck.status,
            timestamp: new Date().toISOString(),
          });
        }

        return NextResponse.json({
          success: true,
          message: 'Instância já existe e está pronta para conexão',
          data: {
            instanceName: finalInstanceName,
            alreadyExists: true,
          },
          timestamp: new Date().toISOString(),
        });
      }

      return NextResponse.json({
        success: false,
        error: errMsg,
        upstreamStatus: result.status,
        timestamp: new Date().toISOString(),
      });
    }

    const data = result.data || {};

    console.log('[ADMIN] Instância WhatsApp criada:', {
      instanceName: finalInstanceName,
      success: true
    });

    return NextResponse.json({
      success: true,
      message: 'Instância criada com sucesso',
      data: {
        instanceName: finalInstanceName,
        authModeUsed: result.authMode,
        ...data
      }
    });

  } catch (error: any) {
    console.error('[ADMIN] Erro ao criar instância WhatsApp:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro ao criar instância'
    });
  }
}
