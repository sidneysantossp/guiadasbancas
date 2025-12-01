import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * Healthcheck periódico da integração Mercos para todos os distribuidores ativos.
 * - Usa tokens do cadastro de distribuidores (não depende de .env específicos).
 * - Para proteger, exige Authorization: Bearer CRON_SECRET se definido.
 * - Faz testConnection + leitura de 1 produto (última alteração) para validar permissão/latência.
 */
async function handler(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = supabaseAdmin;
  const { data: distribuidores, error } = await supabase
    .from('distribuidores')
    .select('id, nome, application_token, company_token, base_url, ativo')
    .eq('ativo', true);

  if (error || !distribuidores) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar distribuidores' }, { status: 500 });
  }

  const results: any[] = [];

  for (const dist of distribuidores) {
    const mercosApi = new MercosAPI({
      applicationToken: dist.application_token,
      companyToken: dist.company_token,
      baseUrl: dist.base_url || 'https://app.mercos.com/api/v1',
    });

    const inicio = Date.now();
    try {
      const conn = await mercosApi.testConnection();
      if (!conn.success) throw new Error(conn.error || 'Falha testConnection');

      // leitura mínima com ordenação por ultima_alteracao desc
      const { produtos } = await mercosApi.getBatchProdutosByAlteracao({
        alteradoApos: null,
        limit: 1,
        orderDirection: 'desc',
      });

      const p = produtos[0];
      results.push({
        distribuidor: dist.nome,
        success: true,
        latency_ms: Date.now() - inicio,
        sample: p
          ? {
              id: p.id,
              nome: p.nome,
              ultima_alteracao: p.ultima_alteracao,
              saldo_estoque: p.saldo_estoque,
              ativo: p.ativo,
              excluido: p.excluido,
            }
          : null,
      });
    } catch (err: any) {
      results.push({
        distribuidor: dist.nome,
        success: false,
        error: err?.message || 'Erro desconhecido',
      });
    }
  }

  return NextResponse.json({
    success: true,
    executado_em: new Date().toISOString(),
    total: results.length,
    resultados: results,
  });
}

export async function POST(request: NextRequest) {
  return handler(request);
}

// GET para ver manualmente no navegador
export async function GET(request: NextRequest) {
  return handler(request);
}
