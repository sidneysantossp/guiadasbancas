import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isAdminAuthorized } from '@/lib/security/admin-auth';

export const dynamic = 'force-dynamic';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const headerDistribuidorId = request.headers.get('x-distribuidor-id');
    const adminAccess = await isAdminAuthorized(request);

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    if (!UUID_REGEX.test(distribuidorId)) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor inválido' },
        { status: 400 }
      );
    }

    if (!adminAccess && (!headerDistribuidorId || headerDistribuidorId !== distribuidorId)) {
      return NextResponse.json(
        { success: false, error: 'Não autorizado para este distribuidor' },
        { status: 403 }
      );
    }

    // Buscar dados do distribuidor incluindo status ativo e base_url
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, ativo, application_token, company_token, base_url')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({
        distribuidor: 'Desconhecido',
        success: false,
        error: 'Distribuidor não encontrado',
      });
    }

    // Verificar se o distribuidor está ativo no admin
    if (!distribuidor.ativo) {
      return NextResponse.json({
        distribuidor: distribuidor.nome,
        success: false,
        error: 'Integração desativada pelo administrador.',
        isDisabled: true,
      });
    }

    // Verificar se tem tokens configurados (sem expor detalhes sensíveis)
    if (!distribuidor.application_token || !distribuidor.company_token) {
      return NextResponse.json({
        distribuidor: distribuidor.nome,
        success: false,
        error: 'Integração não configurada. Entre em contato com o suporte para ativar.',
        needsSetup: true,
      });
    }

    // Testar conexão com a API Mercos usando a base_url configurada
    const startTime = Date.now();
    const baseUrl = distribuidor.base_url || 'https://app.mercos.com/api/v1';
    
    try {
      const mercosRes = await fetch(
        `${baseUrl}/produtos?limit=1&order_by=ultima_alteracao&order_direction=desc`,
        {
          headers: {
            'ApplicationToken': distribuidor.application_token,
            'CompanyToken': distribuidor.company_token,
            'Content-Type': 'application/json',
          },
        }
      );

      const latency = Date.now() - startTime;

      if (!mercosRes.ok) {
        return NextResponse.json({
          distribuidor: distribuidor.nome,
          success: false,
          error: `Erro na API Mercos: ${mercosRes.status} ${mercosRes.statusText}`,
          latency_ms: latency,
        });
      }

      const mercosData = await mercosRes.json();
      const sample = Array.isArray(mercosData) && mercosData.length > 0 ? mercosData[0] : null;

      return NextResponse.json({
        distribuidor: distribuidor.nome,
        success: true,
        latency_ms: latency,
        sample: sample ? {
          id: sample.id,
          nome: sample.nome,
          ultima_alteracao: sample.ultima_alteracao,
          saldo_estoque: sample.saldo_estoque,
          ativo: sample.ativo,
          excluido: sample.excluido,
        } : null,
      });
    } catch (fetchError: any) {
      return NextResponse.json({
        distribuidor: distribuidor.nome,
        success: false,
        error: `Erro de conexão: ${fetchError.message}`,
        latency_ms: Date.now() - startTime,
      });
    }
  } catch (error: any) {
    console.error('[Health] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
