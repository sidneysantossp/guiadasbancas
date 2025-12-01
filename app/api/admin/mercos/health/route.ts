import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function GET() {
  try {
    const { data: distribuidores, error } = await supabaseAdmin
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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
