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
    const { companyToken, distribuidorId, alteradoApos } = await request.json();
    
    console.log('==================================================');
    console.log('[SYNC-SANDBOX-CATEGORIES] 🔄 Sincronizando categorias do SANDBOX');
    console.log('[SYNC-SANDBOX-CATEGORIES] Distribuidor ID:', distribuidorId);

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

    // Validar se o distribuidor existe (evita 36 erros por FK inválida)
    const { data: dist, error: distErr } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome')
      .eq('id', distribuidorId)
      .single();
    if (distErr || !dist) {
      return NextResponse.json({ success: false, error: 'Distribuidor inválido ou não encontrado', distribuidorId }, { status: 404 });
    }

    // Buscar TODAS as categorias do SANDBOX com paginação adequada
    let allCategorias: any[] = [];
    let dataInicial = alteradoApos || '2000-01-01T00:00:00';
    let hasMore = true;
    let pageCount = 0;
    const LIMIT = 100; // Limite por página

    console.log('[SYNC-SANDBOX-CATEGORIES] 🔄 Iniciando paginação por timestamp...');

    while (hasMore && pageCount < 50) {
      pageCount++;
      
      // Construir endpoint com paginação por timestamp
      const endpoint = `/categorias?alterado_apos=${encodeURIComponent(dataInicial)}&limit=${LIMIT}`;
      console.log(`[SYNC-SANDBOX-CATEGORIES] 🔗 Endpoint: ${endpoint}`);
      
      console.log(`[SYNC-SANDBOX-CATEGORIES] 📄 Página ${pageCount} (timestamp: ${dataInicial})`);
      
      const url = `https://sandbox.mercos.com/api/v1${endpoint}`;
      const headers = {
        'ApplicationToken': SANDBOX_APP_TOKEN,
        'CompanyToken': companyToken,
        'Content-Type': 'application/json',
      };

      const response = await fetchWith429Retry(url, { headers });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[SYNC-SANDBOX-CATEGORIES] ❌ Erro:', errorText);
        throw new Error(`Erro Mercos API: ${response.status} - ${errorText}`);
      }

      const categorias = await response.json();
      const categoriasArray = Array.isArray(categorias) ? categorias : [];
      
      console.log(`[SYNC-SANDBOX-CATEGORIES] 📦 Recebidas ${categoriasArray.length} categorias nesta página`);
      
      if (categoriasArray.length === 0) {
        console.log('[SYNC-SANDBOX-CATEGORIES] ✅ Nenhuma categoria retornada - fim da paginação');
        hasMore = false;
        break;
      }
      
      allCategorias = [...allCategorias, ...categoriasArray];

      // Verificar se há mais páginas usando header
      const limitouRegistros = response.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS');

      // Se header não existir, assume continuidade se veio um lote cheio
      const deveContinuar = (limitouRegistros === '1') || (categoriasArray.length >= LIMIT);

      if (deveContinuar && categoriasArray.length > 0) {
        const ultimaCategoria = categoriasArray[categoriasArray.length - 1];
        dataInicial = ultimaCategoria.ultima_alteracao;
        console.log(`[SYNC-SANDBOX-CATEGORIES] ➡️ Próxima página: timestamp=${dataInicial}`);
      } else {
        console.log('[SYNC-SANDBOX-CATEGORIES] ✅ Última página alcançada (sem limitação)');
        hasMore = false;
      }

      // Pequena pausa entre requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`[SYNC-SANDBOX-CATEGORIES] 📊 Total categorias: ${allCategorias.length}`);

    // Carregar mercos_ids existentes para calcular inseridas/atualizadas
    const { data: existingList, error: existingErr } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('mercos_id')
      .eq('distribuidor_id', distribuidorId);
    if (existingErr) {
      console.error('[SYNC-SANDBOX-CATEGORIES] Erro ao buscar existentes:', existingErr);
    }
    const existingSet = new Set<number>((existingList || []).map((r: any) => r.mercos_id));

    const rows = allCategorias.map(cat => ({
      distribuidor_id: distribuidorId,
      mercos_id: cat.id,
      nome: cat.nome,
      categoria_pai_id: cat.categoria_pai_id,
      ativo: cat.excluido === true ? false : true,
      updated_at: new Date().toISOString()
    }));

    let inseridas = 0;
    let atualizadas = 0;
    let erros = 0;
    const errorDetails: Array<{mercos_id:number; nome:string; erro:string}> = [];

    for (const r of rows) {
      if (existingSet.has(r.mercos_id)) atualizadas++; else inseridas++;
    }

    // Upsert em lotes
    const CHUNK = 200;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      const { error } = await supabaseAdmin
        .from('distribuidor_categories')
        .upsert(chunk, { onConflict: 'distribuidor_id,mercos_id' });
      if (error) {
        console.error('[SYNC-SANDBOX-CATEGORIES] Erro no upsert em lote:', error);
        erros += chunk.length;
        errorDetails.push({ mercos_id: chunk[0]?.mercos_id, nome: chunk[0]?.nome, erro: error.message || 'upsert error' });
      }
      // pequena pausa para não sobrecarregar
      await new Promise(r => setTimeout(r, 50));
    }

    console.log(`[SYNC-SANDBOX-CATEGORIES] ✅ Inseridas: ${inseridas}`);
    console.log(`[SYNC-SANDBOX-CATEGORIES] ✅ Atualizadas: ${atualizadas}`);
    console.log(`[SYNC-SANDBOX-CATEGORIES] ❌ Erros: ${erros}`);

    return NextResponse.json({
      success: true,
      resultado: {
        total_mercos: allCategorias.length,
        inseridas,
        atualizadas,
        erros,
        erros_exemplo: errorDetails.slice(0, 5)
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
