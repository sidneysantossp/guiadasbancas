import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/security/admin-auth';

export const runtime = 'nodejs';
export const maxDuration = 300;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url: string, options: RequestInit = {}): Promise<Response> {
  while (true) {
    const res = await fetch(url, options);
    if (res.status === 429) {
      const body = await res.json().catch(() => ({ tempo_ate_permitir_novamente: 2 }));
      const wait = Math.min((body.tempo_ate_permitir_novamente || 2) * 1000, 5000);
      await sleep(wait);
      continue;
    }
    return res;
  }
}

function getMercosHeaders(appToken: string, companyToken: string) {
  return {
    'ApplicationToken': appToken,
    'CompanyToken': companyToken,
    'Content-Type': 'application/json',
  };
}

function buildMercosCategoriesError(status: number, statusText: string) {
  if (status === 401 || status === 403) {
    return `Mercos recusou acesso ao endpoint /categorias (${status}). Verifique permissao de categorias para os tokens deste distribuidor.`;
  }
  return `Erro Mercos API em /categorias: ${status} ${statusText}`;
}

/**
 * POST /api/admin/categories/sync-mercos
 * Sincroniza categorias da Mercos API para distribuidor_categories
 * 
 * Body: {
 *   distribuidor_id?: string  // Se não informado, sincroniza todos os distribuidores ativos
 *   force?: boolean           // Força sincronização mesmo se já sincronizado recentemente
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdminAuth(request);
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));
    const { distribuidor_id, strict = true } = body;

    // Buscar distribuidores para sincronizar
    let query = supabaseAdmin
      .from('distribuidores')
      .select('id, nome, mercos_application_token, mercos_company_token, application_token, company_token, base_url')
      .eq('ativo', true);

    if (distribuidor_id) {
      query = query.eq('id', distribuidor_id);
    }

    const { data: distribuidores, error: distError } = await query;

    if (distError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar distribuidores',
        details: distError.message
      }, { status: 500 });
    }

    if (!distribuidores || distribuidores.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum distribuidor encontrado para sincronização'
      }, { status: 404 });
    }

    const results: Array<{
      distribuidor_id: string;
      distribuidor_nome: string;
      success: boolean;
      error?: string;
      auth_issue?: boolean;
      categorias_sincronizadas: number;
      categorias_desativadas?: number;
      categorias_desativadas_stale?: number;
      categorias_desativadas_excluidas?: number;
      total_categorias_mercos?: number;
    }> = [];

    for (const distribuidor of distribuidores) {
      const { id, nome, mercos_application_token, mercos_company_token, application_token, company_token, base_url } = distribuidor as any;
      const appToken = mercos_application_token || application_token;
      const companyToken = mercos_company_token || company_token;

      // Validar tokens
      if (!appToken || !companyToken) {
        results.push({
          distribuidor_id: id,
          distribuidor_nome: nome,
          success: false,
          error: 'Tokens da Mercos não configurados',
          categorias_sincronizadas: 0
        });
        continue;
      }

      const baseUrlNormalized = base_url || 'https://app.mercos.com/api/v1';
      const headers = getMercosHeaders(appToken, companyToken);

      try {
        // Buscar todas as categorias da Mercos
        const allCategorias: any[] = [];
        let page = 0;
        let cursor = '2020-01-01T00:00:00'; // Data inicial para pegar todas

        while (page < 100) {
          if (page > 0) await sleep(1100); // Rate limit
          page++;

          const url = `${baseUrlNormalized}/categorias?alterado_apos=${encodeURIComponent(cursor)}&limit=200&order_by=ultima_alteracao&order_direction=asc`;
          const res = await fetchWithRetry(url, { headers });

          if (!res.ok) {
            throw new Error(buildMercosCategoriesError(res.status, res.statusText));
          }

          const data = await res.json().catch(() => []);
          const arr = Array.isArray(data) ? data : [];

          for (const c of arr) {
            allCategorias.push(c);
          }

          const limitou = res.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');
          if (limitou !== '1' || arr.length === 0) break;

          // Avançar cursor
          const lastTs = arr[arr.length - 1].ultima_alteracao.replace(' ', 'T');
          if (lastTs === cursor) break;
          cursor = lastTs;
        }

        // Atualizar distribuidor_categories
        const categoriasParaUpsert = allCategorias
          .filter(c => !c.excluido) // Ignorar categorias excluídas
          .map(c => ({
            distribuidor_id: id,
            mercos_id: c.id,
            nome: c.nome,
            categoria_pai_id: c.categoria_pai_id || null,
            ativo: true,
            updated_at: new Date().toISOString()
          }));

        const { data: categoriasExistentes, error: existingError } = await supabaseAdmin
          .from('distribuidor_categories')
          .select('id, mercos_id, ativo')
          .eq('distribuidor_id', id);

        if (existingError) {
          throw new Error(`Erro ao carregar categorias existentes: ${existingError.message}`);
        }

        if (categoriasParaUpsert.length > 0) {
          const { error: upsertError } = await supabaseAdmin
            .from('distribuidor_categories')
            .upsert(categoriasParaUpsert, {
              onConflict: 'distribuidor_id,mercos_id'
            });

          if (upsertError) {
            throw new Error(`Erro ao salvar categorias: ${upsertError.message}`);
          }
        }

        // Desativar:
        // 1) categorias excluídas pela Mercos
        // 2) categorias antigas locais que não vieram mais na lista ativa da Mercos
        const mercosIdsAtivos = new Set<number>(
          categoriasParaUpsert.map((c) => Number(c.mercos_id)).filter((v) => Number.isFinite(v))
        );
        const mercosIdsExcluidos = new Set<number>(
          allCategorias
            .filter((c) => c.excluido)
            .map((c) => Number(c.id))
            .filter((v) => Number.isFinite(v))
        );

        const staleIds = new Set<string>();
        const excludedIds = new Set<string>();

        for (const row of categoriasExistentes || []) {
          if (!row?.id || row.ativo !== true) continue;
          const mercosId = Number(row.mercos_id);

          if (mercosIdsExcluidos.has(mercosId)) {
            excludedIds.add(row.id as string);
            continue;
          }

          if (!mercosIdsAtivos.has(mercosId)) {
            staleIds.add(row.id as string);
          }
        }

        const idsParaDesativar = Array.from(new Set([...staleIds, ...excludedIds]));

        if (idsParaDesativar.length > 0) {
          const { error: deactivateError } = await supabaseAdmin
            .from('distribuidor_categories')
            .update({ ativo: false, updated_at: new Date().toISOString() })
            .in('id', idsParaDesativar);

          if (deactivateError) {
            throw new Error(`Erro ao desativar categorias antigas/excluídas: ${deactivateError.message}`);
          }
        }

        results.push({
          distribuidor_id: id,
          distribuidor_nome: nome,
          success: true,
          categorias_sincronizadas: categoriasParaUpsert.length,
          categorias_desativadas: idsParaDesativar.length,
          categorias_desativadas_stale: staleIds.size,
          categorias_desativadas_excluidas: excludedIds.size,
          total_categorias_mercos: allCategorias.length
        });

      } catch (error: any) {
        const errorMessage = error?.message || 'Erro desconhecido ao sincronizar categorias';
        const isAuthIssue = errorMessage.includes('endpoint /categorias (401)') || errorMessage.includes('endpoint /categorias (403)');
        results.push({
          distribuidor_id: id,
          distribuidor_nome: nome,
          success: false,
          error: errorMessage,
          auth_issue: isAuthIssue,
          categorias_sincronizadas: 0
        });
      }
    }

    const totalSucesso = results.filter(r => r.success).length;
    const totalErro = results.filter(r => !r.success).length;
    const totalAuthIssues = results.filter(r => r.auth_issue).length;
    const overallSuccess = totalErro === 0;

    const responseBody: any = {
      success: overallSuccess,
      strict_mode: strict === true,
      message: `Sincronização concluída: ${totalSucesso} sucesso, ${totalErro} erro(s)`,
      distribuidores_processados: results.length,
      distribuidores_sucesso: totalSucesso,
      distribuidores_erro: totalErro,
      distribuidores_sem_permissao_categorias: totalAuthIssues,
      results
    };

    if (!overallSuccess) {
      responseBody.recomendacoes = [
        'Validar no Mercos se os tokens usados neste distribuidor possuem permissao para o recurso /categorias.',
        'Após corrigir permissões/tokens, execute novamente /api/admin/categories/sync-mercos e depois /api/admin/categories/sync-global.',
      ];
    }

    return NextResponse.json(responseBody, { status: !overallSuccess && strict === true ? 424 : 200 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Erro na sincronização',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * GET /api/admin/categories/sync-mercos
 * Retorna status da última sincronização por distribuidor
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidor_id = searchParams.get('distribuidor_id');

    let query = supabaseAdmin
      .from('distribuidor_categories')
      .select('distribuidor_id, updated_at, ativo')
      .order('updated_at', { ascending: false });

    if (distribuidor_id) {
      query = query.eq('distribuidor_id', distribuidor_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    // Agrupar por distribuidor
    const statusPorDistribuidor = new Map();

    for (const cat of data || []) {
      const existing = statusPorDistribuidor.get(cat.distribuidor_id);
      if (!existing || new Date(cat.updated_at) > new Date(existing.ultima_sincronizacao)) {
        statusPorDistribuidor.set(cat.distribuidor_id, {
          distribuidor_id: cat.distribuidor_id,
          ultima_sincronizacao: cat.updated_at,
          total_categorias: (existing?.total_categorias || 0) + 1,
          categorias_ativas: cat.ativo ? (existing?.categorias_ativas || 0) + 1 : (existing?.categorias_ativas || 0)
        });
      } else {
        const current = statusPorDistribuidor.get(cat.distribuidor_id);
        current.total_categorias++;
        if (cat.ativo) current.categorias_ativas++;
      }
    }

    return NextResponse.json({
      success: true,
      distribuidores: Array.from(statusPorDistribuidor.values())
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
