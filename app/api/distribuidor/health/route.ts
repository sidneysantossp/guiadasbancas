import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, mercos_application_token, mercos_company_token')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({
        distribuidor: 'Desconhecido',
        success: false,
        error: 'Distribuidor não encontrado',
      });
    }

    // Verificar se tem tokens configurados (sem expor detalhes sensíveis)
    if (!distribuidor.mercos_application_token || !distribuidor.mercos_company_token) {
      return NextResponse.json({
        distribuidor: distribuidor.nome,
        success: false,
        error: 'Integração não configurada. Entre em contato com o suporte para ativar.',
        needsSetup: true,
      });
    }

    // Testar conexão com a API Mercos
    const startTime = Date.now();
    
    try {
      const mercosRes = await fetch(
        'https://app.mercos.com/api/v2/produtos?limite=1&ordenar_por=ultima_alteracao&ordem=desc',
        {
          headers: {
            'ApplicationToken': distribuidor.mercos_application_token,
            'CompanyToken': distribuidor.mercos_company_token,
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
