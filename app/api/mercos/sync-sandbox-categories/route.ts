import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function fetchWith429Retry(url: string, init: RequestInit, maxAttempts = 6): Promise<Response> {
  let attempt = 1;
  while (true) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    let wait = 5000;
    try {
      const body = await res.json();
      if (body?.tempo_ate_permitir_novamente) {
        wait = Math.max(wait, body.tempo_ate_permitir_novamente * 1000);
      }
    } catch {}
    const backoff = Math.min(30000, 1000 * Math.pow(2, attempt - 1));
    wait = Math.max(wait, backoff);
    if (attempt >= maxAttempts) return res;
    console.warn(`[SYNC-SANDBOX-CATEGORIES] 429 recebido. Tentativa ${attempt}/${maxAttempts - 1}. Aguardando ${Math.round(wait/1000)}s...`);
    await new Promise(r => setTimeout(r, wait));
    attempt++;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { companyToken, distribuidorId, alteradoApos, nomePrefix, maxPages } = await request.json();

    console.log('==================================================');
    console.log('[SYNC-SANDBOX-CATEGORIES] 🔄 Sincronizando categorias do SANDBOX');
    console.log('[SYNC-SANDBOX-CATEGORIES] Distribuidor ID:', distribuidorId);
    console.log('[SYNC-SANDBOX-CATEGORIES] alterado_apos recebido:', alteradoApos);

    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';

    if (!companyToken) {
      return NextResponse.json({
        success: false,
        error: 'Company Token do SANDBOX é obrigatório'
      }, { status: 400 });
    }

    if (!distribuidorId) {
      return NextResponse.json({
        success: false,
        error: 'ID do distribuidor é obrigatório'
      }, { status: 400 });
    }

    // Validar se o distribuidor existe
    const { data: dist, error: distErr } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome')
      .eq('id', distribuidorId)
      .single();
    if (distErr || !dist) {
      return NextResponse.json({ success: false, error: 'Distribuidor inválido ou não encontrado', distribuidorId }, { status: 404 });
    }

    // Buscar categorias com paginação via alterado_apos
    console.log('[SYNC-SANDBOX-CATEGORIES] 🔄 Buscando categorias da API (paginado)...');

    const baseUrl = `https://sandbox.mercos.com/api/v1`;
    const headers = {
      'ApplicationToken': SANDBOX_APP_TOKEN,
      'CompanyToken': companyToken,
      'Content-Type': 'application/json',
    };

    let allCategorias: any[] = [];
    let dataInicial = alteradoApos || '2020-01-01T00:00:00';
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < (Number(maxPages) > 0 ? Number(maxPages) : 500)) {
      pageCount++;
      const endpoint = `/categorias?alterado_apos=${encodeURIComponent(dataInicial)}&limit=200&order_by=ultima_alteracao&order_direction=asc`;
      console.log(`[SYNC-SANDBOX-CATEGORIES] 📄 Página ${pageCount}: ${endpoint}`);

      const response = await fetchWith429Retry(`${baseUrl}${endpoint}`, { headers });
      if (response.status === 429) {
        let bodyText = await response.text();
        let retrySec = 5;
        try {
          const obj = JSON.parse(bodyText);
          if (obj && obj.tempo_ate_permitir_novamente != null) {
            retrySec = Number(obj.tempo_ate_permitir_novamente);
          }
        } catch {}
        return NextResponse.json({
          success: false,
          error: 'Mercos limit: aguarde e tente novamente',
          tempo_ate_permitir_novamente: retrySec
        }, { status: 429, headers: { 'Retry-After': String(retrySec) } });
      }
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SYNC-SANDBOX-CATEGORIES] ❌ Erro na API Mercos:', errorText);
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      const pageFiltered = nomePrefix
        ? categoriasArray.filter((c: any) => typeof c?.nome === 'string' && c.nome.startsWith(nomePrefix))
        : categoriasArray;

      console.log(`[SYNC-SANDBOX-CATEGORIES] ✅ Recebidas ${categoriasArray.length} categorias nesta página`);

      allCategorias = [...allCategorias, ...pageFiltered];

      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      if (nomePrefix && pageFiltered.length > 0) {
        hasMore = false;
        console.log('[SYNC-SANDBOX-CATEGORIES] Encontrado por prefixo, encerrando paginação');
      } else if (limitouRegistros && categoriasArray.length > 0) {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        // avança 1s para evitar loop quando a API considera >=
        const ts = ultimaCategoria.ultima_alteracao;
        const nextDate = new Date(ts);
        if (!isNaN(nextDate.getTime())) {
          nextDate.setSeconds(nextDate.getSeconds() + 1);
          dataInicial = nextDate.toISOString();
        } else {
          dataInicial = ts;
        }
        console.log(`[SYNC-SANDBOX-CATEGORIES] ➡️ Próxima página a partir de: ${dataInicial}`);
      } else {
        hasMore = false;
        console.log('[SYNC-SANDBOX-CATEGORIES] ✅ Todas as páginas buscadas!');
      }
    }

    console.log(`[SYNC-SANDBOX-CATEGORIES] 📊 Total recebidas da API: ${allCategorias.length}`);

    if (allCategorias.length === 0) {
      return NextResponse.json({
        success: true,
        resultado: {
          total_mercos: 0,
          inseridas: 0,
          atualizadas: 0,
          erros: 0
        }
      });
    }

    // Preparar dados para upsert
    const rows = allCategorias.map(cat => ({
      distribuidor_id: distribuidorId,
      mercos_id: cat.id,
      nome: cat.nome,
      categoria_pai_id: cat.categoria_pai_id,
      ativo: cat.excluido === true ? false : true,
      updated_at: new Date().toISOString()
    }));

    // Upsert com retorno para contabilizar resultados reais
    console.log('[SYNC-SANDBOX-CATEGORIES] 🔄 Executando upsert com retorno...');
    const { data: upsertData, error: upsertError } = await supabaseAdmin
      .from('distribuidor_categories')
      .upsert(rows, { onConflict: 'distribuidor_id,mercos_id' })
      .select('id, mercos_id, nome');

    if (upsertError) {
      console.error('[SYNC-SANDBOX-CATEGORIES] ❌ Erro no upsert:', upsertError);
      throw new Error(`Erro no banco: ${upsertError.message}`);
    }

    // Verificar presença específica das categorias do lote atual
    const mercosIdsInseridos = (upsertData || []).map(r => r.mercos_id);
    console.log('[SYNC-SANDBOX-CATEGORIES] ✅ Upsert concluído para IDs:', mercosIdsInseridos.slice(0, 10));

    const { data: verif } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('mercos_id, nome')
      .eq('distribuidor_id', distribuidorId)
      .in('mercos_id', allCategorias.map((c:any) => c.id));

    const verifNomes = (verif || []).map(v => v.nome);
    console.log('[SYNC-SANDBOX-CATEGORIES] 🔍 Verificação pós-upsert (nomes):', verifNomes);

    console.log(`[SYNC-SANDBOX-CATEGORIES] ✅ Sincronização concluída!`);

    return NextResponse.json({
      success: true,
      resultado: {
        total_mercos: allCategorias.length,
        inseridas: upsertData?.length || 0,
        atualizadas: 0,
        erros: 0,
        verificados: verif || [],
        nomePrefix: nomePrefix || null
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error: any) {
    console.error('[SYNC-SANDBOX-CATEGORIES] ❌ ERRO FATAL:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erro desconhecido',
        details: error.stack
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const distribuidorId = url.searchParams.get('distribuidorId') || '';
    const alteradoApos = url.searchParams.get('alteradoApos') || '2020-01-01T00:00:00';
    const companyTokenParam = url.searchParams.get('companyToken') || '';
    const full = url.searchParams.get('full') === '1' || url.searchParams.get('full') === 'true';
    const nomePrefix = url.searchParams.get('nomePrefix') || url.searchParams.get('prefix') || '';
    const maxPages = Number(url.searchParams.get('maxPages') || '0');

    console.log('==================================================');
    console.log('[SYNC-SANDBOX-CATEGORIES][GET] 🔍 Consulta paginada (somente leitura)');
    console.log('[SYNC-SANDBOX-CATEGORIES][GET] distribuidorId=', distribuidorId);
    console.log('[SYNC-SANDBOX-CATEGORIES][GET] alterado_apos=', alteradoApos);

    const SANDBOX_APP_TOKEN = 'd39001ac-0b14-11f0-8ed7-6e1485be00f2';
    let companyToken = companyTokenParam;

    // Buscar token no banco se distribuidorId informado
    if (!companyToken && distribuidorId) {
      const { data: dist } = await supabaseAdmin
        .from('distribuidores')
        .select('mercos_company_token, mercos_application_token')
        .eq('id', distribuidorId)
        .maybeSingle();
      if (dist?.mercos_company_token) {
        companyToken = dist.mercos_company_token as string;
      }
    }

    // Fallback para token do sandbox usado nos testes
    if (!companyToken) {
      companyToken = '4b866744-a086-11f0-ada6-5e65486a6283';
    }

    const baseUrl = 'https://sandbox.mercos.com/api/v1';
    const headers = {
      'ApplicationToken': SANDBOX_APP_TOKEN,
      'CompanyToken': companyToken,
      'Content-Type': 'application/json',
    } as Record<string, string>;

    let allCategorias: any[] = [];
    let cursor = alteradoApos;
    let hasMore = true;
    let pageCount = 0;

    while (hasMore && pageCount < (maxPages > 0 ? maxPages : 500)) {
      pageCount++;
      const endpoint = `/categorias?alterado_apos=${encodeURIComponent(cursor)}&limit=200&order_by=ultima_alteracao&order_direction=asc`;
      console.log(`[SYNC-SANDBOX-CATEGORIES][GET] Página ${pageCount}: ${endpoint}`);

      const response = await fetchWith429Retry(`${baseUrl}${endpoint}`, { headers });
      if (response.status === 429) {
        let bodyText = await response.text();
        let retrySec = 5;
        try {
          const obj = JSON.parse(bodyText);
          if (obj && obj.tempo_ate_permitir_novamente != null) {
            retrySec = Number(obj.tempo_ate_permitir_novamente);
          }
        } catch {}
        return NextResponse.json({
          success: false,
          error: 'Mercos limit: aguarde e tente novamente',
          tempo_ate_permitir_novamente: retrySec
        }, { status: 429, headers: { 'Retry-After': String(retrySec) } });
      }
      if (!response.ok) {
        const txt = await response.text();
        console.error('[SYNC-SANDBOX-CATEGORIES][GET] ❌ Erro na API Mercos:', txt);
        throw new Error(`Erro Mercos API: ${response.status} - ${txt}`);
      }

      const arr = await response.json();
      const page = Array.isArray(arr) ? arr : [];
      const pageFiltered = nomePrefix
        ? page.filter((c: any) => typeof c?.nome === 'string' && c.nome.startsWith(nomePrefix))
        : page;
      allCategorias = allCategorias.concat(pageFiltered);

      const limited = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';
      if (nomePrefix && pageFiltered.length > 0) {
        hasMore = false;
        console.log('[SYNC-SANDBOX-CATEGORIES][GET] Encontrado por prefixo, encerrando paginação');
      } else if (limited && page.length > 0) {
        const last = page[page.length - 1];
        const d = new Date(last.ultima_alteracao);
        if (!isNaN(d.getTime())) {
          d.setSeconds(d.getSeconds() + 1);
          cursor = d.toISOString();
        } else {
          cursor = last.ultima_alteracao;
        }
        console.log(`[SYNC-SANDBOX-CATEGORIES][GET] Próxima página a partir de: ${cursor}`);
      } else {
        hasMore = false;
        console.log('[SYNC-SANDBOX-CATEGORIES][GET] ✅ Todas as páginas buscadas!');
      }
    }

    return NextResponse.json({
      success: true,
      total: allCategorias.length,
      primeiras_5: allCategorias.slice(0, 5).map(c => ({ id: c.id, nome: c.nome, excluido: c.excluido })),
      exemplo_busca_bcb369e5: allCategorias.find((c: any) => typeof c.nome === 'string' && c.nome.startsWith('bcb369e5'))?.nome || null,
      data: full ? allCategorias : undefined,
      debug: {
        pages: pageCount,
        alterado_apos_inicial: alteradoApos,
        ultimo_alterado_apos: cursor,
        nomePrefix: nomePrefix || null
      }
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
