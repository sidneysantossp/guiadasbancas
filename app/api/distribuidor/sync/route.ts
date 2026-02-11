import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutos - necessário para processar catálogos grandes

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

    // Carregar mapeamento de categorias Mercos → distribuidor_categories UUID
    const { data: distCategories } = await supabaseAdmin
      .from('distribuidor_categories')
      .select('id, mercos_id')
      .eq('distribuidor_id', distribuidorId);
    
    const categoryMap = new Map<number, string>();
    for (const cat of distCategories || []) {
      if (cat.mercos_id) categoryMap.set(cat.mercos_id, cat.id);
    }
    console.log(`[Sync] ${categoryMap.size} categorias mapeadas`);

    let produtosNovos = 0;
    let produtosAtualizados = 0;
    let erros = 0;
    const now = new Date().toISOString();
    // Rastrear o maior ultima_alteracao dos produtos processados (cursor real do Mercos)
    let latestMercosTimestamp: string | null = null;
    const INSERT_BATCH_SIZE = 200;
    const UPDATE_CONCURRENCY = 10;

    // PASSO 1: Buscar todos os mercos_ids existentes de uma vez (evita upsert com partial index)
    const { data: existingProducts } = await supabaseAdmin
      .from('products')
      .select('id, mercos_id, images, category_id')
      .eq('distribuidor_id', distribuidorId)
      .not('mercos_id', 'is', null);

    const existentes = new Map<number, { id: string; images: any; category_id: string | null }>(
      (existingProducts || []).map((r: any) => [r.mercos_id as number, { id: r.id, images: r.images, category_id: r.category_id }])
    );
    console.log(`[Sync] ${existentes.size} produtos já existem no banco`);

    // PASSO 2: Separar produtos em novos e existentes
    const novosPayload: any[] = [];
    const updatesPayload: { id: string; data: any }[] = [];

    for (const produto of allProdutos) {
      const isExcluido = !!produto.excluido;
      const existing = existentes.get(produto.id);

      // Produto excluído: deletar se existir, ignorar se não
      if (isExcluido) {
        if (existing) {
          await supabaseAdmin.from('products').delete().eq('id', existing.id);
        }
        continue;
      }

      // Preservar imagens existentes
      const existingImages = existing?.images || [];
      const hasExistingImages = Array.isArray(existingImages) && existingImages.length > 0;

      // Mapear categoria Mercos → distribuidor_categories UUID
      const resolvedCategoryId = (produto.categoria_id && categoryMap.has(produto.categoria_id))
        ? categoryMap.get(produto.categoria_id)!
        : null;

      // Atualizar cursor do Mercos com o maior ultima_alteracao
      if (produto.ultima_alteracao) {
        const ts = produto.ultima_alteracao.toString();
        if (!latestMercosTimestamp || ts > latestMercosTimestamp) {
          latestMercosTimestamp = ts;
        }
      }

      const produtoData: any = {
        name: produto.nome || 'Sem nome',
        description: produto.descricao || produto.observacoes || '',
        price: parseFloat(produto.preco_tabela) || 0,
        stock_qty: produto.saldo_estoque || 0,
        active: true,
        mercos_id: produto.id,
        codigo_mercos: produto.codigo || null,
        distribuidor_id: distribuidorId,
        sincronizado_em: now,
        origem: 'mercos',
        track_stock: true,
        sob_encomenda: false,
        pre_venda: false,
        pronta_entrega: true,
        category_id: resolvedCategoryId || existing?.category_id || null,
      };

      if (existing) {
        // Preservar imagens existentes
        if (hasExistingImages) produtoData.images = existingImages;
        updatesPayload.push({ id: existing.id, data: produtoData });
      } else {
        produtoData.images = [];
        novosPayload.push(produtoData);
      }
    }

    console.log(`[Sync] ${novosPayload.length} novos, ${updatesPayload.length} para atualizar`);

    // PASSO 3: Inserir novos em lotes
    for (let i = 0; i < novosPayload.length; i += INSERT_BATCH_SIZE) {
      const batch = novosPayload.slice(i, i + INSERT_BATCH_SIZE);
      const { error } = await supabaseAdmin.from('products').insert(batch);
      if (error) {
        console.error(`[Sync] Erro ao inserir batch:`, error.message);
        erros += batch.length;
      } else {
        produtosNovos += batch.length;
      }
    }

    // PASSO 4: Atualizar existentes com concorrência limitada
    for (let i = 0; i < updatesPayload.length; i += UPDATE_CONCURRENCY) {
      const slice = updatesPayload.slice(i, i + UPDATE_CONCURRENCY);
      const results = await Promise.allSettled(
        slice.map(async (u) => {
          const { error } = await supabaseAdmin.from('products').update(u.data).eq('id', u.id);
          if (error) throw error;
        })
      );
      results.forEach(r => {
        if (r.status === 'fulfilled') produtosAtualizados++;
        else erros++;
      });
    }

    // Se sincronização full, desativar produtos que não vieram na resposta
    if (full && allProdutos.length > 0) {
      const mercosIdsSet = new Set(allProdutos.map((p: any) => p.id));
      const toDeactivate = (existingProducts || [])
        .filter((p: any) => !mercosIdsSet.has(p.mercos_id))
        .map((p: any) => p.id);

      for (let i = 0; i < toDeactivate.length; i += 500) {
        const chunk = toDeactivate.slice(i, i + 500);
        await supabaseAdmin.from('products').update({ active: false }).in('id', chunk);
      }
      console.log(`[Sync] ${toDeactivate.length} produtos desativados (não vieram na resposta)`);
    }

    // Atualizar última sincronização usando o timestamp do Mercos (não server time)
    // Isso garante que o próximo sync incremental busque a partir do ponto correto
    const syncTimestamp = latestMercosTimestamp || distribuidor.ultima_sincronizacao || now;
    console.log(`[Sync] Cursor de sync: latestMercos=${latestMercosTimestamp}, usando=${syncTimestamp}`);
    await supabaseAdmin
      .from('distribuidores')
      .update({ ultima_sincronizacao: syncTimestamp })
      .eq('id', distribuidorId);

    // Contar total de produtos ativos
    const { count: totalProdutos } = await supabaseAdmin
      .from('products')
      .select('id', { count: 'exact', head: true })
      .eq('distribuidor_id', distribuidorId)
      .eq('active', true);

    console.log(`[Sync] Concluído: ${produtosNovos} novos, ${produtosAtualizados} atualizados, ${erros} erros`);

    return NextResponse.json({
      success: true,
      data: {
        produtos_novos: produtosNovos,
        produtos_atualizados: produtosAtualizados,
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
