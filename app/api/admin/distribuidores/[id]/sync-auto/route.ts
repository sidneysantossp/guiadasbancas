import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { MercosAPI } from '@/lib/mercos-api';

/**
 * Sincronização Automática Completa
 * Processa TODOS os produtos da Mercos diretamente (sem self-fetch)
 * Busca por lotes usando getAllProdutosGenerator e insere/atualiza no banco
 */
export const maxDuration = 300; // 5 minutos

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now();
  const MAX_EXECUTION_TIME = 270 * 1000; // 4.5 minutos em ms
  const INSERT_BATCH_SIZE = 200;
  const UPDATE_CONCURRENCY = 10;

  console.log(`[SYNC-AUTO] ===== SINCRONIZAÇÃO AUTOMÁTICA INICIADA =====`);
  console.log(`[SYNC-AUTO] Distribuidor ID: ${params.id}`);
  
  try {
    const distribuidorId = params.id;
    const supabase = supabaseAdmin;

    // Buscar dados do distribuidor
    const { data: distribuidor, error: distError } = await supabase
      .from('distribuidores')
      .select('*')
      .eq('id', distribuidorId)
      .single();

    if (distError || !distribuidor) {
      return NextResponse.json({ success: false, error: 'Distribuidor não encontrado' }, { status: 404 });
    }

    console.log(`[SYNC-AUTO] Distribuidor: ${distribuidor.nome}`);

    // Inicializar API Mercos
    const mercosApi = new MercosAPI({
      applicationToken: distribuidor.application_token,
      companyToken: distribuidor.company_token,
      baseUrl: distribuidor.base_url || 'https://app.mercos.com/api/v1',
    });

    // Testar conexão
    const connectionTest = await mercosApi.testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: `Falha ao conectar com API Mercos: ${connectionTest.error}`,
      }, { status: 400 });
    }
    console.log(`[SYNC-AUTO] ✅ Conexão OK`);

    // Sincronização completa: buscar desde o início
    const syncTimestamp = distribuidor.ultima_sincronizacao || null;
    console.log(`[SYNC-AUTO] Última sync: ${syncTimestamp || 'nunca'}`);

    // Buscar mapa de categorias do distribuidor
    const { data: distCategories } = await supabase
      .from('distribuidor_categories')
      .select('id, mercos_id')
      .eq('distribuidor_id', distribuidorId);
    const categoryMap = new Map<number, string>();
    for (const cat of distCategories || []) {
      if (cat.mercos_id) categoryMap.set(cat.mercos_id, cat.id);
    }
    console.log(`[SYNC-AUTO] ${categoryMap.size} categorias mapeadas`);

    let produtosNovos = 0;
    let produtosAtualizados = 0;
    let processados = 0;
    let recebidos = 0;
    let atingiuLimiteTempo = false;
    const erros: string[] = [];

    // Processar produtos por lotes via streaming
    for await (const lote of mercosApi.getAllProdutosGenerator({ batchSize: 200, alteradoApos: syncTimestamp })) {
      recebidos += lote.length;
      console.log(`[SYNC-AUTO] Lote: ${lote.length} produtos (total recebidos: ${recebidos})`);

      if ((Date.now() - startTime) > MAX_EXECUTION_TIME) {
        atingiuLimiteTempo = true;
        break;
      }

      // Buscar existentes em uma consulta
      const mercosIds = lote.map(p => p.id);
      const { data: existentesRows } = await supabase
        .from('products')
        .select('id, mercos_id, images, category_id')
        .eq('distribuidor_id', distribuidorId)
        .in('mercos_id', mercosIds);

      const existentes = new Map<number, { id: string; images: any; category_id: string | null }>(
        (existentesRows || []).map(r => [r.mercos_id as number, { id: r.id, images: r.images, category_id: r.category_id }])
      );

      const novosPayload: any[] = [];
      const updatesPayload: { id: string; data: any }[] = [];

      for (const produtoMercos of lote) {
        if ((Date.now() - startTime) > MAX_EXECUTION_TIME) { atingiuLimiteTempo = true; break; }
        processados++;

        const isExcluido = !!produtoMercos.excluido;
        const existing = existentes.get(produtoMercos.id);

        // Produto excluído: deletar se existir, ignorar se não (Mercos: ativo=false NÃO significa inativo)
        if (isExcluido) {
          if (existing) {
            await supabase.from('products').delete().eq('id', existing.id);
          }
          continue;
        }

        // Preservar imagens e categoria existentes
        const existingImages = existing?.images || [];
        const hasExistingImages = Array.isArray(existingImages) && existingImages.length > 0;
        const mercosCatId = produtoMercos.categoria_id;
        const mappedCategoryId = mercosCatId ? categoryMap.get(mercosCatId) : null;
        const finalCategoryId = existing?.category_id || mappedCategoryId || null;

        const produtoData: any = {
          name: produtoMercos.nome,
          description: produtoMercos.observacoes || '',
          price: produtoMercos.preco_tabela,
          stock_qty: produtoMercos.saldo_estoque || 0,
          images: hasExistingImages ? existingImages : [],
          banca_id: null,
          distribuidor_id: distribuidorId,
          mercos_id: produtoMercos.id,
          codigo_mercos: produtoMercos.codigo || null,
          category_id: finalCategoryId,
          origem: 'mercos' as const,
          sincronizado_em: new Date().toISOString(),
          track_stock: true,
          sob_encomenda: false,
          pre_venda: false,
          pronta_entrega: true,
          active: !produtoMercos.excluido, // Mercos: ativo=false NÃO significa inativo no catálogo, apenas excluido importa
        };

        if (existing) {
          updatesPayload.push({ id: existing.id, data: produtoData });
        } else {
          novosPayload.push(produtoData);
        }
      }

      // Inserir novos em lotes
      for (let i = 0; i < novosPayload.length; i += INSERT_BATCH_SIZE) {
        if ((Date.now() - startTime) > MAX_EXECUTION_TIME) { atingiuLimiteTempo = true; break; }
        const batch = novosPayload.slice(i, i + INSERT_BATCH_SIZE);
        const { error } = await supabase.from('products').insert(batch);
        if (error) {
          console.error('[SYNC-AUTO] ❌ Erro ao inserir batch:', error.message);
          erros.push(`Erro ao inserir batch: ${error.message}`);
        } else {
          produtosNovos += batch.length;
        }
      }

      // Atualizar existentes com concorrência limitada
      for (let i = 0; i < updatesPayload.length; i += UPDATE_CONCURRENCY) {
        if ((Date.now() - startTime) > MAX_EXECUTION_TIME) { atingiuLimiteTempo = true; break; }
        const slice = updatesPayload.slice(i, i + UPDATE_CONCURRENCY);
        await Promise.allSettled(
          slice.map(async (u) => {
            const { error } = await supabase.from('products').update(u.data).eq('id', u.id);
            if (error) {
              erros.push(`Erro ao atualizar: ${error.message}`);
            } else {
              produtosAtualizados++;
            }
          })
        );
      }

      if (atingiuLimiteTempo) break;
    }

    if (atingiuLimiteTempo) {
      erros.push('⏱️ Tempo esgotado. Execute novamente para continuar.');
    }

    // Estatísticas finais
    const { count: totalGeral } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId);

    const { count: totalAtivos } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    // Atualizar última sincronização apenas se concluiu sem timeout
    const novaUltimaSync = !atingiuLimiteTempo ? new Date().toISOString() : (distribuidor.ultima_sincronizacao || null);
    await supabase
      .from('distribuidores')
      .update({
        ultima_sincronizacao: novaUltimaSync,
        total_produtos: totalGeral || 0,
      })
      .eq('id', distribuidorId);

    const tempoTotal = ((Date.now() - startTime) / 1000).toFixed(1);
    const completed = !atingiuLimiteTempo;

    console.log(`[SYNC-AUTO] ===== FINALIZADO em ${tempoTotal}s =====`);
    console.log(`[SYNC-AUTO] Novos: ${produtosNovos} | Atualizados: ${produtosAtualizados} | Total banco: ${totalGeral}`);

    return NextResponse.json({
      success: true,
      data: {
        completed,
        produtos_novos: produtosNovos,
        produtos_ignorados: produtosAtualizados,
        total_ativos: totalAtivos || 0,
        total_geral: totalGeral || 0,
        tempo_execucao: `${tempoTotal}s`,
        erros,
        message: completed
          ? `✅ Sincronização completa! ${produtosNovos} novos, ${produtosAtualizados} atualizados em ${tempoTotal}s.`
          : `⚠️ Sincronização parcial (timeout). ${produtosNovos} novos, ${produtosAtualizados} atualizados. Execute novamente.`
      }
    });
    
  } catch (error: any) {
    console.error('[SYNC-AUTO] ❌ Erro geral:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Erro desconhecido' },
      { status: 500 }
    );
  }
}
