import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const distribuidorId = searchParams.get('id');
    const full = searchParams.get('full') === 'true';

    if (!distribuidorId) {
      return NextResponse.json(
        { success: false, error: 'ID do distribuidor é obrigatório' },
        { status: 400 }
      );
    }

    console.log(`[Sync] Iniciando sincronização para distribuidor ${distribuidorId} (full: ${full})`);

    // Buscar dados do distribuidor incluindo status ativo e base_url
    const { data: distribuidor, error: distError } = await supabaseAdmin
      .from('distribuidores')
      .select('id, nome, ativo, application_token, company_token, base_url, ultima_sincronizacao')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({
        success: false,
        error: 'Distribuidor não encontrado',
      });
    }

    // Verificar se o distribuidor está ativo no admin
    if (!distribuidor.ativo) {
      return NextResponse.json({
        success: false,
        error: 'Integração desativada pelo administrador.',
        isDisabled: true,
      });
    }

    // Verificar se tem tokens configurados (sem expor detalhes sensíveis)
    if (!distribuidor.application_token || !distribuidor.company_token) {
      return NextResponse.json({
        success: false,
        error: 'Integração não configurada. Entre em contato com o suporte para ativar.',
        needsSetup: true,
      });
    }

    // Preparar parâmetros da requisição usando base_url configurada
    const baseUrl = distribuidor.base_url || 'https://app.mercos.com/api/v1';
    const BATCH_SIZE = 200; // Limite máximo da API Mercos
    const MAX_PAGES = 100; // Safety cap para evitar loops infinitos
    const allProdutos: any[] = [];

    // Usar paginação por timestamp (alterado_apos) - método correto da Mercos
    let alteradoApos = (!full && distribuidor.ultima_sincronizacao)
      ? distribuidor.ultima_sincronizacao
      : '2020-01-01T00:00:00';
    
    let hasMore = true;
    let pageCount = 0;

    console.log(`[Sync] Iniciando busca de produtos (full=${full}, alterado_apos=${alteradoApos})`);

    while (hasMore && pageCount < MAX_PAGES) {
      pageCount++;
      
      const queryParams = new URLSearchParams();
      queryParams.append('alterado_apos', alteradoApos);
      queryParams.append('limit', BATCH_SIZE.toString());
      queryParams.append('order_by', 'ultima_alteracao');
      queryParams.append('order_direction', 'asc');
      
      const url = `${baseUrl}/produtos?${queryParams.toString()}`;
      console.log(`[Sync] Fetching page ${pageCount}: ${url}`);

      const mercosRes = await fetch(url, {
        headers: {
          'ApplicationToken': distribuidor.application_token,
          'CompanyToken': distribuidor.company_token,
          'Content-Type': 'application/json',
        },
      });

      // Tratamento de throttling (429)
      if (mercosRes.status === 429) {
        const throttleData = await mercosRes.json().catch(() => ({ tempo_ate_permitir_novamente: 5 }));
        const waitTime = (throttleData.tempo_ate_permitir_novamente || 5) * 1000;
        console.log(`[Sync] Throttling detectado, aguardando ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        pageCount--; // Repetir esta página
        continue;
      }

      if (!mercosRes.ok) {
        return NextResponse.json({
          success: false,
          error: `Erro na API Mercos: ${mercosRes.status} ${mercosRes.statusText}`,
        });
      }

      // Verificar header de paginação da Mercos
      const limitouRegistros = mercosRes.headers.get('MEUSPEDIDOS_LIMITOU_REGISTROS') === '1';

      const contentType = mercosRes.headers.get('content-type') || '';
      let produtosPage: any;
      try {
        if (contentType.includes('application/json')) {
          const raw = await mercosRes.text();
          try {
            const parsed = JSON.parse(raw);
            // A Mercos pode retornar { data: [...] } ou diretamente [...]
            produtosPage = (parsed && typeof parsed === 'object' && 'data' in parsed && Array.isArray(parsed.data))
              ? parsed.data
              : parsed;
          } catch (jsonErr: any) {
            throw new Error(`Falha ao parsear JSON (page ${pageCount}): ${jsonErr?.message || jsonErr}. Trecho: ${raw.slice(0, 200)}`);
          }
        } else {
          const text = await mercosRes.text();
          throw new Error(`Resposta não-JSON da Mercos: ${text.slice(0, 200)}`);
        }
      } catch (parseErr: any) {
        return NextResponse.json({
          success: false,
          error: `Resposta inválida da API Mercos (page ${pageCount}): ${parseErr?.message || parseErr}`,
        }, { status: 502 });
      }

      if (!Array.isArray(produtosPage)) {
        return NextResponse.json({
          success: false,
          error: `Resposta inválida da API Mercos (page ${pageCount})`,
        });
      }

      console.log(`[Sync] Página ${pageCount}: ${produtosPage.length} produtos recebidos (limitou=${limitouRegistros})`);

      if (produtosPage.length === 0) {
        hasMore = false;
        break;
      }

      allProdutos.push(...produtosPage);
      
      // Avançar cursor para próxima página usando ultima_alteracao do último produto
      if (limitouRegistros && produtosPage.length > 0) {
        // Ordenar para garantir que pegamos o último
        produtosPage.sort((a: any, b: any) => {
          const ta = (a.ultima_alteracao || '').toString();
          const tb = (b.ultima_alteracao || '').toString();
          return ta.localeCompare(tb);
        });
        const ultimoProduto = produtosPage[produtosPage.length - 1];
        if (ultimoProduto?.ultima_alteracao) {
          alteradoApos = ultimoProduto.ultima_alteracao;
          console.log(`[Sync] Próxima página com alterado_apos=${alteradoApos}`);
        } else {
          hasMore = false;
        }
      } else {
        // Não limitou registros = última página
        hasMore = false;
      }
    }
    
    if (pageCount >= MAX_PAGES) {
      console.log(`[Sync] ⚠️ Atingiu limite de ${MAX_PAGES} páginas`);
    }

    console.log(`[Sync] ${allProdutos.length} produtos recebidos da Mercos (full=${full})`);

    let produtosProcessados = 0;
    let erros = 0;

    // Processar em lotes grandes usando UPSERT (muito mais rápido)
    const UPSERT_BATCH_SIZE = 500;
    const now = new Date().toISOString();
    
    for (let i = 0; i < allProdutos.length; i += UPSERT_BATCH_SIZE) {
      const batch = allProdutos.slice(i, i + UPSERT_BATCH_SIZE);
      
      // Preparar payload para upsert
      const upsertPayload = batch.map((produto: any) => ({
        name: produto.nome || 'Sem nome',
        description: produto.descricao || produto.observacoes || '',
        price: parseFloat(produto.preco_tabela) || 0,
        stock_qty: produto.saldo_estoque || 0,
        active: Boolean(produto.ativo && !produto.excluido),
        mercos_id: produto.id,
        codigo_mercos: produto.codigo || null,
        distribuidor_id: distribuidorId,
        sincronizado_em: now,
        origem: 'mercos',
        track_stock: true,
        sob_encomenda: false,
        pre_venda: false,
        pronta_entrega: true,
        // NÃO incluir category_id para evitar foreign key error
      }));
      
      // UPSERT: insere novos ou atualiza existentes baseado em mercos_id + distribuidor_id
      const { error: upsertError } = await supabaseAdmin
        .from('products')
        .upsert(upsertPayload, {
          onConflict: 'mercos_id,distribuidor_id',
          ignoreDuplicates: false,
        });
      
      if (upsertError) {
        console.error(`[Sync] Erro no upsert batch ${i}:`, upsertError.message);
        erros += batch.length;
      } else {
        produtosProcessados += batch.length;
      }
      
      console.log(`[Sync] Processados ${Math.min(i + UPSERT_BATCH_SIZE, allProdutos.length)}/${allProdutos.length} produtos`);
    }

    // Se sincronização full, desativar produtos que não vieram na resposta
    if (full) {
      const mercosIdsSet = new Set(allProdutos.map((p: any) => String(p.id)));
      // Buscar todos mercos_id existentes para desativar apenas os que não vieram
      const { data: existingMercosIds } = await supabaseAdmin
        .from('products')
        .select('id, mercos_id')
        .eq('distribuidor_id', distribuidorId)
        .not('mercos_id', 'is', null);

      const toDeactivate = (existingMercosIds || [])
        .filter((p: any) => !mercosIdsSet.has(String(p.mercos_id)))
        .map((p: any) => p.id);

      // Desativar em lotes para evitar limites de IN
      const chunkSize = 500;
      for (let i = 0; i < toDeactivate.length; i += chunkSize) {
        const chunk = toDeactivate.slice(i, i + chunkSize);
        await supabaseAdmin
          .from('products')
          .update({ active: false })
          .in('id', chunk);
      }

      // Se resposta veio vazia, desativar todos deste distribuidor
      if (allProdutos.length === 0) {
        await supabaseAdmin
          .from('products')
          .update({ active: false })
          .eq('distribuidor_id', distribuidorId);
      }
    }

    // Atualizar última sincronização
    await supabaseAdmin
      .from('distribuidores')
      .update({ ultima_sincronizacao: new Date().toISOString() })
      .eq('id', distribuidorId);

    // Contar total de produtos ativos
    const { count: totalProdutos } = await supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    console.log(`[Sync] Concluído: ${produtosProcessados} processados, ${erros} erros`);

    return NextResponse.json({
      success: true,
      data: {
        produtos_processados: produtosProcessados,
        erros: erros,
        total_produtos: totalProdutos || 0,
        sincronizado_em: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('[Sync] Erro:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
